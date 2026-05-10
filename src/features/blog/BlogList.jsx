import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlusSquare, User, LogOut, Heart, MessageCircle, Send, Bookmark } from 'lucide-react';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/posts');
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching posts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="max-w-[600px] mx-auto pb-20">
      {/* Navigation Header */}
      <header className="sticky top-0 bg-white border-b border-gray-300 z-50 h-[60px] flex items-center px-4 mb-6">
        <div className="flex justify-between w-full items-center">
          <h1 className="text-2xl font-serif italic font-bold tracking-tight">Metaverse</h1>
          <div className="flex items-center space-x-5">
            <Link to="/allblog" title="Home"><PlusSquare className="w-6 h-6 rotate-45" /></Link>
            <Link to="/create-blog" title="Create Post"><PlusSquare className="w-6 h-6" /></Link>
            <Link to="/profile" title="Profile"><User className="w-6 h-6" /></Link>
            <button onClick={logout} title="Logout"><LogOut className="w-6 h-6" /></button>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white border border-gray-300 p-10 text-center rounded-sm">
          <p className="text-gray-500">No blogs available yet. Be the first to post!</p>
          <Link to="/create-blog" className="text-blue-500 font-semibold mt-4 inline-block text-sm">Create a Post</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <article key={post._id} className="bg-white border border-gray-300 rounded-sm">
              {/* Post Header */}
              <div className="flex items-center p-3">
                <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                  {post.author?.name?.[0].toUpperCase() || 'U'}
                </div>
                <span className="font-semibold text-sm">{post.author?.name || 'Unknown User'}</span>
                <span className="mx-1 text-gray-400">•</span>
                <span className="text-gray-500 text-xs">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Post Image Placeholder */}
              <div className="bg-gray-100 aspect-square flex items-center justify-center border-y border-gray-50">
                <div className="text-center p-8">
                  <h2 className="text-xl font-bold mb-2 uppercase tracking-widest text-gray-400">{post.category || 'BLOG'}</h2>
                  <p className="text-4xl font-serif italic text-gray-800">{post.title}</p>
                </div>
              </div>

              {/* Post Actions */}
              <div className="p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Heart className="w-6 h-6 hover:text-red-500 cursor-pointer transition-colors" />
                    <MessageCircle className="w-6 h-6 cursor-pointer" />
                    <Send className="w-6 h-6 cursor-pointer" />
                  </div>
                  <Bookmark className="w-6 h-6 cursor-pointer" />
                </div>

                {/* Post Content */}
                <div className="text-sm">
                  <span className="font-semibold mr-2">{post.author?.name || 'user'}</span>
                  {post.content}
                </div>
                
                <div className="text-[10px] text-gray-400 uppercase tracking-tighter">
                  {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
