from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from config import Config
from models import db, User, Admin, Product, Category, Order, OrderItem, Comment, Feedback
from sqlalchemy import text
from datetime import datetime
import os

app = Flask(__name__)
app.config.from_object(Config)

# Cookie / SameSite configuration
# In development we often run frontend on a different port (e.g. 5500) which is a
# different origin. Browsers require SameSite=None + Secure for cross-site cookies
# but Secure requires HTTPS. To avoid blocking cookies during local development
# we'll use a conservative configuration: when FLASK_ENV=development (or on
# localhost) use SameSite='Lax' and Secure=False so cookies are accepted by the
# browser during testing when frontend and backend are served over HTTP on
# localhost. For production, prefer SameSite='None' and SESSION_COOKIE_SECURE=True
# with HTTPS.
if os.environ.get('FLASK_ENV') == 'development' or os.environ.get('DEV_LOCALHOST') == '1':
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = False
else:
    # production: allow cross-site cookies only over HTTPS
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    app.config['SESSION_COOKIE_SECURE'] = True

CORS(app, 
    supports_credentials=True,
    origins=['http://127.0.0.1:5500', 'http://localhost:5500'])

# Initialize database
db.init_app(app)

@app.route('/test-db')
def test_db():
    try:
        db.session.execute(text("SELECT 1"))
        return jsonify({"connected": True, "message": "✅ Database connected successfully!"})
    except Exception as e:
        return jsonify({"connected": False, "error": str(e)})

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.json
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        # Kiểm tra dữ liệu đầu vào
        if not username or not email or not password:
            return jsonify({"success": False, "message": "Missing required fields"}), 400
            
        # Kiểm tra username đã tồn tại chưa
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({"success": False, "message": "Username already exists"}), 400
            
        # Kiểm tra email đã tồn tại chưa
        existing_email = User.query.filter_by(email=email).first()
        if existing_email:
            return jsonify({"success": False, "message": "Email already exists"}), 400
            
        # Tạo user mới với role là user
        # Lưu mật khẩu trực tiếp không mã hóa
        from datetime import datetime
        new_user = User(username=username, email=email, password=password, role='user', created_at=datetime.now())
        
        # Lưu vào database
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({"success": True, "message": "Registration successful"}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/auth/customer-login', methods=['POST'])
def customer_login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        print(f"Login attempt for username: {username}")
        
        if not username or not password:
            return jsonify({"success": False, "message": "Username and password are required"}), 400
        
        # Find user in database
        user = User.query.filter_by(username=username).first()
        
        if not user:
            print("User not found")
            return jsonify({"success": False, "message": "Invalid username or password"}), 401
        
        # Check password directly (no hashing)
        if user.password != password:
            print("Invalid password")
            return jsonify({"success": False, "message": "Invalid username or password"}), 401
        
        # Check if user is a customer (not admin)
        if user.role and user.role.lower() == 'admin':
            print("Admin trying to use customer login")
            return jsonify({"success": False, "message": "Please use admin login for admin accounts"}), 401
        
        # Clear any existing session
        session.clear()
        
        # Set session for customer and make it permanent
        session.permanent = True
        session['user_id'] = user.id
        session['username'] = user.username
        session['user_role'] = 'customer'
        session['email'] = user.email
        
        print(f"Session created for user: {user.username}")
        print(f"Session data: {dict(session)}")
        
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

        # Determine admin record
        if user.role != 'admin':
            admin = Admin.query.filter_by(user_id=user.id).first()
            if not admin:
                return jsonify({"success": False, "message": "User does not have admin privileges"}), 401
        else:
            # Create a lightweight admin-like object for users flagged as admin
            admin = type('Admin', (), {
                'id': user.id,
                'user_id': user.id,
                'display_name': user.username,
                'is_super': True
            })()

        # Check password
        if user.password != password:
            return jsonify({"success": False, "message": "Invalid admin credentials"}), 401

        # Clear previous session and set new admin session
        session.clear()
        session.permanent = True
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
                "display_name": getattr(admin, 'display_name', user.username),
                "is_super": getattr(admin, 'is_super', False),
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
        # Get user_id from session
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({"success": True, "user": {"logged_in": False}})

        # Validate user exists in database
        user = User.query.get(user_id)
        if not user:
            session.clear()  # Clear invalid session
            return jsonify({"success": True, "user": {"logged_in": False}})

        # Return valid user session data
        return jsonify({
            "success": True,
            "user": {
                "logged_in": True,
                "user_id": user.id,
                "username": user.username,
                "role": user.role or 'customer',
                "email": user.email
            }
        })
    except Exception as e:
        print(f"Session check error: {str(e)}")
        session.clear()  # Clear session on error
        return jsonify({"success": False, "message": "Lỗi kiểm tra phiên đăng nhập"}), 500

@app.route('/api/orders', methods=['POST'])
def create_order():
    try:
        # DEBUG: print request cookies/headers/session to diagnose missing user_id
        print('\n--- create_order called ---')
        print('Request cookies:', dict(request.cookies))
        print('Request headers:', {k: v for k, v in request.headers.items() if k.lower() in ['host','origin','referer','cookie','content-type']})
        print('Current session dict:', dict(session))

        # Check if user is logged in and get user_id from session
        user_id = session.get('user_id')
        used_client_fallback = False
        if not user_id:
            # Fallback: allow client to send user_id in payload when server session is missing.
            # NOTE: This is a temporary workaround for development-only scenarios where cookies
            # or sessions are not reliably exchanged between frontend and backend. It is less
            # secure than server-side sessions and should be removed or replaced with a proper
            # token-based auth (JWT) or ensuring SameSite/Secure cookie correctness in production.
            data_for_user = request.get_json(silent=True) or {}
            client_user_id = data_for_user.get('user_id')
            if client_user_id:
                try:
                    user_id = int(client_user_id)
                    used_client_fallback = True
                    print(f"create_order: using client-provided user_id={user_id} as fallback")
                except Exception:
                    print('create_order: invalid client-provided user_id')
                    return jsonify({"success": False, "message": "Invalid user identifier"}), 400
            else:
                print('create_order: user_id missing in session and payload')
                return jsonify({"success": False, "message": "Vui lòng đăng nhập để đặt hàng"}), 401

        # Validate user exists in database
        user = User.query.get(user_id)
        if not user:
            if not used_client_fallback:
                session.clear()  # Clear invalid session
                return jsonify({"success": False, "message": "Không tìm thấy thông tin người dùng"}), 401
            else:
                # client provided an invalid user_id
                return jsonify({"success": False, "message": "Người dùng không tồn tại"}), 401
            
        # Get and validate request data
        data = request.get_json()
        if not data or not data.get('items'):
            return jsonify({"success": False, "message": "Giỏ hàng trống"}), 400
            
        print(f"Processing order for user: {user.username} (ID: {user_id})")
        
        if not data or not data.get('items'):
            print("No items in request data")
            return jsonify({"success": False, "message": "Giỏ hàng trống"}), 400

        # Validate user exists
        user = User.query.get(user_id)
        if not user:
            print(f"User {user_id} not found in database")
            session.clear()
            return jsonify({"success": False, "message": "Người dùng không tồn tại"}), 401

        try:
            # Only save to orders table, skip order_items
            new_order = Order(
                user_id=user_id,
                total=data.get('total', 0),
                status='pending'
                # created_at will be set automatically by DB default
            )
            db.session.add(new_order)
            db.session.commit()

            # Return success with order details for confirmation page
            return jsonify({
                "success": True,
                "redirect": "/html/order-confirmation.html",
                "order_id": f"ORD_{new_order.id}",
                "order": {
                    "id": new_order.id,
                    "user_id": new_order.user_id,
                    "total": new_order.total,
                    "status": new_order.status
                }
            })
        except Exception as e:
            db.session.rollback()
            print(f"Order creation error: {str(e)}")
            return jsonify({
                "success": False,
                "message": "Lỗi khi tạo đơn hàng"
            }), 500

    except Exception as e:
        db.session.rollback()
        print(f"Order creation error: {str(e)}")  # Log the error
        return jsonify({
            "success": False,
            "message": f"Lỗi khi tạo đơn hàng: {str(e)}"
        }), 500

if __name__ == '__main__':
    with app.app_context():
        # Ensure tables exist (will not alter existing tables). We'll create missing tables
        # and then perform a lightweight runtime migration for known missing columns
        # that may exist on older databases (development convenience).
        db.create_all()

        # Lightweight migration: if `orders` table exists but lacks `created_at`, add it.
        try:
            # Check if 'created_at' column exists in 'orders'
            res = db.session.execute(text("SHOW COLUMNS FROM orders LIKE 'created_at'"))
            rows = list(res)
            if len(rows) == 0:
                print("Migration: adding 'created_at' column to 'orders' table")
                db.session.execute(text("ALTER TABLE orders ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP"))
                db.session.commit()
            else:
                print("Migration: 'created_at' column already present on 'orders' table")
        except Exception as me:
            # If the table doesn't exist yet or the DB user lacks privileges, log and continue.
            print('Migration check for orders.created_at failed or not necessary:', str(me))
    app.run(debug=True, port=5000)
