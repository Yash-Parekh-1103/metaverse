import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';

const CreateBlog = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/posts', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/allblog');
    } catch (err) {
      console.error('Error creating post', err);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pt-10">
      <div className="bg-white">
        <header className="flex items-center border-b border-slate-200 pb-4">
          <Link
            to="/allblog"
            className="mr-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="flex-grow text-center text-xl font-semibold tracking-tight text-slate-900">Create New Post</h1>
          <button form="create-blog-form" type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
            Share
          </button>
        </header>

        <form id="create-blog-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Blog Title</label>
            <input 
              {...register('title', { required: 'Title is required' })} 
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-lg text-slate-900 focus:border-slate-400 focus:outline-none"
              placeholder="What's on your mind?"
            />
            {errors.title && <p className="text-red-500 text-[10px]">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Category</label>
            <input 
              {...register('category')} 
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              placeholder="e.g. Technology, Adventure"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Image URL</label>
            <input
              {...register('imageUrl')}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Content</label>
            <textarea 
              {...register('content', { required: 'Content is required' })} 
              className="min-h-[220px] w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
              placeholder="Start writing..."
            />
            {errors.content && <p className="text-red-500 text-[10px]">{errors.content.message}</p>}
          </div>
        </form>
      </div>
      
      <p className="mt-6 text-center text-xs text-slate-400">
        Your post will be visible to everyone on Metaverse.
      </p>
    </div>
  );
};

export default CreateBlog;
