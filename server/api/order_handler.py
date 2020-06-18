from flask_restful import Resource
from flask import jsonify, request, json
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.Order import Order, OrderSchema
from helpers.api import custom_json_response
from socket_events import notifyUser

order_schema = OrderSchema(many=True)


class OrderResource(Resource):
    @jwt_required
    def put(self, id):
        req_body = request.get_json()
        order = Order.get_by_id(id)
        order.fulfill(req_body.get("clientSecret"))

        notifyUser(order.chefId, f'User {order.userId} has sent you an order')

        return custom_json_response({"message": "order created"}, 201)

    @jwt_required
    def get(self):
        id = get_jwt_identity().get("id")
        chefOrders = Order.get_order_by_chefId(id)
        userOrders = Order.get_order_by_userId(id)
        data = {
            "chefOrders": order_schema.dump(chefOrders, many=True),
            "userOrders": order_schema.dump(userOrders, many=True)
        }
        return data