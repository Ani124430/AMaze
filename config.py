import os 

class Config: 
    SECRET_KEY = os.environ.get("SECRET_KEY", "amaze-dev-secret")
    SQLALCHEMY_DATABASE_URI = "sqlite:///amaze.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
