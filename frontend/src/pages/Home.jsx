import React from 'react';
import FileUpload from '../components/FileUpload';
import ChatWindow from '../components/ChatWindow';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-inner">
              R
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              Smart<span className="text-primary font-extrabold">Research</span> Assistant
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 h-[calc(100vh-73px)]">
        {/* Left Sidebar - File Upload */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-md">
            <h2 className="text-xl font-bold mb-2">Welcome to RAG AI</h2>
            <p className="text-blue-50 text-sm leading-relaxed">
              Upload your research papers, articles or manuals as PDFs and start asking questions. 
              If the documents don't hold the answer, I will search the web for you!
            </p>
          </div>
          <FileUpload />
        </div>

        {/* Right Content - Chat Window */}
        <div className="w-full lg:w-2/3 h-full pb-0 lg:pb-0 min-h-[500px]">
          <ChatWindow />
        </div>
      </main>
    </div>
  );
};

export default Home;
