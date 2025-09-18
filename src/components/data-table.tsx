"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"
import axios from "axios"
import { DocumentData } from "@/lib/types"



export function DocumentTable() {
  const [documents, setDocuments] = useState<DocumentData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDocuments = async (page: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`/api/doc_details?page=${page}`)
      if (response.data) {
        setDocuments(response.data.data)
      } else {
        setError('Error fetching documents')
      }
    } catch (err) {
      setError("Failed to fetch documents")
      console.error("Error fetching documents:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments(currentPage)
  }, [currentPage])

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1)
  }

  const handleDownload = (document: DocumentData) => {
    // Implement download logic here
    console.log("Download document:", document.bucketKey)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">Error: {error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Management</CardTitle>
        <CardDescription>View and manage your uploaded documents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier Name</TableHead>
                <TableHead>Vendor Code</TableHead>
                <TableHead>Invoice No</TableHead>
                <TableHead>Invoice Name</TableHead>
                <TableHead>Part No</TableHead>
                <TableHead>Part Name</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Uploaded Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    Loading documents...
                  </TableCell>
                </TableRow>
              ) : documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    No documents found
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">{document.user.username}</TableCell>
                    <TableCell>{document.user.vendorCode || "N/A"}</TableCell>
                    <TableCell>{document.invoiceNo}</TableCell>
                    <TableCell>{document.partName}</TableCell>
                    <TableCell>{document.partNo}</TableCell>
                    <TableCell>{document.partName}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {document.documentType}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(document.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(document)}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download document</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">Page {currentPage}</div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1 || loading}>
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={loading}>
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
