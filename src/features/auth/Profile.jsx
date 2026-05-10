import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Grid, Bookmark, Heart, ChevronLeft, Pencil, Trash2 } from 'lucide-react';

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

  if (!userData) return <div className="flex justify-center pt-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>;

  return (
    <div className="max-w-[935px] mx-auto px-4 pb-20 pt-10">
      {/* Header / Nav */}
      <div className="flex items-center mb-8">
        <Link to="/allblog" className="mr-4 lg:hidden">
          <ChevronLeft className="w-8 h-8" />
        </Link>
        <h1 className="text-xl font-bold lg:hidden flex-grow text-center">{userData.name}</h1>
      </div>

      {/* Profile Info Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-20 mb-12">
        <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold text-gray-400 mb-6 md:mb-0 border border-gray-100">
          {userData.name[0].toUpperCase()}
        </div>

        <div className="flex-grow space-y-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <h2 className="text-2xl font-light">{userData.email.split('@')[0]}</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="bg-gray-50 border border-gray-300 rounded px-3 py-1.5 text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
              <Settings className="w-6 h-6 cursor-pointer" />
            </div>
          </div>

          <div className="flex justify-center md:justify-start space-x-8 text-sm">
            <span><strong>{posts.length}</strong> posts</span>
            <span><strong>{savedPosts.length}</strong> saved</span>
            <span><strong>{likedPosts.length}</strong> liked</span>
            <span><strong>0</strong> followers</span>
            <span><strong>0</strong> following</span>
          </div>

          <div className="text-sm">
            <h3 className="font-semibold">{userData.name}</h3>
            <p className="text-gray-500">{userData.email}</p>
          </div>
        </div>
      </div>

      {/* Edit Form (Conditional) */}
      {isEditing && (
        <div className="bg-white border border-gray-300 p-6 rounded-sm mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Display Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-b border-gray-200 py-2 focus:outline-none focus:border-blue-500 text-sm"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border-b border-gray-200 py-2 focus:outline-none focus:border-blue-500 text-sm"
                required
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-600">Save Changes</button>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="border-t border-gray-300 flex justify-center space-x-12">
        <button
          type="button"
          onClick={() => setActiveTab('posts')}
          className={`-mt-[1px] pt-4 flex items-center space-x-2 text-xs font-bold tracking-widest uppercase cursor-pointer ${
            activeTab === 'posts' ? 'border-t border-black text-black' : 'text-gray-400'
          }`}
        >
          <Grid className="w-3 h-3" />
          <span>Posts</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('saved')}
          className={`pt-4 flex items-center space-x-2 text-xs font-bold tracking-widest uppercase cursor-pointer ${
            activeTab === 'saved' ? 'border-t border-black text-black -mt-[1px]' : 'text-gray-400'
          }`}
        >
          <Bookmark className="w-3 h-3" />
          <span>Saved</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('liked')}
          className={`pt-4 flex items-center space-x-2 text-xs font-bold tracking-widest uppercase cursor-pointer ${
            activeTab === 'liked' ? 'border-t border-black text-black -mt-[1px]' : 'text-gray-400'
          }`}
        >
          <Heart className="w-3 h-3" />
          <span>Liked Blogs</span>
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-8 mt-8">
        {(activeTab === 'posts' ? posts : activeTab === 'saved' ? savedPosts : likedPosts).length === 0 ? (
          <div className="col-span-3 text-center py-20 text-gray-500 italic">No posts yet.</div>
        ) : (
          (activeTab === 'posts' ? posts : activeTab === 'saved' ? savedPosts : likedPosts).map((post) => (
            <div
              key={post._id}
              className="relative aspect-square bg-gray-100 border border-gray-200 group cursor-pointer overflow-hidden"
              onClick={() => navigate(`/posts/${post._id}`)}
            >
               <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center transition-transform duration-500 group-hover:scale-110">
                  <h4 className="text-[10px] md:text-xs font-bold uppercase text-gray-400 mb-1">{post.category || 'BLOG'}</h4>
                  <p className="text-xs md:text-lg font-serif italic text-gray-800 line-clamp-2 px-2">{post.title}</p>
               </div>
               {activeTab === 'posts' && (
                 <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      className="rounded bg-white/90 p-1.5 text-gray-700 shadow hover:bg-white"
                      onClick={(event) => startEditPost(post, event)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded bg-white/90 p-1.5 text-red-600 shadow hover:bg-white"
                      onClick={(event) => handlePostDelete(post._id, event)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                 </div>
               )}
               <div className="pointer-events-none absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))
        )}
      </div>

      {message && <p className="mt-6 text-sm font-semibold text-green-600">{message}</p>}

      {isPostEditing && activeTab === 'posts' && (
        <div className="mt-10 rounded-sm border border-gray-300 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold">Edit Post</h3>
          <form onSubmit={handlePostUpdate} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Title</label>
              <input
                type="text"
                value={postForm.title}
                onChange={(event) => setPostForm({ ...postForm, title: event.target.value })}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Category</label>
              <input
                type="text"
                value={postForm.category}
                onChange={(event) => setPostForm({ ...postForm, category: event.target.value })}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Content</label>
              <textarea
                value={postForm.content}
                onChange={(event) => setPostForm({ ...postForm, content: event.target.value })}
                className="min-h-[180px] w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Update Post
              </button>
              <button
                type="button"
                className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
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
  );
};

export default Profile;
