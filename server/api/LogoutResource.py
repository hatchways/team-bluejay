from flask_restful import Resource
from flask import jsonify
from flask_jwt_extended import unset_jwt_cookies


class LogoutResource(Resource):
    def post(self):
        resp = jsonify(logout=True)
        resp.status_code = 200
        unset_jwt_cookies(resp)
        return resp
