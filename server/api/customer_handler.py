from models import db
from models.User import Customer, CustomerSchema
from flask import request
from flask_restful import Resource

customer_schema = CustomerSchema()
customers_schema = CustomerSchema(many=True)

class CustomerResource(Resource):
    def get(self):
        all_customers = Customer.query.all()
        return customers_schema.dump(all_customers)

    def post(self):
        name = request.json['name']
        new_customer = Customer(name)
        db.session.add(new_customer)
        db.session.commit()
        return customer_schema.dump(new_customer)