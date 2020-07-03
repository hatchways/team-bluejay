# To update database from command line run:
# 1. `python manage.py db init` (only needs to be done on first migration)
# 2. `python manage.py db migrate`
# 3. `python manage.py db upgrade`


# Allows existing database models to get updated upon changes to database tables and relationships
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from server import create_app, db

app = create_app()
app.app_context().push()

migrate = Migrate(app, db)
manager = Manager(app)
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
