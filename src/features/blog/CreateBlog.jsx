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
    <div className="max-w-[500px] mx-auto min-h-screen flex flex-col pt-10 px-4">
      <div className="bg-white border border-gray-300 rounded-sm overflow-hidden">
        <header className="flex items-center p-4 border-b border-gray-200">
          <Link to="/allblog" className="mr-4">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-bold text-center flex-grow">Create New Post</h1>
          <button form="create-blog-form" type="submit" className="text-blue-500 font-semibold text-sm">
            Share
          </button>
        </header>

        <form id="create-blog-form" onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Blog Title</label>
            <input 
              {...register('title', { required: 'Title is required' })} 
              className="w-full text-lg font-serif border-b border-gray-100 py-2 focus:outline-none focus:border-blue-400"
              placeholder="What's on your mind?"
            />
            {errors.title && <p className="text-red-500 text-[10px]">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
            <input 
              {...register('category')} 
              className="w-full text-sm py-2 border-b border-gray-100 focus:outline-none focus:border-blue-400"
              placeholder="e.g. Technology, Adventure"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Content</label>
            <textarea 
              {...register('content', { required: 'Content is required' })} 
              className="w-full text-sm py-2 border-b border-gray-100 focus:outline-none focus:border-blue-400 min-h-[200px] resize-none"
              placeholder="Start writing..."
            />
            {errors.content && <p className="text-red-500 text-[10px]">{errors.content.message}</p>}
          </div>
        </form>
      </div>
      
      <p className="text-center text-xs text-gray-400 mt-6">
        Your post will be visible to everyone on Metaverse.
      </p>
    </div>
  );
};

export default CreateBlog;
