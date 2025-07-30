/**
 * @fileoverview ResetPasswordPage component for password reset functionality
 * This component provides a secure password reset interface using token-based validation
 * with comprehensive form validation and user feedback.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

/**
 * ResetPasswordPage Component
 * 
 * Secure password reset interface that validates reset tokens and allows users
 * to set new passwords. Features comprehensive client-side validation,
 * password strength requirements, and user feedback with auto-redirect.
 * 
 * @component
 * @returns {JSX.Element} The rendered password reset page with form validation
 * 
 * @example
 * // Used in password reset flow with token parameter
 * <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
 */
const ResetPasswordPage = () => {
  /** Reset token extracted from URL parameters for API validation */
  const { token } = useParams();
  
  /** React Router navigation hook for programmatic navigation */
  const navigate = useNavigate();
  
  /** @type {[string, Function]} New password input value */
  const [password, setPassword] = useState('');
  
  /** @type {[string, Function]} Password confirmation input value */
  const [confirmPassword, setConfirmPassword] = useState('');
  
  /** @type {[boolean, Function]} Loading state during password reset submission */
  const [loading, setLoading] = useState(false);
  
  /** @type {[string, Function]} Success message to display to user */
  const [message, setMessage] = useState('');
  
  /** @type {[string, Function]} Error message to display to user */
  const [error, setError] = useState('');

  /**
   * Handles form submission for password reset
   * Performs comprehensive client-side validation before API submission
   * Server-side validation will ensure password security requirements
   * 
   * @async
   * @function
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    // Validation 1: Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validation 2: Check minimum password length (basic check, server will do comprehensive validation)
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Start loading state and clear previous messages
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Submit password reset request to API with token validation
      // Server will perform comprehensive password strength validation
      const response = await api.post(`/users/reset-password-token/${token}`, {
        password: password
      });
      // Success: Show confirmation message and auto-redirect
      setMessage('Password has been successfully changed! Redirecting to the login page...');
      // Auto-redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/start');
      }, 3000);
      
    } catch (err) {
      // Handle API errors with specific error messages from server
      if (err.response?.data?.error) {
        setError(err.response.data.error); // Server-provided detailed error message
      } else {
        setError('An error occurred. Please try again.'); // Generic fallback
      }
    } finally {
      // Always stop loading indicator
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Centered form card with shadow */}
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        
        {/* Header section */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Resetting the password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter a new password for your account
          </p>
        </div>
        
        {/* Password reset form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* New password input field */}
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              
              {/* Password requirements info */}
              <div className="mt-2 text-xs text-gray-600 bg-gray-50 rounded-md p-3">
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
            
            {/* Password confirmation input field */}
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm your password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Error message display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="whitespace-pre-line">{error}</p>
            </div>
          )}

          {/* Success message display */}
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}

          {/* Submit button with loading state */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Change Password'}
            </button>
          </div>

          {/* Navigation link back to login */}
          <div className="text-center mt-4">
            <Link 
              to="/start" 
              className="text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
