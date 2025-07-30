/**
 * @fileoverview RegisterForm Component for Travel Planner Application
 * 
 * This component provides user registration functionality with automatic login
 * after successful registration. It includes form validation, error handling,
 * and integration with the Travel Planner API for user account creation.
 * 
 * Features:
 * - User registration with username, email, and password
 * - Automatic login after successful registration
 * - Form validation and error handling
 * - Responsive design with Travel Planner theme
 * - Toggle to switch between login and register forms
 * 
 * SEO Considerations:
 * - Uses semantic form elements for better accessibility
 * - Includes proper input types for email validation
 * - Provides meaningful error messages for users
 * - Supports keyboard navigation and focus management
 * 
 * @author Travel Planner Development Team
 * @version 1.0.0
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

/**
 * RegisterForm Component - User registration form with automatic login
 * 
 * Handles new user registration for the Travel Planner application. Upon successful
 * registration, automatically logs the user in and redirects to the dashboard.
 * Includes validation, error handling, and toggle functionality to switch to login form.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onNeedLogin - Callback function to switch to login form
 * @returns {JSX.Element} Registration form with username, email, password fields
 */
export default function RegisterForm({ onNeedLogin }) {
  // Form state management
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null); // Error/success message state
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission
  const navigate = useNavigate();

  /**
   * Handles form submission for user registration
   * 
   * Attempts to register a new user and automatically log them in.
   * On success, redirects to dashboard. On failure, displays error message.
   * 
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    setIsSubmitting(true); // Set loading state

    try {
      // Register new user account
      await api.post('/users/register', { username, email, password });
      // Automatically log in the newly registered user
      await api.post('/login', { email, password });

      // Redirect to dashboard on successful registration and login
      navigate('/dashboard');
    } catch (err) {
      // Display registration error message with detailed validation feedback
      const errorMessage = err.response?.data?.error || '❌ Registration error';
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Username input field */}
      <input
        type="text"
        placeholder="Username (3-50 characters)"
        required
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="
          w-full rounded-lg py-3 px-4
          bg-white bg-opacity-90 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-white
        "
        disabled={isSubmitting}
      />

      {/* Email input field with built-in validation */}
      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="
          w-full rounded-lg py-3 px-4
          bg-white bg-opacity-90 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-white
        "
        disabled={isSubmitting}
      />

      {/* Password input field with requirements info */}
      <div className="relative">
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="
            w-full rounded-lg py-3 px-4
            bg-white bg-opacity-90 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-white
          "
          disabled={isSubmitting}
        />
        {/* Password requirements info */}
        <div className="mt-2 text-xs text-gray-600 bg-white bg-opacity-75 rounded-lg p-3">
          <p className="font-semibold mb-1">Password requirements:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Minimum 8 characters</li>
            <li>1 uppercase letter (A-Z)</li>
            <li>1 lowercase letter (a-z)</li>
            <li>1 number (0-9)</li>
            <li>1 special character (e.g., !, @, #, $, %, .)</li>
          </ul>
        </div>
      </div>

      {/* Registration submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`
          w-full py-3 rounded-full
          bg-[#282A54] border-2 border-white text-white font-semibold
          transition hover:bg-opacity-90
          ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>

      {/* Error message display */}
      {message && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800 whitespace-pre-line">{message}</p>
        </div>
      )}

      {/* Switch to login form link */}
      <div className="mt-6 flex flex-col sm:flex-row sm:justify-between text-sm text-black">
        <span>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNeedLogin}
            disabled={isSubmitting}
            className="
              bg-transparent p-0 m-0
              font-semibold underline hover:text-[#d14b4c]
              focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Log in
          </button>
        </span>
      </div>
    </form>
  );
}
