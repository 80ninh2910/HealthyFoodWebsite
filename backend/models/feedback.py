from models import db
from datetime import datetime

class Feedback(db.Model):
    __tablename__ = 'feedback'  # đúng như trong DB MySQL

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    subject = db.Column(db.String(255))
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='pending')  # pending / reviewed / resolved
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Mối quan hệ ngược: 1 user có thể gửi nhiều feedback
    user = db.relationship('User', backref=db.backref('feedbacks', lazy=True))

    def __repr__(self):
        return f"<Feedback {self.subject or self.id}>"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "subject": self.subject,
            "message": self.message,
            "status": self.status,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }
