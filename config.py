import os 

class Config: 
    SECRET_kEY = os.environ.get("SECRET_kEY", "amaze-dev-secret")
    SQLALCHEMY_DATABASE_URI = "sqlite:///amaze.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
