import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, CalendarDays, User } from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load this post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

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
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-gray-500">{post.category || 'BLOG'}</p>
            <h1 className="text-3xl font-bold text-gray-900 md:text-5xl">{post.title}</h1>
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
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
