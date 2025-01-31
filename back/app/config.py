from decouple import config

class Config:
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:admin@localhost/extension?charset=utf8"