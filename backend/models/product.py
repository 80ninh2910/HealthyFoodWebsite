from models import db

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer)
    name = db.Column(db.String(150))
    description = db.Column(db.Text)
    price = db.Column(db.Float)
    fat = db.Column(db.Float)
    protein = db.Column(db.Float)
    carb = db.Column(db.Float)
    calories = db.Column(db.Float)
    image_url = db.Column(db.String(255))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "fat": self.fat,
            "protein": self.protein,
            "carb": self.carb,
            "calories": self.calories,
            "image_url": self.image_url
        }
