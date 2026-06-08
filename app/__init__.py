from flask import Flask 
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager 
from flask_cors import CORS       
from config import Config 

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)                      

    from app.routes.auth import auth_bp
    from app.routes.habits import habits_bp
    from app.routes.habit_logs import habit_logs_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(habits_bp, url_prefix="/habits") 
    app.register_blueprint(habit_logs_bp, url_prefix="/habit-logs")

    with app.app_context():
        db.create_all()

    return app