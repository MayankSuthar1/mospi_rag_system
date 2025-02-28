import { Message, UploadedFile } from './chat-interface';
import { FileText, Link as LinkIcon, Copy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface MessageListProps {
  messages: Message[];
  files: UploadedFile[];
}

export function MessageList({ messages, files }: MessageListProps) {
  return (
    <div className="space-y-6 py-4 max-w-4xl mx-auto">
      {/* File upload status */}
      {files.filter(f => f.status !== 'ready').length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg space-y-3">
          {files
            .filter(f => f.status !== 'ready')
            .map(file => (
              <div key={file.id} className="space-y-2">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground capitalize">
                    {file.status}
                  </span>
                </div>
                {file.status === 'uploading' && file.progress !== undefined && (
                  <Progress value={file.progress} className="h-1" />
                )}
                {file.status === 'processing' && (
                  <Progress value={undefined} className="h-1" />
                )}
                {file.status === 'error' && (
                  <p className="text-xs text-destructive">{file.error}</p>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Messages */}
      {messages.map((message) => (
        <div key={message.id} className="relative">
          {/* Removed user profile icon */}
          
          {/* Message content with conditional alignment */}
          <div className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-center'}`}>
            {/* Updated modern-styled message card with role label and size change for assistant */}
            <div 
              className={`relative rounded-xl p-4 shadow-lg border dark:border-gray-700 ${
                message.role === 'user'
                  ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 w-[100vw]'
              }`}
            >
              {/* Role label on left side */}
              <div className="mb-2">
                <span className="bg-gray-200 dark:bg-gray-600 text-xs font-medium px-2 py-1 rounded">
                  {message.role === 'user' ? 'User' : 'ChatBot'}
                </span>
              </div>
              
              {message.role === 'assistant' && (
                <button
                  onClick={() => navigator.clipboard.writeText(message.content)}
                  className="absolute top-2 right-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  <Copy className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </button>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
              
              {/* Source links for assistant messages */}
              {message.role === 'assistant' && message.content.includes('Sources') && (
                <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                  <div className="flex items-center text-xs">
                    <LinkIcon className="h-3 w-3 mr-1" />
                    <span className="font-medium">Sources:</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    <a href="#" className="text-xs text-blue-500 hover:underline block">Source 1</a>
                    <a href="#" className="text-xs text-blue-500 hover:underline block">Source 2</a>
                    <a href="#" className="text-xs text-blue-500 hover:underline block">Source 3</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}