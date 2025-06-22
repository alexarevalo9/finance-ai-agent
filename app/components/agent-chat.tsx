'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';

export default function AgentChat() {
  const { messages, input, setInput, append, status } = useChat({
    api: '/api/agent',
    maxSteps: 10,
  });

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (status === 'submitted') {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [status]);

  const handleSubmit = async () => {
    if (input.trim()) {
      append({ content: input, role: 'user' });
      setInput('');
    }
  };

  return (
    <div className='flex flex-col h-[90vh] max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200'>
      {/* Header */}
      <div className='bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white'>
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm'>
            <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div>
            <h3 className='font-semibold text-lg'>Finance AI Assistant</h3>
            <p className='text-sm text-white/80'>
              Ask about bitcoin, credit cards, and more
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className='flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4'>
        {messages.length === 0 && (
          <div className='text-center text-gray-500 mt-8'>
            <div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-gray-400'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <p className='text-lg font-medium mb-2'>Start a conversation</p>
            <p className='text-sm'>
              Ask me anything about finance, crypto, or financial planning!
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                <svg
                  className='w-5 h-5 text-white'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
            )}

            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
              }`}
            >
              <div className='text-sm leading-relaxed whitespace-pre-wrap'>
                {message.content}
              </div>
              <div
                className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            {message.role === 'user' && (
              <div className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                <svg
                  className='w-5 h-5 text-gray-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className='flex items-start space-x-3'>
            <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0'>
              <svg
                className='w-5 h-5 text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='bg-white px-4 py-3 rounded-2xl rounded-bl-md border border-gray-200 shadow-sm'>
              <div className='flex space-x-1'>
                <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                <div
                  className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className='p-4 bg-white border-t border-gray-200'>
        <div className='flex items-end space-x-3'>
          <div className='flex-1 relative'>
            <input
              className='w-full p-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm placeholder-gray-500 transition-all duration-200'
              placeholder='Type your message...'
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={async (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  await handleSubmit();
                }
              }}
              disabled={status === 'submitted'}
            />

            {/* Character count or other indicators could go here */}
          </div>

          <button
            className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center ${
              input.trim() && status !== 'submitted'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            onClick={handleSubmit}
            disabled={!input.trim() || status === 'submitted'}
          >
            {status === 'submitted' ? (
              <svg
                className='w-5 h-5 animate-spin'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
            ) : (
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z' />
              </svg>
            )}
          </button>
        </div>

        <div className='mt-2 text-xs text-gray-400 text-center'>
          Press Enter to send • Shift + Enter for new line
        </div>
      </div>
    </div>
  );
}
