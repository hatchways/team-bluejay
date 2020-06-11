from . import db
from marshmallow import fields, Schema
from datetime import datetime


order_join_meal_items = db.Table('order_join_meal_items',
                                db.Column('order_id', db.Integer,
                                            db.ForeignKey('orders.id')),
                                db.Column('meal_item_id', db.Integer,
                                            db.ForeignKey('meal_items.id'))
                                )

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    chefId = db.Column(db.Integer, nullable=False)
    userId = db.Column(db.Integer, nullable=False)

    created_date_time = db.Column(db.DateTime, nullable=False)
    arrival_date_time = db.Column(db.DateTime, nullable=False)

    fulfilled = db.Column(db.Boolean, nullable=False)
    clientSecret = db.Column(db.Text)

    meal_items = db.relationship('MealItem',
                            secondary=order_join_meal_items
                            )

    def __repr__(self):
        return f"<Order #{self.id}>"

    def __init__(self, chefId, userId, arrival_ts, meal_objects):
        self.chefId = chefId
        self.userId = userId
        self.created_date_time = datetime.now()
        # timestamp from JS is in ms, timestamp in python is in secs
        self.arrival_date_time = datetime.fromtimestamp(int(arrival_ts/1000))
        self.fulfilled = False
        self.meal_items = meal_objects
    
    def fulfill(self, clientSecret):
        self.fulfilled = True
        self.clientSecret = clientSecret
        db.session.add(self)
        db.session.commit()
        

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_by_id(id):
        return Order.query.get(id)

class OrderJoinMealSchema(Schema):
    id = fields.Int()

class OrderSchema(Schema):
    id = fields.Int(dump_only=True)
    chefId = fields.Int()
    userId = fields.Int()

    created_date_time = fields.DateTime()
    arrival_date_time = fields.DateTime()

    meal_items = fields.List(fields.Nested("MealItemSchema", exclude=("user",)))

    # fields.Nested("MealItemSchema", exclude=("user",))