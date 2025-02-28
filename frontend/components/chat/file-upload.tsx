"use client"

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';  // Using shadcn/ui Progress component
import { Upload, Trash2, File as FileIcon, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  isUploading?: boolean;
  progress?: number;
}

export function FileUpload({ onFileUpload, isUploading = false, progress = 0 }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ensure grid columns do not exceed 4
  const getGridCols = () => {
    const count = selectedFiles.length;
    return count >= 4 ? "grid-cols-4" : `grid-cols-${count}`;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles(selectedFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0 && !isUploading) {
      onFileUpload(selectedFiles);
    }
  };

  const handleCancel = () => {
    if (!isUploading) setSelectedFiles([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if(ext === 'pdf'){
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if(ext === 'docx'){
      return <FileText className="h-4 w-4 text-blue-500" />;
    } else if(ext === 'txt'){
      return <FileText className="h-4 w-4 text-green-500" />;
    } else {
      return <FileIcon className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      {isUploading ? (
        // Using shadcn/ui Progress for a modern New York–style progress UI.
        <div className="flex flex-col items-center justify-center p-6">
          <Progress value={progress} className="w-full max-w-2xl h-2" />
          <p className="mt-4 text-lg font-bold text-gray-600 dark:text-gray-300">
            Uploading Files...
          </p>
        </div>
      ) : selectedFiles.length === 0 ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-border"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Drag and drop files here</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload PDF, DOCX, or TXT files to chat with your documents
          </p>
          <div className="flex justify-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.docx,.txt"
              multiple
            />
            <Button onClick={handleBrowseClick} variant="outline" disabled={isUploading}>
              Browse Files
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className={`grid ${getGridCols()} gap-4 max-h-96 overflow-y-auto`}>
            {selectedFiles.map((file, index) => (
              <div key={index} className="border rounded-lg p-4 flex flex-col justify-between bg-card">
                <div className="flex items-center gap-2 truncate">
                  {getFileIcon(file.name)}
                  <div className="truncate">
                    <div className="text-sm">{file.name}</div>
                    <div className="text-xs text-muted-foreground">({formatFileSize(file.size)})</div>
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveFile(index)}
                    className="h-8 w-8 p-0"
                    disabled={isUploading}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel} disabled={isUploading}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleUpload} disabled={isUploading}>
              Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'File' : 'Files'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}