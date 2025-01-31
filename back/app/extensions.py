import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

load_dotenv()
on_production = os.getenv('PROD') == 'True'
db_schema = os.getenv('DB_SCHEMA')
db_username = os.getenv('DB_USERNAME')
db_password = os.getenv('DB_PASSWORD')
