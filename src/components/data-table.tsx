"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"
import axios from "axios"
import { DocumentData, PaginationData } from "@/lib/types"
import { Pagination } from "./pagination"



export function DocumentTable() {
  const [documents, setDocuments] = useState<DocumentData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  })

  const fetchDocuments = async (page: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`/api/doc_details?page=${page}`)
      if (response.data) {
        setDocuments(response.data.data)
        setPagination(response.data.pagination_data)
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
        {/* <CardTitle>Document Management</CardTitle>
        <CardDescription>View and manage your uploaded documents</CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-primary-foreground">
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
              ) : documents && documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    No documents found
                  </TableCell>
                </TableRow>
              ) : (
                documents && documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">{document.user.name}</TableCell>
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
        
      <Pagination currentPage={pagination?.currentPage} totalPages={pagination?.totalPages} totalCount={pagination?.totalCount} hasNext={pagination?.hasNext} hasPrev={pagination?.hasPrev} onPageChange={(e)=>{console.log(e)}} />
      </CardContent>

    </Card>
  )
}
