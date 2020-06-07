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
4. Initialize database tables with `pipenv run init_db`

## Add seeder data to databse:

1. Add cuisines by running `python db_seeder.py`

## Updating Postgress database relationships:

After making changes to any database models, the database tables need to be updated. To update them, from your server folder run:

1. `python manage.py db init` to create a "migrations" folder in the project directory (only needs to be done once)
2. `python manage.py db migrate` to populate our "migrations" folder with the updated tables
3. `python manage.py db upgrade` to apply the changes to the database
