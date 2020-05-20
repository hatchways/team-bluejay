from flask import Flask, request, jsonify
from api.ping_handler import ping_handler
from api.home_handler import home_handler
from models.User import User
from flask_jwt_extended import (
  JWTManager, 
  create_access_token, 
  get_jwt_identity,
  jwt_required,
  jwt_optional
)


app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'team-bluejay' # to change later
jwt = JWTManager(app)


app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)

# User Register/Signup Route
@app.route('/signup', methods=['POST'])
def create_user():
  """Handle user signup"""

  req_body = request.json

  """ early check if password is less than 6 """
  if len(req_body.password) < 6:
    return jsonify(message="Password needs to be at least 6 characters"), 400
  
  user = User.signup(
    email=req_body.email,
    password=req_body.password
  )    

  if user:
    user_object = user.generate_user_object()
    return jsonify(
      message="Succesfully signed up. User created.",
      access_token=create_access_token(identity=user_object)
    ), 201
  else:
    return jsonify(message="error signing up"), 400

# User Login Route
@app.route('/login', methods=['POST'])
def login_user(): 
  """Handle user login"""

  req_body = request.json

  user = User.authenticate(
    req_body.email,
    req_body.password
  ) 

  if user:
    user_object = user.generate_user_object()
    return jsonify(
      message="User authenticated.",
      access_token=create_access_token(identity=user_object)
    ), 200
  else:
    return jsonify(message="Not authenticated. Please try again."), 400