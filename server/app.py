from flask import Flask, Response, request, jsonify
from api.ping_handler import ping_handler
from api.home_handler import home_handler
from models import db, User


app = Flask(__name__)


app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)

# Register/Signup Route
@app.route('/signup', methods=['POST'])
def create_user():
  """Handle user signup"""

  req_body = request.json

  try:
    user = User.signup(
      username=req_body.username,
      email=req_body.email,
      password=req_body.password
    )
    db.session.commit()
    
    message = jsonify(message="Succesfully signed up")
    return Response(message, status=201, mimetype='application/json')
  except:
    message = jsonify(message="error signing up")
    return Response(message, status=400, mimetype='application/json')

# Login Route
@app.route('/login', methods=['POST'])
def login_user(): 
  """Handle user login"""

  req_body = request.json

  try:
    user = User.authenticate(
      req_body.username,
      req_body.email,
      req_body.password
    )
    if user:
      return Response("login route - post", status=200, mimetype='application/json')
  except:
    message = jsonify(message="please try again")
    return Response(message, status=400, mimetype='application/json')

  




