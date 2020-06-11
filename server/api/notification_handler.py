from models.Notification import Notification, NotificationSchema
from flask_restful import Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from helpers.api import custom_json_response
from marshmallow import ValidationError


notifications_schema = NotificationSchema(many=True)


class NotificationResource(Resource):
    @jwt_required
    def get(self):
        user_id = get_jwt_identity().get('id')
        all_notifications = Notification.get_by_userId(user_id)
        ser_notifications = notifications_schema.dump(all_notifications)
        return custom_json_response(ser_notifications, 200)
