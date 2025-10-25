// Login functionality for both customer and admin
class LoginManager {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.init();
    }

    init() {
        // Add event listeners for both login forms
        document.getElementById('adminLogin').addEventListener('submit', (e) => this.handleAdminLogin(e));
        document.getElementById('userLogin').addEventListener('submit', (e) => this.handleCustomerLogin(e));
        
        // Clear any existing localStorage session data to prevent auto-redirect
        // This ensures users can always access the login page
        localStorage.removeItem('userInfo');
        localStorage.removeItem('adminInfo');
        localStorage.removeItem('userRole');
        
        // Check if user is already logged in (server-side only)
        this.checkExistingSession();
    }

    async checkExistingSession() {
        try {
            // Only check server session, don't auto-redirect from localStorage
            // This prevents automatic redirect when opening login page
            const response = await fetch(`${this.baseURL}/auth/check-session`, {
                method: 'GET',
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (data.success && data.user.logged_in) {
                // User is already logged in, redirect accordingly
                this.redirectAfterLogin(data.user.role);
            }
        } catch (error) {
            console.log('No existing session found');
        }
    }

    async handleCustomerLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('user-username').value;
        const password = document.getElementById('user-password').value;
        
        if (!username || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/auth/customer-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (data.success) {
                this.showMessage('Login successful! Redirecting...', 'success');
                
                // Store user info in localStorage for easy access
                localStorage.setItem('userInfo', JSON.stringify(data.user));
                localStorage.setItem('userRole', 'customer');
                
                // Redirect to index.html after a short delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                this.showMessage(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage('Network error. Please try again.', 'error');
        }
    }

    async handleAdminLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;
        
        if (!username || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/auth/admin-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (data.success) {
                this.showMessage('Admin login successful! Redirecting...', 'success');
                
                // Store admin info in localStorage for easy access
                localStorage.setItem('adminInfo', JSON.stringify(data.admin));
                localStorage.setItem('userRole', 'admin');
                
                // Redirect to admin.html after a short delay
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1500);
            } else {
                this.showMessage(data.message || 'Admin login failed', 'error');
            }
        } catch (error) {
            console.error('Admin login error:', error);
            this.showMessage('Network error. Please try again.', 'error');
        }
    }

    redirectAfterLogin(role) {
        if (role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'index.html';
        }
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.login-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `login-message ${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            ${type === 'success' ? 'background-color: #10b981;' : 'background-color: #ef4444;'}
        `;

        document.body.appendChild(messageDiv);

        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Session management utilities
class SessionManager {
    static isLoggedIn() {
        return localStorage.getItem('userRole') !== null;
    }

    static getUserRole() {
        return localStorage.getItem('userRole');
    }

    static getUserInfo() {
        const role = this.getUserRole();
        if (role === 'customer') {
            return JSON.parse(localStorage.getItem('userInfo') || '{}');
        } else if (role === 'admin') {
            return JSON.parse(localStorage.getItem('adminInfo') || '{}');
        }
        return null;
    }

    static async logout() {
        try {
            const response = await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            
            // Clear local storage
            localStorage.removeItem('userInfo');
            localStorage.removeItem('adminInfo');
            localStorage.removeItem('userRole');
            
            // Redirect to login page
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear local storage and redirect even if server logout fails
            localStorage.clear();
            window.location.href = 'login.html';
        }
    }

    static async createOrder(orderData) {
        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Order creation error:', error);
            return { success: false, message: 'Network error' };
        }
    }
}

// Initialize login manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});

// Export for use in other files
window.SessionManager = SessionManager;
