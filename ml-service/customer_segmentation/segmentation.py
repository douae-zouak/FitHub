from pymongo import MongoClient
from datetime import datetime, timezone
import pandas as pd
import json
import joblib

# Connexion to MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["fithub"]
orders = db.orders
segments = db.customersegments

# RFM features extraction
data = list(orders.find(
    {"status": "delivered"},
    {"user": 1, "totalAmount": 1, "createdAt": 1}
))

df = pd.DataFrame(data)

# Convert createdAt to UTC tz-aware
df['createdAt'] = pd.to_datetime(df['createdAt'], utc=True)

now = datetime.now(timezone.utc)

rfm = df.groupby("user").agg({
    "totalAmount": "sum",
    "user": "count",                              
    "createdAt": lambda x: (now - x.max()).days  
}).rename(columns={
    "totalAmount": "Sales",
    "user": "Frequency",
    "createdAt": "Recency"
}).reset_index()

# Outlier detection
with open("thresholds.json") as f:
    thresholds = json.load(f)


def is_outlier(row):
    return (
        row["Frequency"] < thresholds["frequency"]["lower"]
        or row["Frequency"] > thresholds["frequency"]["upper"]
        or row["Sales"] < thresholds["sales"]["lower"]
        or row["Sales"] > thresholds["sales"]["upper"]
    )


rfm["is_outlier"] = rfm.apply(is_outlier, axis=1)

# Scaling features
scaler_normal = joblib.load("reg_scaler.pkl")
scaler_outlier = joblib.load("outliers_scaler.pkl")
reg_kmeans = joblib.load("reg_kmeans_model.pkl")
out_kmeans = joblib.load("outliers_kmeans_model.pkl")

# Normal clustering
normal = rfm[~rfm["is_outlier"]]

if not normal.empty:
    X_normal = scaler_normal.transform(normal[["Sales","Frequency","Recency"]])
    normal["cluster"] = reg_kmeans.predict(pd.DataFrame(X_normal, columns=["Sales", "Frequency", "Recency"]))
else:
    normal["cluster"] = pd.Series(dtype=int)

# Outlier clustering
outliers = rfm[rfm["is_outlier"]]

if not outliers.empty:
    X_outlier = scaler_outlier.transform(outliers[["Sales","Frequency","Recency"]])
    outliers["cluster"] = out_kmeans.predict(pd.DataFrame(X_outlier, columns=["Sales", "Frequency", "Recency"]))
else:
    outliers["cluster"] = pd.Series(dtype=int)

# Saving segments to DB
segments.delete_many({})

docs = []

for _, row in pd.concat([normal, outliers]).iterrows():
    docs.append({
        "user": row["user"],
        "recency": row["Recency"],
        "frequency": row["Frequency"],
        "sales": row["Sales"],
        "isOutlier": bool(row["is_outlier"]),
        "cluster": int(row["cluster"]),
        "updatedAt": datetime.now(timezone.utc)
    })

segments.insert_many(docs)