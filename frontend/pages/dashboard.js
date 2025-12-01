import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../context/AuthContext';
import { ftpAPI } from '../utils/api';
import { toast } from 'react-toastify';
import { 
  FaUpload, FaDownload, FaTrash, FaSignOutAlt, FaUser, 
  FaFile, FaClock, FaServer
} from 'react-icons/fa';

export default function Dashboard() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user && !hasChecked) {
      setHasChecked(true);
      window.location.replace('/login');
      return;
    }
    
    if (user) {
      loadFiles();
    }
  }, [user, authLoading]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const { data } = await ftpAPI.getFiles();
      if (data.success) {
        setFiles(data.files);
      }
    } catch (error) {
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warning('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploading(true);
      const { data } = await ftpAPI.uploadFile(formData);
      if (data.success) {
        toast.success('File uploaded successfully!');
        setSelectedFile(null);
        loadFiles();
        // Reset file input
        document.getElementById('file-input').value = '';
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const { data } = await ftpAPI.downloadFile(filename);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('File downloaded!');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const handleDelete = async (filename) => {
    if (!confirm(`Delete ${filename}?`)) return;

    try {
      const { data } = await ftpAPI.deleteFile(filename);
      if (data.success) {
        toast.success('File deleted!');
        loadFiles();
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Dashboard - Summoners Upload</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FaServer className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Summoners Upload</h1>
                  <p className="text-sm text-gray-500">Welcome to the rift uploads</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                  <FaUser className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.username}
                  </span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* File Management */}
          <div className="space-y-6">
              {/* Upload Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 border">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUpload className="text-blue-600" />
                  Upload File
                </h2>
                <div className="flex gap-4">
                  <input
                    id="file-input"
                    type="file"
                    onChange={handleFileSelect}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                  >
                    <FaUpload />
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {selectedFile.name} ({formatBytes(selectedFile.size)})
                  </p>
                )}
              </div>

              {/* Files List */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FaFile className="text-blue-600" />
                    My Files ({files.length})
                  </h2>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="spinner"></div>
                    </div>
                  ) : files.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <FaFile className="text-5xl mx-auto mb-4 text-gray-300" />
                      <p>No files uploaded yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Filename
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Size
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Modified
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {files.map((file, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <FaFile className="text-gray-400 mr-3" />
                                  <span className="text-sm font-medium text-gray-900">
                                    {file.filename}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatBytes(file.size)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <FaClock className="inline mr-1" />
                                {formatDate(file.modifiedAt)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => handleDownload(file.filename)}
                                  className="text-blue-600 hover:text-blue-900 mr-4"
                                  title="Download"
                                >
                                  <FaDownload />
                                </button>
                                <button
                                  onClick={() => handleDelete(file.filename)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete"
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
        </main>
      </div>
    </>
  );
}
