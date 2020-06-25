import os
from dotenv import load_dotenv
load_dotenv()

TEAM_NAME = os.getenv('TEAM_NAME')
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
DB_URL = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(
    user=os.getenv('DB_USER'), pw=os.getenv('DB_PASSWORD'), url=os.getenv('DB_URL'), db=os.getenv('DB_NAME'))

AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY')
AWS_SECRET_KEY = os.getenv('AWS_SECRET_KEY')
STRIPE_API_KEY = os.getenv('STRIPE_API_KEY')
CLIENT_URL = "/"
