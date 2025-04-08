import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaUser, FaLock, FaHeartbeat, FaMedkit, FaHospital, FaMoon, FaSun, FaEye, FaEyeSlash, FaSignInAlt, FaSpinner, FaBoxOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const { login } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Rotate between different medicine models
  useEffect(() => {
    const models = ['pill', 'bottle', 'box'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % models.length;
      setModelType(models[currentIndex]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const success = login(username, password);

      if (success) {
        setLoginSuccess(true);
        // Add a slight delay before navigating to show the success animation
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Failed to log in. Please try again.');
      console.error(err);
    }

    setLoading(false);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-4 sm:px-6 lg:px-8 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Theme toggle button */}
      <motion.button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 z-10"
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isDarkMode ? <FaSun className="text-xl text-yellow-400" /> : <FaMoon className="text-xl" />}
      </motion.button>

      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-white to-secondary-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 -z-10"></div>
      {/* Left side - Branding */}
      <motion.div
        className="w-full md:w-1/2 max-w-md px-8 py-12 flex flex-col items-center justify-center relative z-10"
        variants={itemVariants}
      >
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="flex items-center justify-center mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaHeartbeat className="text-accent-600 dark:text-accent-400 text-5xl mr-3" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-700 dark:text-primary-400 font-display tracking-tight">
              Care <span className="text-accent-600 dark:text-accent-400">India</span>
            </h1>
          </motion.div>
          <motion.h2
            className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-2"
            variants={itemVariants}
          >
            Medical Inventory Management
          </motion.h2>
          <motion.p
            className="text-gray-600 dark:text-gray-300 max-w-sm mx-auto text-sm md:text-base"
            variants={itemVariants}
          >
            Efficiently manage your medical inventory with our comprehensive solution
          </motion.p>
        </motion.div>

        <motion.div
          className="mb-8 relative"
          whileHover={{ scale: 1.05 }}
          variants={itemVariants}
        >
          <div className="w-40 h-40 mx-auto bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-accent-500/20 dark:bg-accent-400/20 rounded-full"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-full bg-accent-500/20 dark:bg-accent-400/20 rounded-full"></div>
            </div>
            <FaBoxOpen className="text-6xl text-primary-600 dark:text-primary-400 relative z-10" />
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-4 w-full max-w-xs"
          variants={itemVariants}
        >
          {[
            { icon: <FaMedkit />, label: "Inventory" },
            { icon: <FaHospital />, label: "Pharmacy" },
            { icon: <FaHeartbeat />, label: "Healthcare" }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300"
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
            >
              <div className="text-primary-500 dark:text-primary-400 text-xl mb-2">
                {item.icon}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-300 text-center">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right side - Login form */}
      <motion.div
        className="w-full md:w-1/2 max-w-md mt-10 md:mt-0 relative z-10"
        variants={itemVariants}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="text-center mb-6"
            variants={itemVariants}
          >
            <motion.h2
              className="text-2xl font-bold text-gray-900 dark:text-white font-display"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Welcome Back
            </motion.h2>
            <motion.p
              className="mt-2 text-sm text-gray-600 dark:text-gray-300"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Sign in to your account to continue
            </motion.p>
          </motion.div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <motion.div
              className="space-y-4"
              variants={itemVariants}
            >
              <motion.div variants={itemVariants}>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <motion.input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="input pl-10 w-full rounded-lg border-gray-300 dark:border-gray-600 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <motion.input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="input pl-10 pr-10 w-full rounded-lg border-gray-300 dark:border-gray-600 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <motion.button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {error && (
              <motion.div
                className="text-accent-600 dark:text-accent-400 text-sm text-center bg-accent-50 dark:bg-accent-900/20 p-2 rounded-md"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={loading || loginSuccess}
                className={`btn w-full flex justify-center items-center py-2.5 rounded-lg transition-all duration-300 ${loginSuccess ? 'bg-green-600 hover:bg-green-700' : 'btn-primary'}`}
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center">
                    <FaSpinner className="animate-spin mr-2" /> Signing in...
                  </span>
                ) : loginSuccess ? (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Success!
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FaSignInAlt className="mr-2" /> Sign in
                  </span>
                )}
              </motion.button>
            </motion.div>

            <motion.div
              className="text-center text-sm text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              variants={itemVariants}
            >
              <p className="font-medium mb-1">Demo credentials:</p>
              <p>Username: <span className="text-primary-600 dark:text-primary-400">admin</span> | Password: <span className="text-primary-600 dark:text-primary-400">admin</span></p>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
