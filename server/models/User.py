from . import db, bcrypt
from marshmallow import fields, Schema, validate, validates, validates_schema, ValidationError

from models.Cuisine import Cuisine, favorite_cuisines_table
from helpers.google import address_to_data


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False, unique=True)
    password = db.Column(db.String(128), nullable=False)
    isChef = db.Column(db.Boolean, nullable=False)

    address = db.Column(db.Text)
    generalLocation = db.Column(db.Text)

    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    aboutMe = db.Column(db.Text)
    chefProfile = db.Column(db.Text)
    chefCuisine = db.Column(db.String(128))
    profileImage = db.Column(db.Text)

    mealItems = db.relationship(
        "MealItem", back_populates="user", order_by="-MealItem.id")
    cuisines = db.relationship('Cuisine',
                               secondary=favorite_cuisines_table,
                               back_populates='users'
                               )

    def __init__(self, name, email, password, **kwargs):
        self.name = name
        self.email = email
        self.password = self.__generate_hash(password)
        self.isChef = False
        self.aboutMe = ""
        self.address = ""
        self.profileImage = ""
        self.cuisines = []

    def __repr__(self):
        return f"<User #{self.id}: {self.name}, {self.email}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self, data):
        for key, item in data.items():

            if key == 'password':
                self.password = self.__generate_hash(item)
            elif key == 'cuisines':
                list_of_ids = list(map(lambda cuisine: cuisine['id'], item))
                self.cuisines = Cuisine.get_cuisines_by_ids(list_of_ids)
            elif key == 'address':
                data = address_to_data(item)
                if data:
                    coordinates = data.get("geometry").get("location")
                    self.latitude = float(coordinates.get("lat"))
                    self.longitude = float(coordinates.get("lng"))
                    self.address = data.get("formatted_address")
                    location = []
                    for component in data.get("address_components"):
                        if "locality" in component.get("types") or "country" in component.get("types"):
                            location.append(component.get("short_name"))
                    self.generalLocation = ", ".join(location)
            else:
                setattr(self, key, item)
        db.session.commit()

    def __generate_hash(self, password):
        return bcrypt.generate_password_hash(password).decode('UTF-8')

    @staticmethod
    def get_all():
        return User.query.all()

    @staticmethod
    def get_by_id(id):
        return User.query.get(id)

    @staticmethod
    def get_user_by_email(value):
        return User.query.filter_by(email=value).first()

    @staticmethod
    def get_all_chefs():
        return User.query.filter_by(isChef=True).all()

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

    latitude = fields.Float()
    longitude = fields.Float()

    address = fields.String()
    generalLocation = fields.String()
    aboutMe = fields.String()
    chefProfile = fields.String()
    chefCuisine = fields.String()
    profileImage = fields.String()

    mealItems = fields.List(fields.Nested(
        "MealItemSchema", exclude=("user",)))
    # When schema is from another file it must be in quotes to prevent circular imports. Marshmallow automatically searches other Schemas from other files in this directory and finds one called "CuisineSchema"
    cuisines = fields.List(fields.Nested(
        "CuisineSchema", exclude=("users",)))

    @validates_schema
    def validate_password(self, data, **kwargs):
        if (data.get("password") and data.get("confirmPassword")) and (data.get("password") != data.get("confirmPassword")):
            # For all validation errors, Marshmallow raises its own error type called ValidationError
            raise ValidationError("Passwords do not match")

    @validates("cuisines")
    def validates_cuisines(self, cuisines):
        list_of_ids = list(map(lambda cuisine: cuisine.get('id'), cuisines))
        valid_cuisines = Cuisine.get_cuisines_by_ids(list_of_ids)
        # Todo: if all cuisines are valid then replace the list of cuisine ids with the list of cuisines itself. This would save us from needing to rerun the query later
        if (len(cuisines) != len(valid_cuisines)):
            raise ValidationError(
                "One your cuisine ids is not a valid cuisine registered within our database")

    @validates("address")
    def validate_address(self, address):
        data = address_to_data(address)
        if not data or not data.get("geometry").get("location"):
            raise ValidationError("Location not found for address")
