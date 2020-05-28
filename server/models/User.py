from . import db, bcrypt
from marshmallow import fields, Schema, validate
from marshmallow.utils import missing


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    isChef = db.Column(db.Boolean, nullable=False)

    def __init__(self, data):
        self.name = data['name']
        self.email = data['email']
        self.password = bcrypt.generate_password_hash(
            data['password']).decode('UTF-8')
        self.isChef = data['isChef']

    def __repr__(self):
        return f"<User #{self.id}: {self.name}, {self.email}>"

    def chef_flag_true(self):
        self.isChef = True
        return

    def update(self, data):
        for key, item in data.items():
            # To do: check if key is password and hash it properly
            setattr(self, key, item)
        db.session.commit()

    @classmethod
    def authenticate(cls, email, password):
        user = cls.query.filter_by(email=email).first()
        if not user:
            return None

        is_auth = bcrypt.check_password_hash(user.password, password)
        if is_auth:
            return user


class UserSchema(Schema):
    name = fields.String(required=True)
    email = fields.Email(required=True)
    isChef = fields.Boolean(missing=True)
    password = fields.String(required=True, validate=[
                             validate.Length(min=6)], load_only=True)
