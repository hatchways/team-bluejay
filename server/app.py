from flask import Flask, Response, request, jsonify
from api.ping_handler import ping_handler
from api.home_handler import home_handler
from models.User import User
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity


app = Flask(__name__)
app.config['JWT_SERET_KEY'] = 'team-bluejay' # to change later
jwt = JWTManager(app)


app.register_blueprint(home_handler)
app.register_blueprint(ping_handler)

# Register/Signup Route
@app.route('/signup', methods=['POST'])
def create_user():
  """Handle user signup"""

  req_body = request.json

  """ early check if password is less than 6 """
  if len(req_body.password) < 6:
    return Response({
      "message": "Password needs to be at least 6 characters"}, 
      status=400, 
      mimetype='application/json'
    )
  
  user = User.signup(
      email=req_body.email,
      password=req_body.password
    )    

  if user:
    user_object = user.generate_user_object()
    message = jsonify(
      message="Succesfully signed up. User created.",
      access_token=create_access_token(identity=user_object)
    )
    return Response(message, status=201, mimetype='application/json')
  else:
    message = jsonify(message="error signing up")
    return Response(message, status=400, mimetype='application/json')

# Login Route
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
    message = jsonify(
      message="User authenticated.",
      access_token=create_access_token(identity=user_object)
    )
    return Response(message, status=200, mimetype='application/json')
  else:
    message = jsonify(message="Not authenticated. Please try again.")
    return Response(message, status=400, mimetype='application/json')

# protected route
@app.route('/protected', methods=['GET'])
@jwt_required
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

if __name__ == '__main__':
    app.run()

@app.route('/partially-protected', methods=['GET'])
@jwt_optional
def partially_protected():
    # If no JWT is sent in with the request, get_jwt_identity()
    # will return None
    current_user = get_jwt_identity()
    if current_user:
        return jsonify(logged_in_as=current_user), 200
    else:
        return jsonify(logged_in_as='anonymous user'), 200


if __name__ == '__main__':
    app.run()