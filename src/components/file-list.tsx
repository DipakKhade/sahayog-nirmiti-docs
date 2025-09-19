"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, ExternalLink } from 'lucide-react'
import { FileItem } from "@/lib/types"

interface FileListModalProps {
  files: FileItem[]
  isOpen: boolean
  onClose: () => void
}

export function FileListModal({ files, isOpen, onClose }: FileListModalProps) {
  const handleDownload = (url: string) => {
    try {
      const link = document.createElement('a')
      link.href = url
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error opening file:', error)
      window.open(url, '_blank')
    }
  }

  const getFileName = (key: string) => {
    const cleanKey = key.trim()
    const parts = cleanKey.split("/")
    const fileName = parts[parts.length - 1] || cleanKey
    return fileName.replace(/^[\s\-]+/, '')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Files ({files.length})
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-3">
            {files.map((file, index) => {
              const fileName = getFileName(file.key)

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                <div className="flex flex-col md:flex-row">
                  <div className="flex items-center gap-3 flex-1 min-w-0">

                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate" title={fileName}>
                        {fileName}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(file.url)}
                    className="flex items-center gap-2 ml-4 flex-shrink-0 mt-2 md:mt-0"
                    >
                    <ExternalLink className="h-4 w-4" />
                    Open
                  </Button>
                </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>

        {files.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No files available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
