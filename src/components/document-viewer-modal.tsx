"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { File, Download, Eye, Trash2, Calendar, FileText } from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "completed" | "error"
  progress: number
  uploadDate?: Date
}

interface DocumentViewerModalProps {
  isOpen: boolean
  onClose: () => void
  files: UploadedFile[]
  onDeleteFile: (fileId: string) => void
}

export function DocumentViewerModal({ isOpen, onClose, files, onDeleteFile }: DocumentViewerModalProps) {
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />
    if (type.includes("image")) return <Eye className="h-5 w-5 text-blue-500" />
    if (type.includes("document") || type.includes("word")) return <FileText className="h-5 w-5 text-blue-600" />
    return <File className="h-5 w-5 text-gray-500" />
  }

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
    }
  }

  const completedFiles = files.filter((file) => file.status === "completed")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Document Library</DialogTitle>
          <DialogDescription>View and manage your uploaded documents ({completedFiles.length} files)</DialogDescription>
        </DialogHeader>

        <div className="flex gap-6 h-[60vh]">
          {/* File List */}
          <div className="flex-1">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-3">
                {completedFiles.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No completed uploads yet</p>
                    <p className="text-sm">Upload some documents to see them here</p>
                  </div>
                ) : (
                  completedFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedFile?.id === file.id ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setSelectedFile(file)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          {getFileIcon(file.type)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{file.name}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                              {getStatusBadge(file.status)}
                            </div>
                            {file.uploadDate && (
                              <div className="flex items-center space-x-1 mt-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{formatDate(file.uploadDate)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteFile(file.id)
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* File Details */}
          {selectedFile && (
            <>
              <Separator orientation="vertical" />
              <div className="w-80">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">File Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        {getFileIcon(selectedFile.type)}
                        <span className="font-medium truncate">{selectedFile.name}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Size:</span>
                          <p className="font-medium">{formatFileSize(selectedFile.size)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Type:</span>
                          <p className="font-medium">{selectedFile.type || "Unknown"}</p>
                        </div>
                      </div>

                      {selectedFile.uploadDate && (
                        <div>
                          <span className="text-muted-foreground text-sm">Uploaded:</span>
                          <p className="font-medium text-sm">{formatDate(selectedFile.uploadDate)}</p>
                        </div>
                      )}

                      <div>
                        <span className="text-muted-foreground text-sm">Status:</span>
                        <div className="mt-1">{getStatusBadge(selectedFile.status)}</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium">Actions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                        size="sm"
                        onClick={() => onDeleteFile(selectedFile.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
