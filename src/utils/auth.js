import { toast } from 'react-toastify';

class AuthManager {
  constructor() {
    if (AuthManager.instance) {
      return AuthManager.instance;
    }
    AuthManager.instance = this;
    
    this.currentUser = null;
    this.isAuthenticated = false;
    this.authListeners = new Set();
  }

  async init() {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await this.validateToken(token);
      }
    } catch (err) {
      console.error('Auth initialization failed:', err);
      this.logout();
    }
  }

  async login(username, password) {
    try {
      // In a real app, this would make an API call
      const response = await fetch('https://airspeak.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      this.setSession(data);
      return data;
    } catch (err) {
      console.error('Login failed:', err);
      toast.error('Login failed. Please try again.');
      throw err;
    }
  }

  async register(username, email, password) {
    try {
      // In a real app, this would make an API call
      const response = await fetch('https://airspeak.onrender.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      this.setSession(data);
      return data;
    } catch (err) {
      console.error('Registration failed:', err);
      toast.error('Registration failed. Please try again.');
      throw err;
    }
  }

  setSession(authData) {
    this.currentUser = authData.user;
    this.isAuthenticated = true;
    localStorage.setItem('auth_token', authData.token);
    localStorage.setItem('user_data', JSON.stringify(authData.user));
    this.notifyListeners();
  }

  async validateToken(token) {
    try {
      // In a real app, this would verify the token with the server
      const response = await fetch('https://airspeak.onrender.com/auth/validate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid token');
      }

      const data = await response.json();
      this.currentUser = data.user;
      this.isAuthenticated = true;
      this.notifyListeners();
    } catch (err) {
      console.error('Token validation failed:', err);
      this.logout();
      throw err;
    }
  }

  logout() {
    this.currentUser = null;
    this.isAuthenticated = false;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.notifyListeners();
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getToken() {
    return localStorage.getItem('auth_token');
  }

  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  addAuthListener(listener) {
    this.authListeners.add(listener);
  }

  removeAuthListener(listener) {
    this.authListeners.delete(listener);
  }

  notifyListeners() {
    this.authListeners.forEach(listener => {
      listener({
        isAuthenticated: this.isAuthenticated,
        user: this.currentUser
      });
    });
  }
}

const authManager = new AuthManager();
export default authManager;
