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
    user = db.relationship("User", back_populates="notifications")

    def __init__(self, userId, message, isRead):
        self.userId = userId
        self.message = message
        self.isRead = isRead


class NotificationSchema(Schema):
    id = fields.Int(dump_only=True)
    userId = fields.Int(required=True)
    message = fields.Str(required=True)
    isRead = fields.Boolean(required=True)
