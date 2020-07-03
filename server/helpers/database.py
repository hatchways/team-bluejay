from server.models import db
from sqlalchemy.exc import SQLAlchemyError


def save_to_database(*objects):
    try:
        for obj in objects:
            db.session.add(obj)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        raise e
