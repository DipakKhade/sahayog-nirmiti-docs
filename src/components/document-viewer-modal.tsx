"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { File, Download, Trash2, Eye, Calendar } from "lucide-react"
import { formatFileSize } from "@/lib/common-functions"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "pending" | "uploading" | "completed" | "error"
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

  const completedFiles = files.filter((file) => file.status === "completed")

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

  const handleDownload = (file: UploadedFile) => {
    // In a real implementation, you would fetch the file from your server
    console.log(`Downloading file: ${file.name}`)
  }

  const handleView = (file: UploadedFile) => {
    setSelectedFile(file)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Document Viewer</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          {/* File List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Uploaded Documents</h3>
              <Badge variant="outline">{completedFiles.length} files</Badge>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {completedFiles.length === 0 ? (
                  <Card>
                    <CardContent className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No completed uploads yet</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  completedFiles.map((file) => (
                    <Card
                      key={file.id}
                      className={`cursor-pointer transition-colors ${
                        selectedFile?.id === file.id ? "ring-2 ring-primary" : "hover:bg-muted/50"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <File className="h-4 w-4 text-blue-500" />
                              <p className="text-sm font-medium truncate">{file.name}</p>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                              <span>{formatFileSize(file.size)}</span>
                              {file.uploadDate && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {file.uploadDate.toLocaleDateString()}
                                </span>
                              )}
                            </div>

                            {getStatusBadge(file.status)}
                          </div>

                          <div className="flex items-center gap-1 ml-2">
                            <Button variant="ghost" size="sm" onClick={() => handleView(file)} className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(file)}
                              className="h-8 w-8 p-0"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteFile(file.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* File Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview</h3>

            {selectedFile ? (
              <Card className="h-[400px]">
                <CardHeader>
                  <CardTitle className="text-base">{selectedFile.name}</CardTitle>
                  <CardDescription>
                    {formatFileSize(selectedFile.size)} • {selectedFile.type}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <File className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">PDF preview not available in this demo</p>
                    <Button onClick={() => handleDownload(selectedFile)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download to View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-[400px]">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Eye className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a document to preview</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
