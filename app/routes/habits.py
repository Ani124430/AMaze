from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date, timedelta 
from app import db 
from app.models import Habit, HabitLog, User 

habits_bp = Blueprint("habits", __name__)

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

@habits_bp.route("/<int:habit_id>", methods=["GET"])
@jwt_required()
def get_habit(habit_id):
    user = get_current_user()
    habit = Habit.query.filter_by(id = habit_id, user_id= user.id).first_or_404()

    d = habit.to_dict()
    d["completed_today"] = habit.completed_today() 
    d["current_streak"] = habit.current_streak()
    return jsonify(d), 200 

@habits_bp.route("/<int:habit_id>", methods=["PUT"])
@jwt_required() 
def update_habit(habit_id):
    user = get_current_user()
    habit = Habit.query.filter_by(id = habit_id, user_id= user.id).first_or_404()
    data = request.get_json() or {}

    if "name" in data:
        habit.name = data["name"].strip()
    if "description" in data:
        habit.description = data["description"].strip()

    db.session.commit()
    return jsonify(habit.to_dict()), 200

@habits_bp.route("/<int:habit_id>", methods=["DELETE"])
@jwt_required()
def delete_habit(habit_id):
    user = get_current_user()
    habit = Habit.query.filter_by(id = habit_id, user_id= user.id).first_or_404()
    habit.is_active = False
    db.session.commit()
    return jsonify({"message": f"Навикът '{habit.name}' е изтрит"}), 200

@habits_bp.route("/<int:habit_id>/complete", methods=["POST"])
@jwt_required() 
def complete_habit(habit_id):
    user = get_current_user()
    habit = Habit.query.filter_by(id = habit_id, user_id = user.id, is_active = True).first_or_404()

    today = date.today()
    existing = HabitLog.query.filter_by(habit_id=habit_id, date=today).first()
    if existing:
        return jsonify({
            "message": "Вече е маркиран за днес! 🎉",
            "log": existing.to_dict(),
            "current_streak": habit.current_streak(),
        }), 200
    log = HabitLog(habit_id = habit.id, date = today)
    db.session.add(log)
    db.session.commit()

    return jsonify({
        "message": "Браво! Навикът е изпълнен! ✅",
        "log": log.to_dict(),
        "current_streak": habit.current_streak(),
    }), 201
