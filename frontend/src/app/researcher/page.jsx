'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const CATEGORIES = [
  'Engineering', 'Law', 'Finance', 'Innovation', 'IoT', 'Electrical',
  'Computer Science', 'Medicine', 'Agriculture', 'Education'
];

export default function ResearcherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showOther, setShowOther] = useState(false);

  const [formData, setFormData] = useState({
    submission_type: '',
    submission_type_other: '',
    university_name: '',
    cover_image: null,
    title: '',
    authors: '',
    year_published: '',
    short_description: '',
    file: null,
  });

  useEffect(() => {
    fetchUserAndUploads();
  }, []);

  const fetchUserAndUploads = async () => {
    try {
      const [userRes, uploadsRes] = await Promise.all([
        fetch('http://localhost:8000/api/me/', { credentials: 'include' }),
        fetch('http://localhost:8000/api/my-uploads/', { credentials: 'include' })
      ]);
      if (!userRes.ok) throw new Error();
      const userData = await userRes.json();
      const uploadsData = await uploadsRes.json();
      setUser(userData);
      setUploads(uploadsData);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'submission_type') {
      setShowOther(value === 'other');
    }
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v) data.append(k, v);
    });

    try {
      const res = await fetch('http://localhost:8000/api/upload/', {
        method: 'POST',
        credentials: 'include',
        body: data,
      });
      if (res.ok) {
        const newUpload = await res.json();
        setUploads(prev => [newUpload, ...prev]);
        e.target.reset();
        setFormData({ submission_type: '', submission_type_other: '', university_name: '', cover_image: null, title: '', authors: '', year_published: '', short_description: '', file: null });
        setShowOther(false);
        alert('Submitted!');
      } else {
        const err = await res.json();
        alert('Error: ' + JSON.stringify(err));
      }
    } catch {
      alert('Network error');
    } finally {
      setUploading(false);
    }
  };

  const openFile = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getStatusColor = (status) => {
    const map = {
      approved: 'border-green-600 bg-green-100',
      pending: 'border-orange-500 bg-yellow-100',
      rejected: 'border-red-600 bg-red-100',
      draft: 'border-gray-500 bg-gray-200',
    };
    return map[status] || 'border-gray-400 bg-gray-100';
  };

  if (loading) return <div className="min-h-screen bg-[#d8e5c7] flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#d8e5c7] p-5">
      {/* Header */}
      <div className="bg-[#8c9c6f] p-3 rounded-t-lg flex justify-between items-center mb-5">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div className="bg-[#d8e5c7] text-[#4a772e] px-4 py-1 rounded font-bold">
          Logged in as: {user?.username}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Upload Form */}
        <div className="md:col-span-2 bg-[#f7f7e8] p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-[#4a772e] mb-4">Upload New Research/Project</h2>

          <div className="bg-[#ffffdd] border border-[#e0e0b7] p-4 rounded mb-5 text-[#4a772e] text-sm">
            <h4 className="font-bold text-[#7a885d]">Important Upload Guidelines</h4>
            <p className="mt-2">
              All materials must be original. Full structure required. Review within 48 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Category</label>
              <select name="submission_type" onChange={handleInputChange} required className="w-full p-2 border rounded">
                <option value="" disabled selected>Select category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat.toLowerCase().replace(' ', '_')}>{cat}</option>
                ))}
                <option value="other">Other (specify)</option>
              </select>
            </div>

            {showOther && (
              <div>
                <label className="block font-bold text-gray-700 mb-1">Specify Other</label>
                <input
                  type="text"
                  name="submission_type_other"
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Quantum Computing"
                  className="w-full p-2 border rounded"
                />
              </div>
            )}

            {/* University field logic */}
            {['thesis', 'masters', 'bachelor'].includes(formData.submission_type) && (
              <div>
                <label className="block font-bold text-gray-700 mb-1">University Name</label>
                <input type="text" name="university_name" onChange={handleInputChange} required className="w-full p-2 border rounded" />
              </div>
            )}

            <div>
              <label className="block font-bold text-gray-700 mb-1">Cover Image</label>
              <input type="file" name="cover_image" accept="image/*" onChange={handleInputChange} required className="w-full" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Title</label>
              <input type="text" name="title" onChange={handleInputChange} required className="w-full p-2 border rounded" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Authors</label>
              <input type="text" name="authors" onChange={handleInputChange} required className="w-full p-2 border rounded" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Year</label>
              <input type="number" name="year_published" min="1900" max="2099" onChange={handleInputChange} required className="w-full p-2 border rounded" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Description (max 500)</label>
              <textarea name="short_description" rows="4" maxLength="500" onChange={handleInputChange} required className="w-full p-2 border rounded resize-vertical" />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">File (PDF/DOCX)</label>
              <input type="file" name="file" accept=".pdf,.doc,.docx" onChange={handleInputChange} required className="w-full" />
            </div>

            <button type="submit" disabled={uploading} className="w-full py-3 bg-[#8c9c6f] text-white font-bold rounded hover:bg-[#7a885d] disabled:opacity-50">
              {uploading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>

        {/* Profile */}
        <div className="bg-[#f7f7e8] p-6 rounded-lg shadow text-center">
          <h3 className="text-xl font-bold text-[#4a772e] mb-4">My Profile</h3>
          <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <div className="text-left text-sm space-y-2">
            <div><span className="inline-block w-20 font-bold">Name:</span> {user?.username}</div>
            <div><span className="inline-block w-20 font-bold">Email:</span> {user?.email}</div>
          </div>
        </div>
      </div>

      {/* Upload List with Click to Open */}
      <div className="mt-6 bg-[#f7f7e8] p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-[#4a772e] mb-2">My Uploads</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploads.map(upload => (
            <div
              key={upload.id}
              onClick={() => openFile(`http://localhost:8000${upload.file_url}`)}
              className={`p-4 rounded border-2 text-center cursor-pointer hover:shadow-lg transition ${getStatusColor(upload.status)}`}
              title={`Click to open: ${upload.title}`}
            >
              {upload.cover_image && (
                <Image src={`http://localhost:8000${upload.cover_image}`} alt="" width={80} height={100} className="mx-auto mb-2 rounded" />
              )}
              <div className="font-medium truncate">{upload.title}</div>
              <div className="text-xs text-gray-600">{upload.year_published}</div>
              <div className="text-xs mt-1">{upload.status_display}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}