from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date, timedelta 
from app import db 
from app.models import Habit, HabitLog, User 

habits_bp = Blueprint("habit", __name__)

def get_current_user():
    user_id = int(get_jwt_identity())
    return User.query.get_or_404(user_id)

@habits_bp.route("/", methods = ["GET"])
@jwt_required()
def get_habits():
    user = get_current_user()
    habits = Habit.query.filter_by(user_id = user.id, is_active = True).all()

    result = []
    for h in habits:
        d = h.to_dict()
        d["completed_today"] = h.completed_today()
        d["current_streak"] = h.current_streak()
        result.append(d)
    return jsonify(result), 200

@habits_bp.route("/", methods = ["POST"])
@jwt_required()
def create_habit():
    user = get_current_user()
    data = request.get_json()

    if not data or not data.get("name"):
        return jsonify({"error": "Полето 'name' е задължително"}), 400
    
    habit = Habit(
        user_id = user.id, 
        name = data["name"].strip(),
        description=data.get("description", "").strip(),
    )
    db.session.add(habit)
    db.session.commit()

    return jsonify(habit.to_dict()), 201


