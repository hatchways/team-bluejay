from flask import Flask
import os


def create_app():
    app = Flask(__name__, static_folder="../client/build", static_url_path="/")

    @app.route('/')
    @app.route('/<path1>')
    @app.route('/<path1>/<path2>')
    def index(**kwargs):
        return app.send_static_file('index.html')

    return app


print(os.getenv('FLASK_ENV'))

# if run via gunicorn this will return false
if __name__ == "__main__" or os.getenv('FLASK_ENV') == 'production':
    app = create_app()
