from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from api.ping_handler import ping_handler
from api.home_handler import home_handler


app = Flask(__name__)


app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)

# Database variables
user = 'postgres'
pw ='put-your-password-here'
url = 'localhost:5432'
db_name = 'team-bluejay'

DB_URL = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(user=user,pw=pw,url=url,db=db_name)

app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)

# Basic User Model from which Customers and Chefs inherit from
class User(db.Model):
  __abstract__ = True
  name = db.Column(db.String(100), nullable=False)

  def __init__(self, name):
    self.name = name


# Customer Model & Schema
class Customer(User):
  __tablename__ = 'customers'
  id = db.Column(db.Integer, primary_key=True)

class CustomerSchema(ma.Schema):
  class Meta:
    fields = ('id', 'name')


# Chef Model & Schema
class Chef(db.Model):
  __tablename__ = 'chefs'
  id = db.Column(db.Integer, primary_key=True)

class ChefSchema(ma.Schema):
  class Meta:
    fields = ('id', 'name')

# Initialize schema
customer_schema = CustomerSchema()
customers_schema = CustomerSchema(many=True)

customer_schema = ChefSchema()
customers_schema = ChefSchema(many=True)


# Routes for Customers

# Create a Customer
@app.route('/customer', methods=['POST'])
def add_customer():
  name = request.json['name']
  new_customer = Customer(name)
  db.session.add(new_customer)
  db.session.commit()
  return customer_schema.jsonify(new_customer)

# Get All Customers
@app.route('/customer', methods=['GET'])
def get_customers():
  all_customers = Customer.query.all()
  result = customers_schema.dump(all_customers)
  return jsonify(result)