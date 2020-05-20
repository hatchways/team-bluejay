from . import db
from marshmallow import Schema


# Customer Model & Schema
class Customer(db.Model):
    __tablename__ = 'customers'
    name = db.Column(db.String(100), nullable=False)
    id = db.Column(db.Integer, primary_key=True)
    
    def __init__(self, name):
        self.name = name

# class CustomerSchema(ma.Schema):
class CustomerSchema(Schema):
    class Meta:
        fields = ('id', 'name')

