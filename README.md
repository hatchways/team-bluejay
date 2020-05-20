# flask-starter

## Starting the server:

1. Open a terminal and go to the server folder. Make sure you have **pipenv** installed (`pip install pipenv`)
2. Install the dependencies with `pipenv install`. This also createa a virtual environment, if there isn't one already
3. Activate the virtual environment with `pipenv shell`
4. Start the app with `flask run`

## Adding Postgres database:

1. Download [Postgres](https://www.postgresql.org/)
2. Create database named 'team-bluejay' using a SQL client of your choice. [Instructions for database creation](https://www.guru99.com/postgresql-create-database.html) using pgAdmin which is automatically downloaded with Postgres. (Instructions are halfway down the link page)
3. Update password variable in `app.py` to match your SQL password
4. Create database within command terminal using below commands

### Commands to initialize Postgres database with tables

```
python
from app import db
db.create_all()
exit()
```
