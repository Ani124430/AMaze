from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from datetime import date, timedelta
from app import db 
from app.models import Habit, HabitLog
from app.routes.habits import get_current_user

habit_logs_bp = Blueprint("habit_logs", __name__)

@habit_logs_bp.route("/", methods = ["POST"])
@jwt_required()
def create_log():
    user = get_current_user()
    data = request.get_json()

    if not data or not data.get("habit_id"):
        return jsonify({"error": "habit_id е задължително"}), 400 
    
    habit = Habit.query.filter_by(id=data["habit_id"], user_id = user.id, is_active=True).first_or_404()

    today =date.today()
    existing = HabitLog.query.filter_by(habit_id = habit.id, date=today).first()
    if existing:
        return jsonify({
            "message": "Вече е маркиран за днес! 🎉",
            "log": existing.to_dict(),
            "current_streak": habit.current_streak(),
        }), 200
    
    log = HabitLog(habit_id=habit.id, date = today)
    db.session.add(log)
    db.session.commit()

    return jsonify({
        "message": "Браво! Навикът е изпълнен! ✅",
        "log":log.to_dict(),
        "current_streak": habit.current_streak(),
    }), 201

@habit_logs_bp.route("/", methods = ["GET"])
@jwt_required()
def get_logs():
    user = get_current_user()

    habit_id = request.args.get("habit_id", type = int)
    days = request.args.get("days", 30, type = int)

    if not habit_id:
        return jsonify({"error": "habit_id  е задължителен параметър"}), 400
    
    habit = Habit.query.filter_by(id = habit_id, user_id = user.id).first_or_404()
    since = date.today() - timedelta(days=days)

    logs = (
        HabitLog.query
        .filter(HabitLog.habit_id == habit_id, HabitLog.date >=since)
        .order_by(HabitLog.date.desc())
        .all()
    )

    return jsonify({
        "habit": habit.to_dict(), 
        "current_streak": habit.current_streak(),
        "best_streak": habit.best_streak(),
        "period_days": days,
        "logs": [l.to_dict() for l in logs],
    }), 200
