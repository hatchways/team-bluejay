from flask_sqlalchemy import SQLAlchemy
from marshmallow import Schema

# initialize our db
db = SQLAlchemy()

from .User import User, UserSchema
