from . import db, bcrypt
from marshmallow import Schema, fields
from models.Order import order_join_meal_items


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
    ingredients = db.Column(db.String(128), nullable=True)
    required_items = db.Column(db.String(128), nullable=True)
    image = db.Column(db.Text)
    user = db.relationship("User", back_populates="mealItems")

    # orders = db.relationship('Order',
    #                         secondary=order_join_meal_items,
    #                         back_populates='meal_items'
    #                         )

    def __init__(self, userId, name, price, servings, ingredients="", required_items="", image=""):
        self.userId = userId
        self.name = name
        self.price = price
        self.servings = servings
        self.ingredients = ingredients
        self.required_items = required_items
        self.image = image

    def __repr__(self):
        return f"<Meal #{self.id}: {self.name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self, data):
        for key, item in data.items():
            setattr(self, key, item)
        db.session.commit()

    @staticmethod
    def get_by_id(id):
        return MealItem.query.get(id)

    @staticmethod
    def get_all_meals():
        return MealItem.query.all()

    @staticmethod
    def get_meals_by_userId(userId):
        return MealItem.query.filter(MealItem.userId == userId).all()


class MealItemSchema(Schema):
    id = fields.Int(dump_only=True)
    userId = fields.Int(required=True)
    name = fields.Str(required=True)
    price = fields.Float(required=True)
    servings = fields.Int(required=True)
    ingredients = fields.Str()
    required_items = fields.Str()
    image = fields.String()
    user = fields.Nested("UserSchema", exclude=("mealItems",))
