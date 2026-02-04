from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
import logging

from export_mongo_to_csv import export_mongo_to_csv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Allow CORS for all origins for now to prevent issues
CORS(app, resources={r"/*": {"origins": "*"}})

# Global variables to store data and model
df = None
similarity_matrix = None

def load_data_and_train():
    """Load data and pre-compute similarity matrix"""
    global df, similarity_matrix
    try:
        csv_path = os.path.join(os.path.dirname(__file__), "Decathlon_data2.csv")

        
        export_mongo_to_csv(csv_path)
        
        logger.info(f"Loading data from {csv_path}...")
        if not os.path.exists(csv_path):
            logger.error(f"File not found: {csv_path}")
            return
        
        
            
        df = pd.read_csv(csv_path)
        
        # Preprocessing similar to the notebook
        df = df[['sku', 'name', 'category', 'brand', 'price', 'rating']]
        
        # Clean price
        df['price'] = (
            df['price']
            .astype(str)
            .str.replace('\u202f', '', regex=False)
            .str.replace('MAD', '', regex=False)
            .str.replace(',', '.', regex=False)
            .str.extract(r'(\d+\.?\d*)')[0]
        )
        df['price'] = pd.to_numeric(df['price'], errors='coerce')
        
        # Drop NaN
        df.dropna(inplace=True)
        
        # Drop duplicates by SKU
        df = df.drop_duplicates(subset=['sku'])
        df.reset_index(drop=True, inplace=True)
        
        logger.info(f"Loaded {len(df)} products after cleaning")
        
        # Feature Engineering for Similarity Calculation
        # Encode categorical variables
        encoded_cat = pd.get_dummies(df[['category', 'brand']])
        
        # Normalize numerical variables
        scaler = MinMaxScaler()
        encoded_num = pd.DataFrame( 
            scaler.fit_transform(df[['price', 'rating']]),
            columns=['price', 'rating']
        )
        
        # Concatenate features
        X = pd.concat([encoded_cat, encoded_num], axis=1)
        
        # Calculate Cosine Similarity
        logger.info("Calculating similarity matrix...")
        similarity_matrix = cosine_similarity(X)
        logger.info("Similarity matrix ready")
        
    except Exception as e:
        logger.error(f"Error initializing ML model: {str(e)}")

# Initialize model on startup
load_data_and_train()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'message': 'FitHub ML Service is running',
        'model_loaded': df is not None and similarity_matrix is not None,
        'product_count': len(df) if df is not None else 0
    })

@app.route('/api/ml/recommend', methods=['POST'])
def get_recommendations():
    """
    Get product recommendations based on product SKU
    Request body: { "sku": "sku-123", "limit": 5 }
    """
    global df, similarity_matrix
    
    if df is None or similarity_matrix is None:
        return jsonify({
            'success': False,
            'error': 'Model not initialized'
        }), 503
        
    try:
        data = request.get_json()
        target_sku = data.get('sku')
        limit = data.get('limit', 5)
        
        if not target_sku:
            return jsonify({
                'success': False,
                'error': 'SKU is required'
            }), 400
            
        # Find product index
        product_indices = df.index[df['sku'] == target_sku].tolist()
        
        if not product_indices:
            return jsonify({
                'success': False,
                'error': 'Product not found in dataset'
            }), 404
            
        product_idx = product_indices[0]
        
        # Get detailed scores
        scores = list(enumerate(similarity_matrix[product_idx]))
        scores = sorted(scores, key=lambda x: x[1], reverse=True)
        
        # Get top N similar products
        recommendations = []
        seen_sku = {target_sku}  # Skip self
        
        for idx, score in scores:
            if idx == product_idx:
                continue
                
            current_sku = df.loc[idx, 'sku']
            
            if current_sku not in seen_sku:
                recommendations.append({
                    "sku": current_sku,
                    "name": df.loc[idx, 'name'],
                    "brand": df.loc[idx, 'brand'],
                    "score": float(score)  # Convert numpy float to python float
                })
                seen_sku.add(current_sku)
                
            if len(recommendations) >= limit:
                break
                
        return jsonify({
            'success': True,
            'source_sku': target_sku,
            'recommendations': recommendations
        })
        
    except Exception as e:
        logger.error(f"Recommendation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    debug = os.getenv('DEBUG', 'True') == 'True'
    app.run(host='0.0.0.0', port=port, debug=debug)
