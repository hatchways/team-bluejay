from flask.ext.bcrypt import Bcrypt
from sqlalchemy import exc

# (to do later when database is ready)
# from database.py import db

bcrypt = Bcrypt()


class User(db.Model):
  """User Model"""

  __tablename__ = 'users'

  id = db.Column(
      db.Integer,
      primary_key=True,
  )

  name = db.Column(
      db.Text,
      nullable=False,
  )

  email = db.Column(
      db.Text,
      nullable=False,
      unique=True,
  )

  password = db.Column(
      db.Text,
      nullable=False,
  )

  def generate_user_object(self):
    return {
      "id": self.id, 
      "name": self.name,
      "email": self.email
    }

  @classmethod
  def signup(cls, name, email, password):
    """
      Class method - called on User class not on instance of.
      Sign up user.
      Hashes password and adds user to system.
    """
    if len(password) < 6:
      raise ValueError("password must be at least 6 characters")

    hashed_pwd = bcrypt.generate_password_hash(password)

    user = User(
      name=name,
      email=email,
      password=hashed_pwd,
    )

    try:
      db.session.add(user)
      db.session.commit()
      return user
    except exc.SQLAlchemyError as e:
      db.session.rollback()
      return e

  @classmethod
  def authenticate(cls, email, password):
    """
      Class method - called on User class not on instance of.
      Find user with `username` and `password`.
    """

    user = cls.query.filter_by(email=email).first()

    if user:
      is_auth = bcrypt.check_password_hash(user.password, password)
      if is_auth:
        return 
    else:
      return None