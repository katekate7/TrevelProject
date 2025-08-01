/**
 * @fileoverview ForgotPasswordPage component for password recovery
 * This component provides a form interface for users to request password reset emails
 * with glassmorphism design and comprehensive error handling.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

/**
 * ForgotPasswordPage Component
 * 
 * Password recovery interface that allows users to request password reset emails.
 * Features glassmorphism design, form validation, loading states, and user feedback.
 * 
 * @component
 * @returns {JSX.Element} The rendered forgot password page with form interface
 * 
 * @example
 * // Used for password recovery flow
 * <Route path="/forgot-password" element={<ForgotPasswordPage />} />
 */
const ForgotPasswordPage = () => {
  /* ───────── State Management ───────── */
  /** @type {[string, Function]} Email address entered by user */
  const [email, setEmail] = useState('');
  
  /** @type {[string, Function]} Success message to display */
  const [message, setMessage] = useState('');
  
  /** @type {[string, Function]} Error message to display */
  const [error, setError] = useState('');
  
  /** @type {[boolean, Function]} Loading state during form submission */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles form submission for password reset request
   * Sends reset email to the provided address and manages UI feedback
   * 
   * @async
   * @function
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    // Set loading state and clear previous messages
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // Send password reset request to API
      const response = await api.post('/users/forgot-password', { email });
      
      // Show success message and clear form
      setMessage(response.data.message);
      setEmail(''); // Clear the form on success
    } catch (err) {
      // Handle and display errors
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      // Always stop loading indicator
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Glassmorphism card container */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-white/20">
          {/* Header section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Forgot Password</h2>
            <p className="text-gray-300 mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Password reset form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email input field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                          text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                          focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            {/* Success message display */}
            {message && (
              <div className="bg-green-500/20 border border-green-500/30 text-green-200 px-4 py-3 rounded-lg">
                {message}
              </div>
            )}

            {/* Error message display */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit button with loading state */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 
                        text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 
                        hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                        focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 
                        disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {/* Navigation link back to login */}
          <div className="mt-6 text-center">
            <Link 
              to="/start" 
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
