from . import db
from marshmallow import fields, Schema
from User import UserSchema


# Join table linking users and their favorite cuisines
favorite_cuisines_table = db.Table('favorite_cuisines',
                                   db.Column('user_id', db.Integer,
                                             db.ForeignKey('users.id'), primary_key=True),
                                   db.Column('cuisine_id', db.Integer,
                                             db.ForeignKey('cuisines.id'), primary_key=True)
                                   )


class Cuisine(db.Model):
    __tablename__ = 'cuisines'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False, unique=True)
    users = db.relationship('User',
                            secondary=favorite_cuisines_table,
                            back_populates='cuisines'
                            )

    def __init__(self, name):
        self.name = name

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_cuisines_by_ids(ids):
        return Cuisine.query.filter(Cuisine.id.in_(ids)).all()


class CuisineSchema(Schema):
    id = fields.Integer()
    name = fields.String(required=True)
    users = fields.List(fields.Nested(
        lambda: UserSchema(exclude=("cuisines",))))
