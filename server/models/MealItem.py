from . import db, bcrypt
from marshmallow import Schema, fields


class MealItem(db.Model):
    __tablename__ = 'meal_items'

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
    )
    name = db.Column(db.String(128), nullable=False)
    price = db.Column(db.Float(precision=2), nullable=False)
    servings = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text, nullable=True)
    ingredients = db.Column(db.String(128), nullable=True)
    required_stuff = db.Column(db.String(128), nullable=True)
    # to access chef info from a meal item
    user = db.relationship("User")

    def __init__(self, userId, name, price, servings, description="", ingredients="", required_stuff=""):
        self.userId = userId
        self.name = name
        self.price = price
        self.servings = servings
        self.description = description
        self.ingredients = ingredients
        self.required_stuff = required_stuff

    def __repr__(self):
        return f"<Meal #{self.id}: {self.name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_all_meals():
        return MealItem.query.all()


class MealItemSchema(Schema):
    id = fields.Int(dump_only=True)
    userId = fields.Int(required=True)
    name = fields.Str(required=True)
    price = fields.Float(required=True)
    servings = fields.Int(required=True)
    description = fields.Str()
    ingredients = fields.Str()
    required_stuff = fields.Str()
