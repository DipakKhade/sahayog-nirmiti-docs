"use client"
import { DocumentUpload, type DocumentUploadRef } from "@/components/document-upload"
import { Header } from "@/components/header"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useRef, useCallback } from "react"
import { Save, Loader2 } from "lucide-react"

export default function SupplierHomePage() {
  const [invoiceNo, setInvoiceNo] = useState("")
  const [purchaseOrderNo, setPurchaseOrderNo] = useState("")
  const [partNo, setPartNo] = useState("")
  const [partName, setPartName] = useState("")
  const [documentType, setDocumentType] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]) 
  const [isSaving, setIsSaving] = useState(false) 
  const documentUploadRef = useRef<DocumentUploadRef>(null)

  const isFormValid = invoiceNo.trim() !== "" && purchaseOrderNo.trim() !== "" && partNo.trim() !== "" && partName.trim() !== "" && documentType !== "" && selectedFiles.length > 0

  const handleFilesChange = useCallback((files: File[]) => {
    setSelectedFiles(files)
  }, [])

  const handleSave = async () => {
    if (!isFormValid) return

    setIsSaving(true)
    try {
      const formData = {
        invoiceNo,
        purchaseOrderNo,
        partNo,
        partName,
        documentType,
      }

      if (documentUploadRef.current?.uploadFiles) {
        await documentUploadRef.current.uploadFiles(formData)
      }

      setInvoiceNo("")
      setPurchaseOrderNo("")
      setPartNo("")
      setPartName("")
      setDocumentType("")
      setSelectedFiles([])

      console.log("Documents uploaded successfully!")
    } catch (error) {
      console.error("Error uploading documents:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Upload Documents</h1>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Document Information</CardTitle>
              <CardDescription>Fill in the document details below</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Input placeholder="Invoice No" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
                <Input
                  placeholder="Purchase Order No"
                  value={purchaseOrderNo}
                  onChange={(e) => setPurchaseOrderNo(e.target.value)}
                />
                <Input placeholder="Part No" value={partNo} onChange={(e) => setPartNo(e.target.value)} />
                <Input placeholder="Part Name" value={partName} onChange={(e) => setPartName(e.target.value)} />
                <Select value={documentType} onValueChange={(value) => setDocumentType(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Document Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MTC">MTC</SelectItem>
                    <SelectItem value="PTC">PTC</SelectItem>
                    <SelectItem value="PDI">PDI</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>Drag and drop your documents or click to browse</CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentUpload ref={documentUploadRef} onFilesChange={handleFilesChange} />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={!isFormValid || isSaving} size="lg" className="min-w-[120px]">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
