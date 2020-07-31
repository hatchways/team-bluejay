# [Chef's Menu](https://team-bluejay.herokuapp.com)

It’s always nice to have a homecooked meal that is authentic and made in your own kitchen. [Chef's Menu](https://team-bluejay.herokuapp.com) is a marketplace where customers can book a chef in their area based on cuisine type and availability.

[Go to live site](https://team-bluejay.herokuapp.com)

![Chef's Menu application in use](client/src/images/chefsMenu.gif)

## Contributors

[Gabriel Atienza](https://github.com/giftofgrub), [Moshe Siegel](https://github.com/mssiegel/), [Kareem Sakr](https://github.com/kareemsakr)

## Tech stack

- React
- Material UI
- Python
- Flask
- Postgres SQL
- Amazon S3
- SocketIO
- Stripe

## Setup instructions

Rename `.env.template` under both the root and `client` folders to `.env` and update the values/settings to your own.

### Adding Postgres database

1. Download [Postgres](https://www.postgresql.org/)
2. Create new database using any SQL client such as [pgAdmin](https://www.pgadmin.org/).
3. Update root `.env` with your database name, user, password, and url.
4. Set up your database tables by running `python init_db.py`
5. Add sample customers, chefs, and cuisines by running `python db_seeder.py`

### Starting the server

1. Open a terminal. Make sure you have **pipenv** installed (`pip install pipenv`)
2. Install the dependencies with `pipenv install`. This also creates a virtual environment, if there isn't one already.
3. Activate the virtual environment with `pipenv shell`
4. Start the app with `flask run`

### Starting the client

1. Open a terminal and go to the client folder
2. Install the dependencies with `npm install`
3. Launch the app on http://localhost:3000 with `npm start`

## Updating SQL database relationships

After changing any database models, you'll need to update your SQL tables by going to your server folder and running:

1. `python manage.py db init` to create a "migrations" folder in the project directory (only needs to be done once)
2. `python manage.py db migrate` to populate our "migrations" folder with the updated tables
3. `python manage.py db upgrade` to apply the changes to the database

## Special instructions for running in development

Pipfile includes the python library [eventlet](https://eventlet.net/), an optimized engine for running web sockets in production. `eventlet` will be frustrating for local development as it disables automatic reloading of server. For local development, run `pipenv uninstall eventlet` but **do not** commit that change when pushing to Github.

## Features

- Authentication
- Searching by distance
- Shopping cart
- Checkout
- Payments with Stripe
- Live notifications
- Meal creation
- Profile pages
- Alerts

### Feature descriptions

- **Authentication:** Uses cookies for access, refresh, and csrf tokens. React Context passes the users's logged in state throughout the app.

- **Searching**: Customers can filter chefs based on cuisines and distance from an address

- **Shopping cart**: Customers can add meals to their cart for one chef at a time. If they try adding meals for multiple chefs, they will be prompted to empty their cart.

- **Checkout**: Customer chooses an availability that works for them, confirms their cart items, and enters their payment details.

- **Payments:** Payments are made using Stripe.

- **Live notifications**: Chefs are notified via web sockets when they receive an order via Stripe. All notifications start off as "unread" and change to "read" when a chef opens them.

- **Profile Pages**: All users can add profile images, cuisines, and an address. Chefs can add meals. General address locations are shown via Google Maps.

- **Meal Creation**: Chefs can create and edit meals to include relevant info such as images, pricing, and ingredients.

- **Alerts**: Front end alerts are shown whenever a server request returns an error, such as for incorrect logins or an invalid address.
