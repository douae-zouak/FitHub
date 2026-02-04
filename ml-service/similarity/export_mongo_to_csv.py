import os
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

def export_mongo_to_csv(csv_path="Decathlon_data2.csv"):
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    db_name = os.getenv("DB_NAME", "fithub")
    collection_name = os.getenv("COLLECTION_NAME", "products")

    client = MongoClient(mongo_uri)
    db = client[db_name]
    collection = db[collection_name]

    # Charger tous les produits
    data = list(collection.find({}, {
        "_id": 0,
        "sku": 1,
        "name": 1,
        "brand": 1,
        "price": 1,
        "rating": 1,
        "images": 1,
        "category": 1
    }))

    if not data:
        print("⚠️ Aucun produit trouvé dans MongoDB")
        return

    df = pd.DataFrame(data)

    if 'images' in df.columns:
        df['image'] = df['images'].apply(lambda x: x[0] if isinstance(x, list) and len(x) > 0 else "")
        df.drop(columns=['images'], inplace=True)

    # On s'assure que les colonnes sont dans le bon ordre
    df = df[['sku','name','brand','price','rating','lien','image','category']]

    df.to_csv(csv_path, index=False)
    print(f"✅ Export terminé : {len(df)} produits dans {csv_path}")
