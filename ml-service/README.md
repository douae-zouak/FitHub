# ML Service - Segmentation Client

## 🚀 Démarrage Rapide

### Exécuter la Segmentation

**Windows :**
```bash
run-segmentation.bat
```

**Linux/macOS :**
```bash
chmod +x run-segmentation.sh
./run-segmentation.sh
```

## 📦 Environnements

- **`venv/`** - Environnement Flask (API)
- **`venv_segmentation/`** - Environnement segmentation (ML)

## 🔧 Configuration

### Première Utilisation

Le script `run-segmentation.bat` (ou `.sh`) va automatiquement :
1. Créer l'environnement virtuel `venv_segmentation`
2. Installer les dépendances depuis `requirements-segmentation.txt`
3. Exécuter `segmentation.py`

### Dépendances

- **Flask API** : `requirements.txt`
- **Segmentation** : `requirements-segmentation.txt`

## 📊 Fonctionnement

Le script `segmentation.py` :
1. Se connecte à MongoDB
2. Récupère les commandes livrées
3. Calcule les métriques RFM (Recency, Frequency, Monetary)
4. Détecte les outliers
5. Applique le clustering KMeans
6. Sauvegarde les segments dans la collection `customersegments`

## ⚙️ Intégration

### Option 1 : Exécution Manuelle
```bash
run-segmentation.bat
```

### Option 2 : Tâche Planifiée
Configurez Task Scheduler (Windows) ou Cron (Linux) pour exécuter automatiquement.

### Option 3 : Endpoint API
Ajoutez un endpoint dans `app.py` pour déclencher la segmentation via l'API.

## 🔍 Vérification

```bash
# Vérifier les segments créés
mongosh fithub
db.customersegments.find().limit(5).pretty()
```

## 📝 Fichiers Importants

- `segmentation.py` - Script de segmentation
- `requirements-segmentation.txt` - Dépendances ML
- `run-segmentation.bat` - Script Windows
- `run-segmentation.sh` - Script Linux/macOS
- `thresholds.json` - Seuils pour détection d'outliers
- `*.pkl` - Modèles ML pré-entraînés

## ⚠️ Prérequis

- Python 3.8+
- MongoDB en cours d'exécution
- Commandes dans la base de données

## 🐛 Dépannage

**Erreur "Module not found"** :
```bash
# Réinstaller les dépendances
venv_segmentation\Scripts\activate
pip install -r requirements-segmentation.txt
deactivate
```

**Erreur "Connection refused"** :
```bash
# Démarrer MongoDB
net start MongoDB  # Windows
```
