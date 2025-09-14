"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Download, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "completed" | "error"
  progress: number
  uploadDate?: Date
}

interface DocumentPreviewProps {
  isOpen: boolean
  onClose: () => void
  file: UploadedFile | null
}

export function DocumentPreview({ isOpen, onClose, file }: DocumentPreviewProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  if (!file) return null

  const isImage = file.type.startsWith("image/")
  const isPDF = file.type === "application/pdf"
  const isText = file.type.startsWith("text/") || file.type.includes("json") || file.type.includes("xml")

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 25))
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)

  const renderPreview = () => {
    // Create a mock blob URL for demonstration
    const mockBlobUrl = `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(file.name)}`

    if (isImage) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
          <img
            src={mockBlobUrl || "/placeholder.svg"}
            alt={file.name}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            }}
          />
        </div>
      )
    }

    if (isPDF) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
          <div className="text-center space-y-4">
            <div className="w-64 h-80 bg-white border-2 border-gray-200 rounded-lg shadow-sm mx-auto flex items-center justify-center">
              <div className="text-gray-500">
                <div className="text-6xl mb-2">📄</div>
                <p className="text-sm">PDF Preview</p>
                <p className="text-xs text-gray-400">{file.name}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">PDF preview would be rendered here</p>
          </div>
        </div>
      )
    }

    if (isText) {
      return (
        <div className="h-full bg-gray-50 rounded-lg p-4">
          <ScrollArea className="h-full">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {`// Sample content for ${file.name}
This is a preview of the text file content.
In a real implementation, you would fetch and display
the actual file content here.

File: ${file.name}
Type: ${file.type}
Size: ${(file.size / 1024).toFixed(2)} KB

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco
laboris nisi ut aliquip ex ea commodo consequat.`}
            </pre>
          </ScrollArea>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <div className="text-center space-y-4">
          <div className="text-6xl">📄</div>
          <div>
            <p className="font-medium">Preview not available</p>
            <p className="text-sm text-gray-600">This file type cannot be previewed</p>
            <p className="text-xs text-gray-400">{file.type}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="truncate pr-4">{file.name}</DialogTitle>
            <div className="flex items-center space-x-2">
              {(isImage || isPDF) && (
                <>
                  <Button variant="outline" size="sm" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[3rem] text-center">{zoom}%</span>
                  <Button variant="outline" size="sm" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  {isImage && (
                    <Button variant="outline" size="sm" onClick={handleRotate}>
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div className="h-[70vh] overflow-hidden">{renderPreview()}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
