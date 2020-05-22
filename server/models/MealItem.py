from . import db, bcrypt
from marshmallow import Schema


class MealItem(db.Model):
    __tablename__ = 'meal_items'

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
    )
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    # to access chef info from a meal item
    # user = db.relationship("User", db.ForeignKey('users.id'))

    def __init__(self, userId, name, description=""):
        self.userId = userId
        self.name = name
        self.description = description

    def __repr__(self):
        return f"<Meal #{self.id}: {self.name}>"

    def add_to_database(self):
        try:
            db.session.add(self)
            db.session.commit()
            return self
        except Exception:
            db.session.rollback()
            return None


class MealItemSchema(Schema):
    class Meta:
        fields = ('id', 'userId', 'name', 'description')