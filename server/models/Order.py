from . import db
from marshmallow import fields, Schema

order_join_meal_items = db.Table('order_join_meal_items',
                                db.Column('order_id', db.Integer,
                                            db.ForeignKey('orders.id'), primary_key=True),
                                db.Column('meal_item_id', db.Integer,
                                            db.ForeignKey('meal_items.id'), primary_key=True)
                                )


class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    
    items = db.relationship('MealItem',
                            secondary=favorite_cuisines_table,
                            back_populates='orders'
                            )

    def __init__(self, name):
        self.name = name

    def save(self):
        db.session.add(self)
        db.session.commit()


class CuisineSchema(Schema):
    id = fields.Integer()
    name = fields.String(required=True)
    # When schema is from another file it must be in quotes to prevent circular imports. Marshmallow automatically searches other Schemas from other files in this directory and finds one called "UserSchema"
    users = fields.List(fields.Nested("UserSchema"))
