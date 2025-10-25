from flask_sqlalchemy import SQLAlchemy

# Khởi tạo SQLAlchemy (chưa gắn vào app)
db = SQLAlchemy()

# Import tất cả model (để Flask tự nhận biết bảng khi create_all)
from .user import User
from .admin import Admin
from .product import Product
from .category import Category
from .order import Order
from .order_item import OrderItem
from .comment import Comment
from .feedback import Feedback

# Cho phép import gọn trong app.py
__all__ = [
    "db",
    "User",
    "Admin",
    "Product",
    "Category",
    "Order",
    "OrderItem",
    "Comment",
    "Feedback",
]