from . import db, bcrypt
from marshmallow import fields, Schema, validate, validates_schema, ValidationError


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False, unique=True)
    password = db.Column(db.String(128), nullable=False)
    isChef = db.Column(db.Boolean, nullable=False)
    aboutMe = db.Column(db.String(600))
    streetAddress = db.Column(db.String(200))
    city = db.Column(db.String(50))
    state = db.Column(db.String(50))
    zipcode = db.Column(db.String(25))
    country = db.Column(db.String(50))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    formattedAddress = db.Column(db.String)
    mealItems = db.relationship("MealItem", back_populates="user")

    # Todo: this method of initializing with default values feels very sloppy and a better way to do it probably exists
    def __init__(self, name, email, password, confirmPassword, aboutMe="", streetAddress="", city="", state="", zipcode="", country="", latitude=0.0, longitude=0.0, formattedAddress=""):
        self.name = name
        self.email = email
        self.password = self.__generate_hash(password)
        self.isChef = False
        self.aboutMe = aboutMe
        self.streetAddress = streetAddress
        self.city = city
        self.state = state
        self.zipcode = zipcode
        self.country = country
        self.latitude = latitude
        self.longitude = longitude
        self.formattedAddress = formattedAddress

    def __repr__(self):
        return f"<User #{self.id}: {self.name}, {self.email}>"

    def chef_flag_true(self):
        self.isChef = True
        return

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self, data):
        for key, item in data.items():
            if key == 'password':
                self.password = self.__generate_hash(item)
            else:
                setattr(self, key, item)
        db.session.commit()

    def __generate_hash(self, password):
        return bcrypt.generate_password_hash(password).decode('UTF-8')

    @staticmethod
    def get_one_user(id):
        return User.query.get(id)

    @staticmethod
    def get_user_by_email(value):
        return User.query.filter_by(email=value).first()

    @classmethod
    def authenticate(cls, email, password):
        user = cls.query.filter_by(email=email).first()
        if not user:
            return None

        is_auth = bcrypt.check_password_hash(user.password, password)
        if is_auth:
            return user


# Marshmallow is opionated. If you use marshmallow it expects all validation to be done in Schemas
class UserSchema(Schema):
    # dump_only makes the field "read only" and prevents id from being edited by PUT requests
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True)
    email = fields.Email(required=True)
    isChef = fields.Boolean()
    # load_only means the field is "write only" - so it will not be read with schema.dump()
    password = fields.String(
        required=True, validate=validate.Length(min=6), load_only=True)
    confirmPassword = fields.String()
    aboutMe = fields.String()
    streetAddress = fields.String()
    city = fields.String()
    state = fields.String()
    zipcode = fields.String()
    country = fields.String()
    latitude = fields.Float()
    longitude = fields.Float()
    formattedAddress = fields.String()
    mealItems = fields.List(fields.Nested(
        "MealItemSchema", exclude=("user",)))

    @validates_schema
    def validate_password(self, data, **kwargs):
        if (data.get("password") and data.get("confirmPassword")) and (data.get("password") != data.get("confirmPassword")):
            # For all validation errors, Marshmallow raises its own error type called ValidationError
            raise ValidationError("Passwords do not match")
