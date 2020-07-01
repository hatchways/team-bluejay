from server import create_app, socketio
import os

app = create_app()

if __name__ == "__main__" or os.getenv('FLASK_ENV') == 'production':
    socketio.run(app)
