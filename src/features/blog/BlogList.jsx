import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Home, PenSquare, User, LogOut, Heart, MessageCircle, Bookmark } from 'lucide-react';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [savedPostIds, setSavedPostIds] = useState([]);
  const [likedPostIds, setLikedPostIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostsAndSaved = async () => {
      try {
        const token = localStorage.getItem('token');
        const [postsRes, savedRes, likedRes] = await Promise.all([
          axios.get('http://localhost:3000/api/posts'),
          axios.get('http://localhost:3000/api/users/me/saved-posts', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:3000/api/users/me/liked-posts', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setPosts(postsRes.data);
        setSavedPostIds(savedRes.data.map((post) => post._id));
        setLikedPostIds(likedRes.data.map((post) => post._id));
      } catch (err) {
        console.error('Error fetching posts', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsAndSaved();
  }, []);

  const toggleLikePost = async (postId, event) => {
    event.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:3000/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLikedPostIds((prevIds) => {
        if (res.data.liked) {
          return prevIds.includes(postId) ? prevIds : [...prevIds, postId];
        }
        return prevIds.filter((id) => id !== postId);
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id !== postId) return post;
          const nextLikedBy = res.data.liked
            ? [...(post.likedBy || []), 'current-user']
            : (post.likedBy || []).slice(0, Math.max(res.data.likesCount, 0));
          return { ...post, likedBy: nextLikedBy };
        })
      );
    } catch (err) {
      console.error('Error liking post', err);
    }
  };

  const toggleSavePost = async (postId, event) => {
    event.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:3000/api/posts/${postId}/save`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSavedPostIds((prevIds) => {
        if (res.data.saved) {
          return prevIds.includes(postId) ? prevIds : [...prevIds, postId];
        }
        return prevIds.filter((id) => id !== postId);
      });
    } catch (err) {
      console.error('Error saving post', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 mb-8 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-[68px] w-full max-w-5xl items-center justify-between px-4">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Metaverse</h1>
          <div className="flex items-center gap-2 text-slate-700">
            <Link
              to="/allblog"
              title="Home"
              className="inline-flex h-10 w-10 items-center justify-center text-slate-500 transition hover:text-slate-900"
            >
              <Home className="h-4.5 w-4.5" />
            </Link>
            <Link
              to="/create-blog"
              title="Create Post"
              className="inline-flex h-10 w-10 items-center justify-center text-slate-500 transition hover:text-slate-900"
            >
              <PenSquare className="h-4.5 w-4.5" />
            </Link>
            <Link
              to="/profile"
              title="Profile"
              className="inline-flex h-10 w-10 items-center justify-center text-slate-500 transition hover:text-slate-900"
            >
              <User className="h-4.5 w-4.5" />
            </Link>
            <button
              onClick={logout}
              title="Logout"
              className="inline-flex h-10 w-10 items-center justify-center text-slate-500 transition hover:text-slate-900"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-4">
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : posts.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-gray-500">No blogs available yet. Be the first to post!</p>
           <Link to="/create-blog" className="mt-4 inline-block text-sm font-semibold text-slate-700 hover:text-slate-900">Create a Post</Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map(post => {
            const hasImage = Boolean(post.imageUrl);
            return (
              <article
                key={post._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 cursor-pointer"
                onClick={() => navigate(`/posts/${post._id}`)}
              >
                <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300">
                  {hasImage && (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className={`absolute inset-0 ${hasImage ? 'bg-slate-900/35' : 'bg-slate-900/10'}`} />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <p className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] ${hasImage ? 'text-slate-100' : 'text-slate-600'}`}>
                      {post.category || 'Blog'}
                    </p>
                    <h2 className={`line-clamp-2 text-2xl font-semibold leading-tight ${hasImage ? 'text-white' : 'text-slate-900'}`}>
                      {post.title}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <button
                      type="button"
                      onClick={(event) => toggleLikePost(post._id, event)}
                      className="inline-flex h-9 w-9 items-center justify-center text-slate-500 transition hover:text-rose-500"
                    >
                      <Heart
                        className={`h-4.5 w-4.5 transition-colors ${
                          likedPostIds.includes(post._id) ? 'fill-current text-rose-500' : ''
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => { event.stopPropagation(); navigate(`/posts/${post._id}#comments`); }}
                      className="inline-flex h-9 w-9 items-center justify-center text-slate-500 transition hover:text-slate-900"
                    >
                      <MessageCircle className="h-4.5 w-4.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => toggleSavePost(post._id, event)}
                      className="inline-flex h-9 w-9 items-center justify-center text-slate-500 transition hover:text-slate-900"
                    >
                      <Bookmark
                        className={`h-4.5 w-4.5 transition-colors ${savedPostIds.includes(post._id) ? 'fill-current text-slate-900' : ''}`}
                      />
                    </button>
                  </div>
                  <div className="text-xs font-medium text-slate-500">
                    {(post.likedBy?.length || 0)} likes · {(post.comments?.length || 0)} comments
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
};

export default BlogList;
