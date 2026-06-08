from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app import db 
from app.models import User

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/sign-up", methods = ["POST"])
def register(): 
    data = request.get_json()
    if not data or not data.get ("username") or not data.get("password"):
        return jsonify({"error": "username и password са задължителни"}), 400
    
    if len(data["password"]) < 6:
        return jsonify({"error": "Паролата трябва да е поне 6 символа"}), 400    
    
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Потребителското име вече съществува"}), 409 
    
    user = User(username=data["username"])
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit() 

    token = create_access_token(identity=str(user.id))
    return jsonify({"message": "Регистрацията е успешна!", "token": token, "user": user.to_dict()}), 201

@auth_bp.route("/sign-in", methods = ["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Няма данни"}), 400
    
    if not data.get("username"):         
        return jsonify({"error": "username е задължително"}), 400
    
    user = User.query.filter_by(username=data["username"]).first()
    if not user or not user.check_password(data.get("password", "")):
        return jsonify({"error": "Невалидни данни за вход"}), 401
    
    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 200