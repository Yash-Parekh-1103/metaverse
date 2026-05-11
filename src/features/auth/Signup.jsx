import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

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

  const username = formData.name.trim() || '$username';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-6 py-10 md:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/90 via-teal-500/90 to-cyan-500/90 p-8 shadow-[0_24px_60px_-40px_rgba(16,185,129,0.8)] backdrop-blur md:p-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100">Metaverse</p>
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            Welcome to metaverse
          </h1>
          <p className="mt-4 max-w-md text-sm text-cyan-100 md:text-base">
            Create your account and start sharing your ideas with the community.
          </p>
        </section>

        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.9)] backdrop-blur md:p-10">
          <h2 className="text-2xl font-semibold">Sign up</h2>
          <p className="mt-2 text-sm text-slate-400">Use your details to create a new account.</p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border-b border-slate-700 bg-transparent px-1 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border-b border-slate-700 bg-transparent px-1 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border-b border-slate-700 bg-transparent px-1 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-300 hover:text-emerald-200">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
