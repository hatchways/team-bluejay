# seeds database with sample data
from app import create_app, db
app = create_app()
app.app_context().push()
from models.User import Cuisine

cuisines = ['Japanese', 'French', 'Mexican', 'Egyptian', 'Viking']
for cuisine in cuisines:
    new_cuisine = Cuisine(cuisine)
    db.session.add(new_cuisine)

db.session.commit()

print("Added cuisines to database")
exit()
