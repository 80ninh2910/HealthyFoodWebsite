from models import db
from datetime import datetime

class Admin(db.Model):
    __tablename__ = 'admins'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(150))
    full_name = db.Column(db.String(150))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    role = db.Column(db.String(50), default='admin')  # mặc định là admin

    # Quan hệ: mỗi admin có thể xử lý nhiều phản hồi, feedback, ...
    # Ví dụ nếu sau này bạn có bảng Feedback, bạn có thể tạo:
    # feedbacks = db.relationship('Feedback', backref='admin', lazy=True)

    def __repr__(self):
        return f"<Admin {self.username}>"

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "full_name": self.full_name,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None,
            "role": self.role
        }
