from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
from segmentation_service import SegmentationService
import logging
from datetime import datetime

# Configuration logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('segmentation.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def run_segmentation():
    """Fonction appelée par le scheduler"""
    logger.info("="*50)
    logger.info(f"Démarrage segmentation planifiée: {datetime.now()}")
    logger.info("="*50)
    
    service = SegmentationService()
    result = service.update_segments()
    
    if result["success"]:
        logger.info(f"✅ Segmentation réussie: {result}")
    else:
        logger.error(f"❌ Segmentation échouée: {result}")

if __name__ == "__main__":
    logger.info("🚀 Démarrage du scheduler de segmentation...")
    
    # Exécuter une fois au démarrage
    logger.info("Exécution initiale...")
    run_segmentation()
    
    # Configurer le scheduler
    scheduler = BlockingScheduler()
    
    # Exécuter tous les jours à 2h du matin
    scheduler.add_job(
        run_segmentation,
        CronTrigger(hour=2, minute=0),
        id='daily_segmentation',
        name='Segmentation quotidienne',
        replace_existing=True
    )
    
    logger.info("⏰ Scheduler configuré: exécution quotidienne à 2h00")
    logger.info("Prochaine exécution: " + str(scheduler.get_jobs()[0].next_run_time))
    
    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        logger.info("🛑 Arrêt du scheduler...")