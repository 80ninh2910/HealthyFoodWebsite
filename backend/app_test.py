from flask import Flask, jsonify
from config import Config
from models import db
from sqlalchemy import text  # ✅ thêm dòng này

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

@app.route('/test-db')
def test_db():
    try:
        db.session.execute(text("SELECT 1"))  # ✅ sửa tại đây
        return jsonify({"connected": True, "message": "✅ Database connected successfully!"})
    except Exception as e:
        return jsonify({"connected": False, "error": str(e)})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)

