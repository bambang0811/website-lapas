const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://lapas-backend.onrender.com/api";

const AUTH_STORAGE_KEY = "lapas_auth";
const USER_STORAGE_KEY = "lapas_user";

class AuthService {
  constructor() {
    // No initialization needed with backend
  }

  // Login via Backend API
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.user) {
        const sessionData = {
          isAuthenticated: true,
          user: {
            id: data.user.id,
            username: data.user.username,
            role: data.user.role,
          },
          loginTime: new Date().toISOString(),
        };

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
        return { success: true, user: sessionData.user };
      }

      return { success: false, message: "Username atau password salah" };
    } catch (error) {
      console.error("Error during login:", error);
      return { success: false, message: "Terjadi kesalahan saat login" };
    }
  }

  // Logout
  logout() {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return { success: true };
    } catch (error) {
      console.error("Error during logout:", error);
      return { success: false, message: "Terjadi kesalahan saat logout" };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    try {
      const authData = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!authData) return false;

      const session = JSON.parse(authData);
      return session.isAuthenticated === true;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  }

  // Check if user is admin
  isAdmin() {
    try {
      if (!this.isAuthenticated()) return false;

      const authData = localStorage.getItem(AUTH_STORAGE_KEY);
      const session = JSON.parse(authData);
      return session.user.role === "admin";
    } catch (error) {
      console.error("Error checking admin role:", error);
      return false;
    }
  }

  // Get current user
  getCurrentUser() {
    try {
      if (!this.isAuthenticated()) return null;

      const authData = localStorage.getItem(AUTH_STORAGE_KEY);
      const session = JSON.parse(authData);
      return session.user;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  // Get session info
  getSessionInfo() {
    try {
      const authData = localStorage.getItem(AUTH_STORAGE_KEY);
      return authData ? JSON.parse(authData) : null;
    } catch (error) {
      console.error("Error getting session info:", error);
      return null;
    }
  }

  // Update user profile
  updateProfile(userData) {
    try {
      if (!this.isAuthenticated()) {
        return { success: false, message: "User not authenticated" };
      }

      const users = JSON.parse(localStorage.getItem("lapas_users") || "[]");
      const currentUser = this.getCurrentUser();
      const userIndex = users.findIndex((u) => u.id === currentUser.id);

      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData };

        // Update session data
        const authData = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
        authData.user = { ...authData.user, ...userData };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
        localStorage.setItem("lapas_users", JSON.stringify(users));

        return { success: true, user: authData.user };
      }

      return { success: false, message: "User not found" };
    } catch (error) {
      console.error("Error updating profile:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat update profile",
      };
    }
  }

  // Change password
  changePassword(currentPassword, newPassword) {
    try {
      if (!this.isAuthenticated()) {
        return { success: false, message: "User not authenticated" };
      }

      const users = JSON.parse(localStorage.getItem("lapas_users") || "[]");
      const currentUser = this.getCurrentUser();
      const user = users.find((u) => u.id === currentUser.id);

      if (user && user.password === currentPassword) {
        user.password = newPassword;
        localStorage.setItem("lapas_users", JSON.stringify(users));
        return { success: true };
      }

      return { success: false, message: "Password lama salah" };
    } catch (error) {
      console.error("Error changing password:", error);
      return {
        success: false,
        message: "Terjadi kesalahan saat mengubah password",
      };
    }
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;
