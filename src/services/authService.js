// Simple authentication service using localStorage

// Check if user is logged in
export const isAuthenticated = () => {
  const user = localStorage.getItem('medInventoryUser');
  return !!user;
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('medInventoryUser');
  return user ? JSON.parse(user) : null;
};

// Login user
export const login = (username, password) => {
  // In a real app, this would validate against a backend
  // For this demo, we'll just check if username and password are not empty
  if (username && password) {
    const user = { username };
    localStorage.setItem('medInventoryUser', JSON.stringify(user));
    return user;
  }
  return null;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('medInventoryUser');
};
