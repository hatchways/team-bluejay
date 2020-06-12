from . import db
from marshmallow import fields, Schema
from datetime import datetime


class OrderJoinMealItem(db.Model):

    __tablename__ = 'order_join_meal_items'
    orderId = db.Column(db.Integer, db.ForeignKey('orders.id'), primary_key=True)
    mealId = db.Column(db.Integer, db.ForeignKey('meal_items.id'), primary_key=True)
    quantity = db.Column(db.Integer)
  
    meal_item = db.relationship('MealItem')

    def __init__(self, orderId, mealId, quantity):
        self.orderId = orderId
        self.mealId = mealId
        self.quantity = quantity

    def save(self):
        db.session.add(self)
        db.session.commit()


class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    chefId = db.Column(db.Integer, nullable=False)
    userId = db.Column(db.Integer, nullable=False)

    created_date_time = db.Column(db.DateTime, nullable=False)
    arrival_date_time = db.Column(db.DateTime, nullable=False)

    fulfilled = db.Column(db.Boolean, nullable=False)
    clientSecret = db.Column(db.Text)

    ordered_items = db.relationship('OrderJoinMealItem')

    def __repr__(self):
        return f"<Order #{self.id}>"

    def __init__(self, chefId, userId, arrival_ts):
        self.chefId = chefId
        self.userId = userId
        self.created_date_time = datetime.now()
        # timestamp from JS is in ms, timestamp in python is in secs
        self.arrival_date_time = datetime.fromtimestamp(int(arrival_ts/1000))
        self.fulfilled = False
    
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

class OrderJoinMealItemSchema(Schema):
    id = fields.Int()
    orderId = fields.Int()
    mealId = fields.Int()
    quantity = fields.Int()
    
    meal_item = fields.Nested("MealItemSchema", exclude=("user", ))

class OrderSchema(Schema):
    id = fields.Int(dump_only=True)
    chefId = fields.Int()
    userId = fields.Int()

    created_date_time = fields.DateTime()
    arrival_date_time = fields.DateTime()

    ordered_items = fields.List(fields.Nested("OrderJoinMealItemSchema"))

    # fields.Nested("MealItemSchema", exclude=("user",))