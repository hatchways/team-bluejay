from server import create_app
import os

if __name__ == "__main__" or os.getenv('FLASK_ENV') == 'production':
    app = create_app()
