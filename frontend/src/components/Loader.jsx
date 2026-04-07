import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center space-x-2 p-4 bg-slate-50 rounded-2xl rounded-bl-none w-fit border border-slate-100">
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
      <span className="text-sm text-slate-500 ml-2 font-medium">Researching...</span>
    </div>
  );
};

export default Loader;
