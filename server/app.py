from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from marshmallow import Schema
from flask_restful import Api

from api.user_handler import UserResource

from api.ping_handler import ping_handler
from api.home_handler import home_handler

from models import db, User, UserSchema

app = Flask(__name__)

app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)

# Database variables
user = 'postgres'
pw = 'put-your-password-here'
url = 'localhost:5432'
db_name = 'team-bluejay'

DB_URL = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(
    user=user, pw=pw, url=url, db=db_name)

app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
api = Api(app)

api.add_resource(UserResource, '/customer')