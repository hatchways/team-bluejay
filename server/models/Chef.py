from . import db, bcrypt
from models.User import User
from marshmallow import Schema, fields


class Chef(User):
    __tablename__ = 'users'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False, unique=True)
    password = db.Column(db.String(128), nullable=False)
    isChef = db.Column(db.Boolean, nullable=False)

    def __repr__(self):
        return f"<Chef #{self.id}: {self.name}>"

    @staticmethod
    def get_all():
        return Chef.query.filter_by(isChef=True).all()


class ChefSchema(Schema):
    id = fields.Int()
    userId = fields.Int()
    name = fields.Str(required=True)
    email = fields.Str(required=True)
    password = fields.Str(required=True)
    isChef = fields.Boolean()
    confirmPassword = fields.Str()
