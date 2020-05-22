from . import db, bcrypt
from sqlalchemy.exc import IntegrityError
from marshmallow import Schema


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)

    def __init__(self, name, email, password):
        if len(password) < 6:
            raise ValueError
        self.name = name
        self.email = email
        self.password = bcrypt.generate_password_hash(password).decode('UTF-8')

    def __repr__(self):
        return f"<User #{self.id}: {self.username}, {self.email}>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email
        }

    def add_to_database(self):
        try:
            db.session.add(self)
            db.session.commit()
            return self
        except IntegrityError:
            db.session.rollback()
            return None

    @classmethod
    def authenticate(cls, email, password):
        user = cls.query.filter_by(email=email).first()
        if not user:
            return None

        is_auth = bcrypt.check_password_hash(user.password, password)
        if is_auth:
            return user


class UserSchema(Schema):
    class Meta:
        fields = ('id', 'name', 'email', 'password')