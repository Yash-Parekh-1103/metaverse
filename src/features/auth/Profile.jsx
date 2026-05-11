import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, LayoutGrid, Bookmark, Heart, ChevronLeft, PencilLine, Trash2, UserRound, Mail, FileText } from 'lucide-react';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const [isPostEditing, setIsPostEditing] = useState(false);
  const [editingPostId, setEditingPostId] = useState('');
  const [postForm, setPostForm] = useState({ title: '', category: '', content: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(res.data.user);
        setPosts(res.data.posts);
        setSavedPosts(res.data.savedPosts || []);
        setLikedPosts(res.data.likedPosts || []);
        setFormData({ name: res.data.user.name, email: res.data.user.email });
      } catch (err) {
        console.error('Error fetching profile', err);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:3000/api/users/me', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  const startEditPost = (post, event) => {
    event.stopPropagation();
    setEditingPostId(post._id);
    setPostForm({
      title: post.title,
      category: post.category || '',
      content: post.content
    });
    setIsPostEditing(true);
    setMessage('');
  };

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:3000/api/posts/${editingPostId}`, postForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === editingPostId ? res.data : post))
      );
      setIsPostEditing(false);
      setEditingPostId('');
      setPostForm({ title: '', category: '', content: '' });
      setMessage('Post updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Post update failed');
    }
  };

  const handlePostDelete = async (postId, event) => {
    event.stopPropagation();
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      setSavedPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      setLikedPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      if (editingPostId === postId) {
        setIsPostEditing(false);
        setEditingPostId('');
        setPostForm({ title: '', category: '', content: '' });
      }
      setMessage('Post deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Post delete failed');
    }
  };

  if (!userData) return <div className="flex justify-center pt-20"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-900"></div></div>;

  const visiblePosts = activeTab === 'posts' ? posts : activeTab === 'saved' ? savedPosts : likedPosts;
  const handle = userData.email.split('@')[0];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-8">
        <div className="mb-7 flex items-center gap-3">
          <Link
            to="/allblog"
            className="inline-flex h-10 w-10 items-center justify-center text-slate-500 transition hover:text-slate-900"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 md:text-2xl">Profile</h1>
        </div>

        <section className="bg-white p-2 md:p-4">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-4xl font-semibold text-slate-600 md:h-36 md:w-36 md:text-5xl">
                {userData.name[0].toUpperCase()}
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">{userData.name}</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">@{handle}</p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {userData.email}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                <PencilLine className="h-4 w-4" />
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center text-slate-500 transition hover:text-slate-900"
              >
                <Settings className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-8 border-t border-slate-200 pt-5 text-sm">
            <p className="text-slate-600"><span className="font-semibold text-slate-900">{posts.length}</span> posts</p>
            <p className="text-slate-600"><span className="font-semibold text-slate-900">{savedPosts.length}</span> saved</p>
            <p className="text-slate-600"><span className="font-semibold text-slate-900">{likedPosts.length}</span> liked</p>
          </div>
        </section>

        {isEditing && (
          <div className="mt-6 border-t border-slate-200 bg-white p-6">
            <form onSubmit={handleUpdate} className="grid gap-4 md:max-w-xl">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Display Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none"
                  required
                />
              </div>
              <button type="submit" className="mt-1 inline-flex w-fit items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                Save Changes
              </button>
            </form>
          </div>
        )}

        <div className="mt-8 border-b border-slate-200">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('posts')}
              className={`inline-flex items-center justify-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition ${
                activeTab === 'posts'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Posts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`inline-flex items-center justify-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition ${
                activeTab === 'saved'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Bookmark className="h-4 w-4" />
              Saved
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('liked')}
              className={`inline-flex items-center justify-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition ${
                activeTab === 'liked'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Heart className="h-4 w-4" />
              Liked
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500">
              No posts yet.
            </div>
          ) : (
            visiblePosts.map((post) => (
              <div
                key={post._id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5"
                onClick={() => navigate(`/posts/${post._id}`)}
              >
                <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300">
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                  {activeTab === 'posts' && (
                    <div className="absolute right-3 top-3 z-10 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/60 bg-white/90 text-slate-700 shadow-sm transition hover:bg-white"
                        onClick={(event) => startEditPost(post, event)}
                      >
                        <PencilLine className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/60 bg-white/90 text-rose-600 shadow-sm transition hover:bg-white"
                        onClick={(event) => handlePostDelete(post._id, event)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90">{post.category || 'Blog'}</p>
                    <h4 className="line-clamp-2 text-lg font-semibold leading-snug">{post.title}</h4>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <UserRound className="h-3.5 w-3.5" />
                    {post.author?.name || userData.name}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    {(post.comments?.length || 0)} comments
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {message && <p className="mt-4 text-sm font-semibold text-emerald-600">{message}</p>}

        {isPostEditing && activeTab === 'posts' && (
          <div className="mt-8 border-t border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Edit Post</h3>
            <form onSubmit={handlePostUpdate} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Title</label>
                <input
                  type="text"
                  value={postForm.title}
                  onChange={(event) => setPostForm({ ...postForm, title: event.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Category</label>
                <input
                  type="text"
                  value={postForm.category}
                  onChange={(event) => setPostForm({ ...postForm, category: event.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Content</label>
                <textarea
                  value={postForm.content}
                  onChange={(event) => setPostForm({ ...postForm, content: event.target.value })}
                  className="min-h-[180px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Update Post
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  onClick={() => {
                    setIsPostEditing(false);
                    setEditingPostId('');
                    setPostForm({ title: '', category: '', content: '' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
