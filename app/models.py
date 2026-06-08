from datetime import datetime, date, timedelta 
from werkzeug.security import generate_password_hash, check_password_hash
from app import db 

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(80), unique = True, nullable = False) 
    password_hash = db.Column(db.String(256), nullable = False) 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    habits = db.relationship("Habit", backref="user", lazy=True)
 
    def set_password (self, password) :
        self.password_hash = generate_password_hash(password)

    def check_password(self, password) :
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username, 
            "created_at": self.created_at.isoformat(),
        }
    
class Habit(db.Model):
    __tablename__ = "habits"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(500), default="")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    logs = db.relationship("HabitLog", backref="habit", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "created_at": self.created_at.isoformat(),
            "is_active": self.is_active,
        }
    def completed_today(self):
        return any(log.date == date.today() for log in self.logs)

    def current_streak(self):
        if not self.logs:
            return 0
        sorted_dates = sorted(set(log.date for log in self.logs), reverse = True) 
        streak = 0
        check_date = date.today()
        for log_date in sorted_dates:
            if log_date == check_date:  
                streak+=1
                check_date -= timedelta(days=1)
            elif log_date <check_date:
                break
            return streak 
        
    def best_streak(self):
        if not self.logs:
            return 0
        sorted_dates = sorted(set(log.date for log in self.logs))
        best = 1
        current =1 
        for i in range(1, len(sorted_dates)):
            if(sorted_dates[i] - sorted_dates[i-1]).days == 1:
                current +=1
                best = max(best, current)
            else:
                current = 1
            return best 
        
class HabitLog(db.Model):
    __tablename__ = "habit_logs"

    id = db.Column(db.Integer, primary_key=True)
    habit_id = db.Column(db.Integer, db.ForeignKey("habits.id"), nullable=False)
    date = db.Column(db.Date, nullable=False, default=date.today)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "habit_id": self.habit_id,
            "date": self.date.isoformat(),
            "completed_at": self.completed_at.isoformat(),
        }