import atexit
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

from apscheduler.schedulers.background import BackgroundScheduler
from loguru import logger
from sqlalchemy import select
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from utils import setup_logger
from utils.database import create_url, get_connection, get_env


setup_logger(__name__, Path(__file__).resolve().parents[1] / 'logs' / 'database.log')

engine = get_connection(url=create_url(), echo=False, connect_args={'init_command': "SET time_zone='+00:00'"})
SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


def purge_expired_trash():
    from models.material import Material

    with SessionLocal() as session:
        try:
            cutoff = datetime.now(timezone.utc) - timedelta(days=int(get_env('TRASH_RETENTION_DAYS')))
            stmt = select(Material).where(Material.deleted_at.is_not(None), Material.deleted_at <= cutoff)
            expired_materials = session.scalars(stmt).all()

            if not expired_materials:
                return

            for item in expired_materials:
                session.delete(item)

            session.commit()
            logger.info('Apagados {} materiais da lixeira', len(expired_materials))

        except Exception as e:
            session.rollback()
            logger.exception('Erro ao apagar materiais expirados da lixeira: {}', e)


def init_database():
    if os.environ.get('FLASK_DEBUG', '0') != '1' or os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
        scheduler = BackgroundScheduler()
        scheduler.add_job(purge_expired_trash, 'cron', hour=12, minute=0)
        scheduler.start()
        atexit.register(lambda: scheduler.shutdown())

    Base.metadata.create_all(engine)
