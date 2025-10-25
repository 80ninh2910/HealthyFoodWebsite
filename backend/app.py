from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from config import Config
from models import db, User, Admin, Product, Category, Order, OrderItem, Comment, Feedback
from sqlalchemy import text
import os

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, supports_credentials=True, origins=['http://127.0.0.1:5500', 'http://localhost:5500'])

# Configure session with simple settings
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Initialize database
db.init_app(app)

@app.route('/test-db')
def test_db():
    try:
        db.session.execute(text("SELECT 1"))
        return jsonify({"connected": True, "message": "✅ Database connected successfully!"})
    except Exception as e:
        return jsonify({"connected": False, "error": str(e)})

@app.route('/api/auth/customer-login', methods=['POST'])
def customer_login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({"success": False, "message": "Username and password are required"}), 400
        
        # Find user in database
        user = User.query.filter_by(username=username).first()
        
        if not user:
            return jsonify({"success": False, "message": "Invalid username or password"}), 401
        
        # Check password (assuming passwords are hashed in database)
        # For now, we'll do a simple comparison. In production, use proper password hashing
        if user.password != password:  # In production, use: check_password_hash(user.password, password)
            return jsonify({"success": False, "message": "Invalid username or password"}), 401
        
        # Check if user is a customer (not admin)
        if user.role and user.role.lower() == 'admin':
            return jsonify({"success": False, "message": "Please use admin login for admin accounts"}), 401
        
        # Set session for customer
        session['user_id'] = user.id
        session['username'] = user.username
        session['user_role'] = 'customer'
        session['email'] = user.email
        
        return jsonify({
            "success": True, 
            "message": "Login successful",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role or 'customer'
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Login error: {str(e)}"}), 500

@app.route('/api/auth/admin-login', methods=['POST'])
def admin_login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({"success": False, "message": "Username and password are required"}), 400
        
        # Find user with the given username
        user = User.query.filter_by(username=username).first()
        
        if not user:
            return jsonify({"success": False, "message": "Invalid admin credentials"}), 401
        
        # Check if this user has admin role or admin privileges
        if user.role != 'admin':
            # Check if user has admin record in admins table
            admin = Admin.query.filter_by(user_id=user.id).first()
            if not admin:
                return jsonify({"success": False, "message": "User does not have admin privileges"}), 401
        else:
            # User has admin role in users table, create a mock admin object
            admin = type('Admin', (), {
                'id': user.id,
                'user_id': user.id,
                'display_name': user.username,
                'is_super': True
            })()
        
        # Check password (assuming passwords are hashed in database)
        # For now, we'll do a simple comparison. In production, use proper password hashing
        if user.password != password:  # In production, use: check_password_hash(user.password, password)
            return jsonify({"success": False, "message": "Invalid admin credentials"}), 401
        
        # Set session for admin
        session['admin_id'] = admin.id
        session['user_id'] = user.id
        session['username'] = user.username
        session['user_role'] = 'admin'
        session['email'] = user.email
        
        print(f"Admin session set: {dict(session)}")  # Debug print
        
        return jsonify({
            "success": True, 
            "message": "Admin login successful",
            "admin": {
                "id": admin.id,
                "user_id": user.id,
                "username": user.username,
                "email": user.email,
                "display_name": admin.display_name,
                "is_super": admin.is_super,
                "role": "admin"
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Admin login error: {str(e)}"}), 500

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    try:
        session.clear()
        return jsonify({"success": True, "message": "Logged out successfully"})
    except Exception as e:
        return jsonify({"success": False, "message": f"Logout error: {str(e)}"}), 500

@app.route('/api/auth/check-session', methods=['GET'])
def check_session():
    try:
        print(f"Session data: {dict(session)}")  # Debug print
        if 'user_id' in session or 'admin_id' in session:
            user_data = {
                "logged_in": True,
                "user_id": session.get('user_id'),
                "admin_id": session.get('admin_id'),
                "username": session.get('username'),
                "role": session.get('user_role'),
                "email": session.get('email')
            }
            return jsonify({"success": True, "user": user_data})
        else:
            return jsonify({"success": True, "user": {"logged_in": False}})
    except Exception as e:
        return jsonify({"success": False, "message": f"Session check error: {str(e)}"}), 500

@app.route('/api/orders', methods=['POST'])
def create_order():
    try:
        # Check if user is logged in
        if 'user_id' not in session:
            return jsonify({"success": False, "message": "User must be logged in to place orders"}), 401
        
        data = request.get_json()
        user_id = session['user_id']
        
        # Here you would create the order in the database
        # For now, just return success
        return jsonify({
            "success": True, 
            "message": "Order created successfully",
            "order_id": f"ORD_{user_id}_{len(data.get('items', []))}"
        })
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Order creation error: {str(e)}"}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
