import { useState } from 'react';
import { loginUser } from '../services/api';
import { User } from '../models/types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  switchToSignUp: () => void;
}

export const Login = ({ onLoginSuccess, switchToSignUp }: LoginProps) => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!nickname || !password) {
      setError('Nickname and password are required.');
      return;
    }
    try {
      const user = await loginUser(nickname, password);
      onLoginSuccess(user);
    } catch (err) {
        if (err instanceof Response && err.status === 401) {
            setError('Invalid nickname or password.');
        } else {
            setError('Failed to login. Please try again.');
        }
        console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nickname">
            Nickname
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your nickname"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="******************"
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleLogin}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="button"
          >
            Login
          </button>
        </div>
        <div className="text-center">
            <p className="text-sm">
                Don't have an account?{' '}
                <button onClick={switchToSignUp} className="font-bold text-blue-500 hover:text-blue-800">
                    Sign Up
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};
