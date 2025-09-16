"use client"
import { DocumentUpload } from "@/components/document-upload"
import { Header } from "@/components/header"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function SupplierHomePage() {
  const [invoiceNo, setInvoiceNo] = useState("")
  const [purchaseOrderNo, setPurchaseOrderNo] = useState("")
  const [partNo, setPartNo] = useState("")
  const [partName, setPartName] = useState("")
  const [documentType, setDocumentType] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Upload Documents</h1>
            {/* <p className="text-muted-foreground">Upload your documents securely</p> */}
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Document Information</CardTitle>
              <CardDescription>Fill in the document details below</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Input placeholder="Invoice No" onChange={(e) => setInvoiceNo(e.target.value)} />
                <Input placeholder="Purchase Order No" onChange={(e) => setPurchaseOrderNo(e.target.value)} />
                <Input placeholder="Part No" onChange={(e) => setPartNo(e.target.value)} />
                <Input placeholder="Part Name" onChange={(e) => setPartName(e.target.value)} />
                <Select onValueChange={(value) => setDocumentType(value)}>
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

          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>Drag and drop your documents or click to browse</CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentUpload />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
