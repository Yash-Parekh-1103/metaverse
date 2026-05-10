import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/api/auth/signup', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/allblog');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[350px] space-y-3">
        {/* Main Card */}
        <div className="bg-white border border-gray-300 p-10 flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-8 font-serif italic tracking-tight">Metaverse</h1>
          
          <p className="text-gray-500 font-semibold text-center mb-6 leading-tight">
            Sign up to see photos and videos from your friends.
          </p>

          {error && (
            <div className="bg-red-50 text-red-500 text-xs p-2 rounded w-full mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-2">
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-gray-50 border border-gray-300 rounded-sm py-2 px-2 text-xs focus:outline-none focus:border-gray-400"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-gray-50 border border-gray-300 rounded-sm py-2 px-2 text-xs focus:outline-none focus:border-gray-400"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-gray-50 border border-gray-300 rounded-sm py-2 px-2 text-xs focus:outline-none focus:border-gray-400"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <p className="text-[10px] text-gray-500 text-center py-2">
              People who use our service may have uploaded your contact information to Metaverse. <span className="text-blue-900 font-semibold cursor-pointer">Learn More</span>
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold py-1.5 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>
        </div>

        {/* Bottom Card */}
        <div className="bg-white border border-gray-300 p-6 text-center">
          <p className="text-sm">
            Have an account? <Link to="/login" className="text-[#0095f6] font-semibold">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
