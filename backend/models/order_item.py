from models import db

class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    note = db.Column(db.String(255))

    product = db.relationship('Product', backref='order_items', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "product_name": self.product.name if self.product else None,
            "price": self.product.price if self.product else None,
            "subtotal": (self.product.price * self.quantity) if self.product else None
        }
