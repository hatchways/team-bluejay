from flask_socketio import SocketIO, emit
from server.config import ALLOWED_CLIENT_URLS
from flask import request
from server.models.Notification import Notification, NotificationSchema

# In development mode flask-socketio uses Flasks non-optimized built in engine to run sockets
# In production "eventlet" package should be installed. If "eventlet" is installed, flask-socketio will automatically detect it and use its superior engine for running sockets.
# eventlet should not be used in "development" mode as it prevents flask from restarting server on file changes

socketio = SocketIO(cors_allowed_origins=ALLOWED_CLIENT_URLS)

online_users = {}  # userid => socketid
sockets = {}  # socketid => userid


@socketio.on('user connected')
def user_connection(user_id):
    sockets[request.sid] = user_id
    online_users[user_id] = request.sid


@socketio.on('signOut')
def logout_user():
    disconnect(request.sid)


@socketio.on('disconnect')
def user_disconnects():
    disconnect(request.sid)


def notifyUser(user_id, message):
    """
    How to use this method:
        from socket_events import notifyUser
        notifyUser(1, "sample notification message")
    """
    new_notification = Notification(user_id, message)
    new_notification.save()
    ser_notification = NotificationSchema().dump(new_notification)
    socketid = online_users.get(user_id)
    if socketid:
        emit('new notification', ser_notification, room=socketid, namespace='/')
    return ser_notification


def disconnect(socketid):
    # socket id as may have already been deleted from our sockets dictionary on logout
    if sockets.get(socketid):
        user_id = sockets[socketid]
        del online_users[user_id]
        del sockets[socketid]
