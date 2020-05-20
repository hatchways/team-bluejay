from models import db
from models.User import User, UserSchema
from flask import request
from flask_restful import Resource

user_schema = UserSchema()
users_schema = UserSchema(many=True)

class UserResource(Resource):
    def get(self):
        all_users = User.query.all()
        return users_schema.dump(all_users)

    def post(self):
        name = request.json['name']
        new_user = User(name)
        db.session.add(new_user)
        db.session.commit()
        return user_schema.dump(new_user)