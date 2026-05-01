import os 

class Config: 
    SECRET_kEY = os.environ.get("SECRET_KEY", "amaze-dev-secret")
    SQLALCHEMY_DATABASE_URL = "sqlite://amaze.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
