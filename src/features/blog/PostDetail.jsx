import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, CalendarDays, User, Heart, MessageCircle } from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        const [postRes, likedRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/posts/${id}`),
          axios.get('http://localhost:3000/api/users/me/liked-posts', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setPost(postRes.data);
        setLikesCount(postRes.data.likedBy?.length || 0);
        setLiked(likedRes.data.some((likedPost) => likedPost._id === postRes.data._id));
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load this post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:3000/api/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update like');
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:3000/api/posts/${id}/comments`,
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPost((prevPost) => ({ ...prevPost, comments: [...(prevPost.comments || []), res.data] }));
      setComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add comment');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link to="/allblog" className="mb-6 inline-flex items-center text-sm font-semibold text-gray-700">
          <ChevronLeft className="mr-1 h-5 w-5" />
          Back to all blogs
        </Link>
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
          {error || 'Post not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/allblog" className="mb-6 inline-flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900">
        <ChevronLeft className="mr-1 h-5 w-5" />
        Back to all blogs
      </Link>

      <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="relative flex h-72 items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8 text-center md:h-96">
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div className={`absolute inset-0 ${post.imageUrl ? 'bg-slate-900/40' : 'bg-transparent'}`} />
          <div className="relative z-10">
            <p className={`mb-3 text-xs font-bold uppercase tracking-[0.3em] ${post.imageUrl ? 'text-slate-100' : 'text-gray-500'}`}>{post.category || 'BLOG'}</p>
            <h1 className={`text-3xl font-bold md:text-5xl ${post.imageUrl ? 'text-white' : 'text-gray-900'}`}>{post.title}</h1>
          </div>
        </div>

        <div className="space-y-6 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 pb-4 text-sm text-gray-600">
            <span className="inline-flex items-center">
              <User className="mr-1 h-4 w-4" />
              {post.author?.name || 'Unknown author'}
            </span>
            {post.author?.email && <span>{post.author.email}</span>}
            <span className="inline-flex items-center">
              <CalendarDays className="mr-1 h-4 w-4" />
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="whitespace-pre-line leading-8 text-gray-800">{post.content}</p>

          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="mb-4 flex items-center gap-5">
              <button type="button" onClick={handleLike} className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                <Heart className={`h-5 w-5 ${liked ? 'fill-current text-rose-500' : 'text-gray-600'}`} />
                {likesCount}
              </button>
              <a href="#comments" className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                <MessageCircle className="h-5 w-5 text-gray-600" />
                {post.comments?.length || 0}
              </a>
            </div>

            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 border-t border-gray-200 pt-4">
              <input
                type="text"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Add a comment..."
                className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Post
              </button>
            </form>
          </div>

          <div id="comments" className="space-y-3 border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Comments</h3>
            {(post.comments || []).length === 0 ? (
              <p className="text-sm text-gray-500">No comments yet.</p>
            ) : (
              post.comments.map((item) => (
                <div key={item._id} className="rounded-md border border-gray-100 bg-white p-3">
                  <p className="text-sm text-gray-800">
                    <span className="mr-2 font-semibold">{item.user?.name || 'User'}</span>
                    {item.content}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
