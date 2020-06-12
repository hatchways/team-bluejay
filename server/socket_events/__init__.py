from flask_socketio import SocketIO, emit
from config import CLIENT_URL
from flask import request
from models.Notification import Notification, NotificationSchema

# In development mode flask-socketio uses Flasks non-optimized built in engine to run sockets
# In production "eventlet" package should be installed. If "eventlet" is installed, flask-socketio will automatically detect it and use its superior engine for running sockets.
# eventlet should not be used in "development" mode as it prevents flask from restarting server on file changes

socketio = SocketIO(cors_allowed_origins=CLIENT_URL)

online_users = {}  # userid => socketid
sockets = {}  # socketid => userid

# Todo: Add error handling for socket connections


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
    # HOW TO USE THIS METHOD:
    # From socket_events import notifyUser
    # notifyUser(1, "A new notification was dispatched just for you")
    # Todo: add error handling using Schema.loads() for invalid notification fields
    new_notification = Notification(user_id, message)
    new_notification.save()
    socketid = online_users.get(user_id)
    if socketid:
        ser_notification = NotificationSchema().dump(new_notification)
        # Todo: check if namespace = '/' is needed
        emit('new notification', ser_notification, room=socketid, namespace='/')


def disconnect(socketid):
    # socket id as may have already been deleted from our sockets dictionary on logout
    if sockets.get(socketid):
        user_id = sockets[socketid]
        del online_users[user_id]
        del sockets[socketid]
