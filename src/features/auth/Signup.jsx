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
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-6 py-10 md:grid-cols-2">
        <section className="rounded-3xl border border-slate-700 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 shadow-2xl md:p-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100">Metaverse</p>
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            Welcome to metaverse
          </h1>
          <p className="mt-4 max-w-md text-sm text-cyan-100 md:text-base">
            Create your account and start sharing your ideas with the community.
          </p>
        </section>

        <div className="rounded-3xl border border-slate-700 bg-slate-800 p-8 shadow-2xl md:p-10">
          <h2 className="text-2xl font-semibold">Sign up</h2>
          <p className="mt-2 text-sm text-slate-300">Use your details to create a new account.</p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
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

          <p className="mt-6 text-sm text-slate-300">
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
