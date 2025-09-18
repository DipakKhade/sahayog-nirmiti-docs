"use client"

import type React from "react"
import { useState, useCallback, useEffect, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, File, X, CheckCircle, AlertCircle, FolderOpen } from "lucide-react"
import { DocumentViewerModal } from "./document-viewer-modal"
import { formatFileSize } from "@/lib/common-functions"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "pending" | "uploading" | "completed" | "error"
  progress: number
  uploadDate?: Date
  file?: File // store the actual File object for later upload
}

interface DocumentUploadProps {
  onFilesChange?: (files: File[]) => void // callback to notify parent of file changes
}

export interface DocumentUploadRef {
  uploadFiles: (formData: any) => Promise<void>
}

export const DocumentUpload = forwardRef<DocumentUploadRef, DocumentUploadProps>(({ onFilesChange }, ref) => {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  useEffect(() => {
    const pendingFiles = files.filter((f) => f.status === "pending" && f.file).map((f) => f.file!)
    onFilesChange?.(pendingFiles)
  }, [files, onFilesChange])

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "pending" as const, // Set to pending instead of uploading
      progress: 0,
      file, // Store the file object
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const uploadFiles = async (formData: any) => {
    const pendingFiles = files.filter((f) => f.status === "pending")

    for (const fileData of pendingFiles) {
      if (!fileData.file) continue

      setFiles((prev) => prev.map((f) => (f.id === fileData.id ? { ...f, status: "uploading" } : f)))

      try {
        const uploadFormData = new FormData()
        uploadFormData.append("file", fileData.file)

        Object.keys(formData).forEach((key) => {
          uploadFormData.append(key, formData[key])
        })

        const xhr = new XMLHttpRequest()
        xhr.open("POST", "/api/upload_doc")

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100)
            setFiles((prev) => prev.map((f) => (f.id === fileData.id ? { ...f, progress } : f)))
          }
        }

        await new Promise((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status === 200) {
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === fileData.id ? { ...f, status: "completed", progress: 100, uploadDate: new Date() } : f,
                ),
              )
              resolve(xhr.response)
            } else {
              setFiles((prev) => prev.map((f) => (f.id === fileData.id ? { ...f, status: "error" } : f)))
              reject(new Error(`Upload failed with status ${xhr.status}`))
            }
          }

          xhr.onerror = () => {
            setFiles((prev) => prev.map((f) => (f.id === fileData.id ? { ...f, status: "error" } : f)))
            reject(new Error("Upload failed"))
          }

          xhr.send(uploadFormData)
        })
      } catch (error) {
        setFiles((prev) => prev.map((f) => (f.id === fileData.id ? { ...f, status: "error" } : f)))
      }
    }
  }

  useImperativeHandle(ref, () => ({
    uploadFiles,
  }))

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>Drag and drop your files here or click to browse</CardDescription>
            </div>
            {/* {files.filter((f) => f.status === "completed").length > 0 && (
              <Button variant="outline" onClick={() => setIsViewerOpen(true)}>
                <FolderOpen className="h-4 w-4 mr-2" />
                View Documents ({files.filter((f) => f.status === "completed").length})
              </Button>
            )} */}
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Drop files here to upload</p>
              <p className="text-sm text-muted-foreground">Supports PDF files</p>
            </div>
            <div className="mt-4">
              <Button onClick={() => document.getElementById("file-input")?.click()} variant="outline">
                Browse Files
              </Button>
              <input
                id="file-input"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
                accept=".pdf"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Files ({files.length})</CardTitle>
            <CardDescription>Files ready for upload</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">{getStatusIcon(file.status)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      {getStatusBadge(file.status)}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{formatFileSize(file.size)}</p>
                    {file.status === "uploading" && <Progress value={file.progress} className="h-2" />}
                  </div>

                  {file.status === "pending" && (
                    <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)} className="flex-shrink-0">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Files will be uploaded when you click Save. Maximum file size is 10MB per file.
        </AlertDescription>
      </Alert>

      {/* DocumentViewerModal */}
      <DocumentViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        files={files}
        onDeleteFile={removeFile}
      />
    </div>
  )
})

DocumentUpload.displayName = "DocumentUpload"

const getStatusBadge = (status: UploadedFile["status"]) => {
  switch (status) {
    case "completed":
      return (
        <Badge variant="secondary" className="text-green-700 bg-green-100">
          Completed
        </Badge>
      )
    case "error":
      return <Badge variant="destructive">Error</Badge>
    case "uploading":
      return <Badge variant="outline">Uploading</Badge>
    case "pending":
      return <Badge variant="secondary">Ready to upload</Badge>
  }
}

const getStatusIcon = (status: UploadedFile["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    case "uploading":
      return <File className="h-4 w-4 text-blue-500 animate-pulse" />
    default:
      return <File className="h-4 w-4 text-gray-500" />
  }
}
