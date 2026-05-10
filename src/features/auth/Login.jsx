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

  const username = formData.email.trim() ? formData.email.split('@')[0] : '$username';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-6 py-10 md:grid-cols-2">
        <section className="rounded-3xl border border-slate-700 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-8 shadow-2xl md:p-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100">Metaverse</p>
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            Welcome back!
          </h1>
          <p className="mt-4 max-w-md text-sm text-indigo-100 md:text-base">
            Sign in to continue reading, writing, and managing your blogs.
          </p>
        </section>

        <div className="rounded-3xl border border-slate-700 bg-slate-800 p-8 shadow-2xl md:p-10">
          <h2 className="text-2xl font-semibold">Login</h2>
          <p className="mt-2 text-sm text-slate-300">Use your email and password to access your account.</p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-300">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-semibold text-indigo-300 hover:text-indigo-200">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
