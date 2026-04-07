import React from 'react';
import { User, Bot, FileText, Fingerprint } from 'lucide-react';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-primary' : 'bg-secondary'}`}>
          {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
        </div>

        {/* Bubble */}
        <div className={`relative px-5 py-4 rounded-2xl shadow-sm ${
          isUser 
            ? 'bg-primary text-white rounded-br-none' 
            : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
          }`}
        >
          {/* Main Answer */}
          <div className="text-[15px] leading-relaxed whitespace-pre-wrap font-sans">
            {message.content}
          </div>

          {/* AI Metadata (Citations, Source, Confidence) */}
          {!isUser && (message.citations?.length > 0 || message.source) && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              
              {/* Confidence & Source Info */}
              <div className="flex items-center gap-4 mb-3 text-xs font-semibold">
                {message.source === 'web' ? (
                  <span className="flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-1 rounded">
                    <Fingerprint className="w-3 h-3" /> Fallback to Web Search
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    <FileText className="w-3 h-3" /> Answered from Documents
                  </span>
                )}

                {message.source === 'rag' && message.confidence && (
                  <span className={`px-2 py-1 rounded flex items-center gap-1
                    ${message.confidence === 'High' ? 'bg-green-100 text-green-700' : 
                      message.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'}`}
                  >
                    Confidence: {message.confidence}
                  </span>
                )}
              </div>

              {/* Citations List */}
              {message.citations?.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1">Citations</span>
                  {message.citations.map((cite, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-lg text-sm border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="font-semibold text-primary mb-1 text-xs">
                        {cite.document_name} • Page {cite.page_number}
                      </div>
                      <div className="text-slate-600 text-[13px] italic leading-snug">
                        "{cite.snippet}"
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
