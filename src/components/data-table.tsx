"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Download, FilesIcon, View } from "lucide-react"
import axios from "axios"
import { DocumentData, FileItem, PaginationData } from "@/lib/types"
import { Pagination } from "./pagination"
import { FileListModal } from "./file-list"
import { toast } from "sonner"

export function DataTable() {
  const [documents, setDocuments] = useState<DocumentData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationData>({
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  })

  const [showFiles, SetShowFiles] = useState<boolean>(false)

  const [files, SetFiles] = useState<FileItem[]>([])


  const fetchDocuments = async (page: number) => {
    setLoading(true)
    setError(null)
    toast.loading('loading ...')
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

    toast.dismiss()
  }

  useEffect(() => {
    fetchDocuments(currentPage)
  }, [currentPage])

  const handleViewFiles = async(document: DocumentData) => {
    toast.loading('getting files..')
    const response = await axios.get(`/api/doc_details/download?bucketKey=${document.bucketKey}`)
    SetFiles(response.data.urls ?? [])
    SetShowFiles(true)
    toast.dismiss()
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
                        onClick={() => handleViewFiles(document)}
                        className="h-8 w-8 p-0"
                      >
                        <FilesIcon className="h-4 w-4" />
                        <span className="sr-only">documents</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination 
        currentPage={currentPage} 
        totalPages={pagination?.totalPages ?? 1} 
        totalCount={pagination?.totalCount ?? 0} 
        hasNext={pagination?.hasNext ?? false} 
        hasPrev={pagination?.hasPrev ?? false} 
        onPageChange={(e) => setCurrentPage(e)} 
        />

      </CardContent>

      {showFiles && <FileListModal isOpen={showFiles} onClose={()=>{
        SetShowFiles(false)
      }} files={files}/>}

    </Card>
  )
}
