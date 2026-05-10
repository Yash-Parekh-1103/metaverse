import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Settings, Grid, Bookmark, Tag, ChevronLeft } from 'lucide-react';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(res.data.user);
        setPosts(res.data.posts);
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
      setMessage('Update failed');
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
          {message && <p className="mt-4 text-sm text-green-600 font-semibold">{message}</p>}
        </div>
      )}

      {/* Tabs */}
      <div className="border-t border-gray-300 flex justify-center space-x-12">
        <div className="border-t border-black -mt-[1px] pt-4 flex items-center space-x-2 text-xs font-bold tracking-widest uppercase cursor-pointer">
          <Grid className="w-3 h-3" />
          <span>Posts</span>
        </div>
        <div className="pt-4 flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-gray-400 cursor-pointer">
          <Bookmark className="w-3 h-3" />
          <span>Saved</span>
        </div>
        <div className="pt-4 flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-gray-400 cursor-pointer">
          <Tag className="w-3 h-3" />
          <span>Tagged</span>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-8 mt-8">
        {posts.length === 0 ? (
          <div className="col-span-3 text-center py-20 text-gray-500 italic">No posts yet.</div>
        ) : (
          posts.map(post => (
            <div key={post._id} className="relative aspect-square bg-gray-100 border border-gray-200 group cursor-pointer overflow-hidden">
               <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center transition-transform duration-500 group-hover:scale-110">
                  <h4 className="text-[10px] md:text-xs font-bold uppercase text-gray-400 mb-1">{post.category || 'BLOG'}</h4>
                  <p className="text-xs md:text-lg font-serif italic text-gray-800 line-clamp-2 px-2">{post.title}</p>
               </div>
               <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
