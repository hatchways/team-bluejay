from . import db, bcrypt
from marshmallow import Schema, fields


class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
    )
    message = db.Column(db.Text, nullable=False)
    isRead = db.Column(db.Boolean, nullable=False)

    def __init__(self, userId, message, isRead):
        self.userId = userId
        self.message = message
        self.isRead = isRead

    @staticmethod
    def get_by_userId(userId):
        return Notification.query.filter(Notification.userId == userId).all()

    @staticmethod
    def mark_all_as_read(userId):
        Notification.query.filter(Notification.userId == userId).update(
            {"isRead": True})
        db.session.commit()
        return Notification.query.filter(Notification.userId == userId).all()


class NotificationSchema(Schema):
    id = fields.Int(dump_only=True)
    userId = fields.Int(load_only=True)
    message = fields.Str(required=True)
    isRead = fields.Boolean(required=True)
