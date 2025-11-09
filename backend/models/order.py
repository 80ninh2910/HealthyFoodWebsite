from models import db
from sqlalchemy import text

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')
    # Use a server-side default so the database sets the timestamp in its own format.
    # This avoids sending a Python datetime (with microseconds/timezone differences)
    # in the INSERT and keeps the DB schema unchanged.
    created_at = db.Column(db.DateTime, server_default=text('CURRENT_TIMESTAMP'), nullable=False)

    # Quan hệ ORM
    user = db.relationship('User', backref='orders', lazy=True)
    items = db.relationship('OrderItem', backref='order', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "total": self.total,
            "status": self.status,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None,
            "items": [item.to_dict() for item in self.items]
        }
