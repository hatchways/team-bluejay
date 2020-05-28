from . import db, bcrypt
from marshmallow import Schema, fields


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False, unique=True)
    password = db.Column(db.String(128), nullable=False)
    isChef = db.Column(db.Boolean, nullable=False)

    def __init__(self, name, email, password, confirmPassword):
        if len(password) < 6 or password != confirmPassword:
            raise ValueError
        self.name = name
        self.email = email
        self.password = bcrypt.generate_password_hash(password).decode('UTF-8')
        self.isChef = False

    def __repr__(self):
        return f"<User #{self.id}: {self.name}, {self.email}>"

    def chef_flag_true(self):
        self.isChef = True
        return

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_one_user(id):
        return User.query.get(id)

    @staticmethod
    def get_user_by_email(value):
        return User.query.filter_by(email=value).first()

    @classmethod
    def authenticate(cls, email, password):
        user = cls.query.filter_by(email=email).first()
        if not user:
            return None

        is_auth = bcrypt.check_password_hash(user.password, password)
        if is_auth:
            return user


class UserSchema(Schema):
    id = fields.Int()
    userId = fields.Int()
    name = fields.Str(required=True)
    email = fields.Str(required=True)
    password = fields.Str(required=True)
    isChef = fields.Boolean()
    confirmPassword = fields.Str()