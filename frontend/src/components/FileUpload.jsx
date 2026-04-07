import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadDocuments } from '../services/api';

const FileUpload = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 5) {
      setStatus('error');
      setMessage('Maximum 5 files allowed.');
      return;
    }
    setFiles(selectedFiles);
    setStatus(null);
    setMessage('');
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setStatus(null);
    setMessage('');
    try {
      const res = await uploadDocuments(files);
      setStatus('success');
      setMessage(`Successfully uploaded ${res.documents_processed} document(s).`);
      if (onUploadSuccess) onUploadSuccess();
      setFiles([]);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.detail || error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Upload Knowledge Base</h3>
      
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors">
        <input 
          type="file" 
          multiple 
          accept=".pdf" 
          onChange={handleFileChange} 
          className="hidden" 
          id="file-upload" 
          disabled={uploading}
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
          <UploadCloud className="w-10 h-10 text-primary mb-2" />
          <span className="text-sm font-medium text-slate-600">
            {files.length > 0 ? `${files.length} file(s) selected` : 'Click to select up to 5 PDFs'}
          </span>
          <span className="text-xs text-slate-400 mt-1">Max 10 pages per PDF</span>
        </label>
      </div>

      {files.length > 0 && (
        <button 
          onClick={handleUpload} 
          disabled={uploading}
          className="w-full mt-4 bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {uploading ? 'Uploading & Processing...' : 'Upload Papers'}
        </button>
      )}

      {status && (
        <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {status === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
