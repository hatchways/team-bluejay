# seeds database with sample data
from server import create_app, db
import random
app = create_app()
app.app_context().push()
from server.models.User import User
from server.models.Cuisine import Cuisine
from server.models.MealItem import MealItem
from server.models.Notification import Notification


cuisines = ['Japanese', 'French', 'Mexican', 'Egyptian', 'Viking']
for cuisine in cuisines:
    new_cuisine = Cuisine(cuisine)
    db.session.add(new_cuisine)

# create 10 users
for i in range(1, 11):
    chef = User(f'chef{i}', f'chef{i}@chef.com', 'p@ssword1')
    chef.isChef = True
    chef.chefCuisine = random.choice(cuisines)
    db.session.add(chef)

# create 10 users
for i in range(1, 11):
    user = User(f'user{i}', f'user{i}@user.com', 'p@ssword1')
    db.session.add(user)

db.session.commit()

# add notifications for first 3 users:
for i in range(1, 4):
    new_notification3 = Notification(
        i, "A reallly really really really long read notification message", True)
    new_notification4 = Notification(i, "A read notification message", True)
    new_notification1 = Notification(i, "An unread notification message")
    new_notification2 = Notification(
        i, "A really really really really long unread notification message")
    db.session.add(new_notification1)
    db.session.add(new_notification2)
    db.session.add(new_notification3)
    db.session.add(new_notification4)

# create meal_items for chefs
for i in range(1, 11):
    userId = User.query.filter_by(email=f'chef{i}@chef.com').first().id

    for j in range(1, 11):
        meal_item = MealItem(
            userId, f'Yummy Food {j}', 10, 2, "Very very delicious")
        db.session.add(meal_item)

# create cuisines for users
for i in range(1, 11):
    user = User.query.filter_by(email=f'user{i}@user.com').first()
    cuisine = Cuisine.query.filter_by(name=random.choice(cuisines)).first()
    user.cuisines.append(cuisine)
    db.session.add(user)

db.session.commit()
print("Added sample data to database")

exit()
