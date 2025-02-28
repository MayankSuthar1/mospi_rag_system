"use client"

import '@/styles/custom-scrollbar.css';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Send, MicOff } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition && !recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
          
        setMessage(transcript);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current = recognition;
    }
    
    // No cleanup here - we'll handle it in toggleRecording
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    
    try {
      if (!isRecording) {
        // Start recording
        recognitionRef.current.start();
        setIsRecording(true);
      } else {
        // Stop recording
        recognitionRef.current.stop();
        setIsRecording(false);
      }
    } catch (error) {
      console.error("Speech recognition error:", error);
      
      // Reset state if there's an error
      setIsRecording(false);
      
      // If recognition fails, create a new instance
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
            
          setMessage(transcript);
        };
        
        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  };

  return (
    <div 
      className={cn(
        "fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[60vw] flex items-center",
        "bg-white/80 dark:bg-slate-800/50 backdrop-blur-md",
        "border border-gray-200/50 dark:border-slate-700/50",
        "dark:shadow-[0_0_15px_rgba(66,153,225,0.1)]",
        "rounded-xl shadow-lg p-3 space-x-2",
        "transition-all duration-200 ease-in-out"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full transition-all duration-200",
          "hover:bg-slate-100 dark:hover:bg-slate-700/70",
          isRecording ? 
            "text-red-500 dark:text-red-400 " : 
            "text-slate-500 dark:text-slate-400"
        )}
        onClick={toggleRecording}
      >
        {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>
      
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className={cn(
            "w-full resize-none py-2 px-3 rounded-lg",
            "bg-transparent dark:bg-slate-700/30",
            "border-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
            "text-sm dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500",
            "hide-scrollbar transition-colors duration-200"
          )}
          rows={1}
        />
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSend}
        disabled={!message.trim()}
        className={cn(
          "rounded-full transition-all duration-200",
          "text-slate-500 dark:text-slate-400",
          "hover:bg-slate-100 dark:hover:bg-slate-700/70",
          "disabled:opacity-50",
          message.trim() ? "dark:text-blue-400 dark:hover:text-blue-300" : ""
        )}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}