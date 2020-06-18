from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from marshmallow import Schema

# initialize our db
db = SQLAlchemy()
bcrypt = Bcrypt()

from .User import User, UserSchema