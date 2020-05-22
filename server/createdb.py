#!/usr/bin/env python

from app import create_app
app = create_app()
app.app_context().push()
from app import db
db.create_all()
print("just ran createdb.py")
exit()
