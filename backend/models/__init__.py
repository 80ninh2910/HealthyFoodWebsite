from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .admin import Admin
from .product import Product
from .category import Category
from .order import Order
from .order_item import OrderItem
from .comment import Comment
from .feedback import Feedback

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