from models import db
from datetime import datetime

class Admin(db.Model):
    __tablename__ = 'admins'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    display_name = db.Column(db.String(150))
    is_super = db.Column(db.Boolean, default=False, nullable=False)
    permissions = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship to User table
    user = db.relationship('User', backref='admin_profile', lazy=True)

    def __repr__(self):
        return f"<Admin {self.display_name or self.user.username if self.user else 'Unknown'}>"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "display_name": self.display_name,
            "is_super": self.is_super,
            "permissions": self.permissions,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None,
            "username": self.user.username if self.user else None,
            "email": self.user.email if self.user else None,
            "role": "admin"
        }
