import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/allblog');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[350px] space-y-3">
        {/* Main Card */}
        <div className="bg-white border border-gray-300 p-10 flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-10 font-serif italic tracking-tight">Metaverse</h1>
          
          <h2 className="text-gray-800 font-bold text-lg mb-6">Welcome to metaverse</h2>

          {error && (
            <div className="bg-red-50 text-red-500 text-xs p-2 rounded w-full mb-4 text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-2">
            <input
              type="email"
              placeholder="Phone number, username, or email"
              className="w-full bg-gray-50 border border-gray-300 rounded-sm py-2 px-2 text-xs focus:outline-none focus:border-gray-400"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-gray-50 border border-gray-300 rounded-sm py-2 px-2 text-xs focus:outline-none focus:border-gray-400"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold py-1.5 rounded-lg text-sm transition-colors mt-2 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <div className="flex items-center w-full my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-gray-400 text-xs font-semibold uppercase">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button className="flex items-center text-[#385185] font-semibold text-sm">
            <span className="mr-2">Log in with Facebook</span>
          </button>
          
          <Link to="#" className="text-[#00376b] text-xs mt-4">Forgot password?</Link>
        </div>

        {/* Bottom Card */}
        <div className="bg-white border border-gray-300 p-6 text-center">
          <p className="text-sm text-gray-800">
            Don't have an account? <Link to="/signup" className="text-[#0095f6] font-semibold">Sign up</Link>
          </p>
        </div>

        {/* Get the app section */}
        <div className="text-center space-y-4 pt-2">
          <p className="text-sm">Get the app.</p>
          <div className="flex justify-center space-x-2 h-10">
            <img src="https://static.cdninstagram.com/rsrc.php/v3/yt/r/Y23_PBdbmoP.png" alt="Google Play" className="h-full cursor-pointer" />
            <img src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7YmSByL.png" alt="Microsoft Store" className="h-full cursor-pointer" />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-12 w-full max-w-4xl px-4">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[12px] text-gray-500 mb-4">
          <span>Meta</span><span>About</span><span>Blog</span><span>Jobs</span><span>Help</span><span>API</span><span>Privacy</span><span>Terms</span><span>Locations</span><span>Meta Verified</span>
        </div>
        <div className="text-center text-[12px] text-gray-500">
          © 2026 Metaverse from Meta
        </div>
      </footer>
    </div>
  );
};

export default Login;
