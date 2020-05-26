from models import db


def save_to_database(*objects):
    try:
        for obj in objects:
            db.session.add(obj)
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise RuntimeError
