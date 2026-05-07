from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app import db 
from app.models import Users

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", method = ["POST"])
def register(): 
    data = request.get_json()
    if not data or not data.get ("username") or not data.get("password"):
        return jsonify({"error": "username и password са задължителни"}), 400
    
    if len(data["password"]) < 6:
        return jsonify({"error": "Потребителското име вече съществува"}), 409
    
    
