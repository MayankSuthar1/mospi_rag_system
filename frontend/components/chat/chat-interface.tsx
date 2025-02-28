"use client"

import { useState } from 'react';
import { FileUpload } from './file-upload';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { Button } from '@/components/ui/button';
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DarkModeToggle } from '@/components/dark-mode-toggle';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  progress?: number;
  error?: string;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [activeChat, setActiveChat] = useState<string>('current');
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [hasUploadedFiles, setHasUploadedFiles] = useState<boolean>(false);
  // New upload state and overall progress (0-100)
  const [uploading, setUploading] = useState<boolean>(false);
  const [overallProgress, setOverallProgress] = useState<number>(0);
  
  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I received your message: "${content}". This is a simulated response.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };
  
  const handleFileUpload = (uploadedFiles: File[]) => {
    const newFiles: UploadedFile[] = uploadedFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    setUploading(true);
    
    // Process each file with simulated upload
    newFiles.forEach(newFile => {
      // Simulate upload progress for each file
      const interval = setInterval(() => {
        setFiles((prev) => 
          prev.map((f) => 
            f.id === newFile.id && f.status === 'uploading'
              ? { ...f, progress: Math.min((f.progress || 0) + 10, 100) }
              : f
          )
        );
        // Calculate overall progress as average
        setFiles(prev => {
          const total = prev.reduce((sum, f) => sum + (f.progress || 0), 0);
          const avg = total / prev.length;
          setOverallProgress(Math.floor(avg));
          return prev;
        });
      }, 300);
      
      // Simulate upload completion for each file
      setTimeout(() => {
        clearInterval(interval);
        setFiles((prev) => 
          prev.map((f) => 
            f.id === newFile.id ? { ...f, status: 'processing' } : f
          )
        );
        
        // Simulate processing
        setTimeout(() => {
          setFiles((prev) => 
            prev.map((f) => 
              f.id === newFile.id ? { ...f, status: 'ready' } : f
            )
          );
          
          // Only add a message for the last file when all files are done
          if (newFile.id === newFiles[newFiles.length - 1].id) {
            const fileNames = newFiles.map(f => f.name).join(", ");
            const message = newFiles.length === 1 
              ? `${fileNames} file is processed. Now you can ask questions about it.`
              : `${newFiles.length} files are processed. Now you can ask questions about them.`;
              
            // Add system message about files
            const systemMessage: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: message,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, systemMessage]);
            setUploading(false);
            setHasUploadedFiles(true);
          }
          
          // Show sidebar and mark as having uploaded files
          setSidebarVisible(true);
          setHasUploadedFiles(true);
        }, 2000);
      }, 3000);
    });
  };
  
  const startNewChat = () => {
    setActiveChat(Date.now().toString());
    setMessages([]);
    setFiles([]);
    setHasUploadedFiles(false);
  };
  
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  
  return (
    <div className="relative h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-background border-b border-border p-3 flex items-center z-50 h-[3.8rem]">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">Chatbot</h1>
          {hasUploadedFiles && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleSidebar}
              className="transition-transform duration-200 ease-in-out hover:bg-accent"
            >
              {sidebarVisible ? 
                <ChevronLeft className="h-4 w-4 transition-transform duration-200 ease-in-out" /> : 
                <ChevronRight className="h-4 w-4 transition-transform duration-200 ease-in-out" />
              }
            </Button>
          )}
        </div>
        {/* ...other header content if any... */}
      </div>
      
      {/* Fixed Sidebar */}
      {hasUploadedFiles && (
        <div 
          className={cn(
            "fixed top-[3.8rem] left-0 z-40 bg-card border-r border-border overflow-y-auto flex flex-col transition-all duration-300 ease-in-out",
            sidebarVisible ? "w-full md:w-64 opacity-100" : "w-0 opacity-0"
          )}
          style={{ height: "calc(100% - 3.8rem)" }}
        >
          {/* New Chat Button */}
          <div className="p-3 border-b border-border">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={startNewChat}
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
          {/* Chat History */}
          <div className="flex-1 p-2 space-y-1">
            <div className="flex items-center p-2 rounded-md bg-accent cursor-pointer">
              <span className="text-sm">Current Chat</span>
            </div>
            {/* ...existing chat history... */}
          </div>
        </div>
      )}
      
      {/* Main Chat Area */}
      <div className={`flex top-[3.8rem] flex-col h-full overflow-hidden transition-all duration-300 ease-in-out`} 
           style={{ paddingTop: "3.8rem" }}>
        <div className="flex-1 overflow-y-auto p-4">
          {!hasUploadedFiles || uploading ? (
            // While not finished uploading, show FileUpload with progress bar via new props.
            <div className="h-full flex flex-col items-center justify-center">
              <FileUpload onFileUpload={handleFileUpload} isUploading={uploading} progress={overallProgress} />
            </div>
          ) : (
            <MessageList messages={messages} files={files} />
          )}
          {/* Spacer to prevent overlapping MessageInput */}
          {hasUploadedFiles && <div className="h-24" />}
                  </div>
        
        {hasUploadedFiles && (
          <MessageInput onSendMessage={handleSendMessage}/>
        )}
      </div>
      
      {/* Fixed Dark Mode Toggle */}
      <div className="fixed bottom-4 right-4 z-50">
        <DarkModeToggle />
      </div>
    </div>
  );
}