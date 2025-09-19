export interface Document {
    id: number
    invoiceNo: string
    purchaseOrderNo: string
    partNo: string
    partName: string
    documentType: string
    userId: number
    bucketKey: string
    createdAt: string
    user: {
      username: string
      vendorCode: string | null
    }
  }
  
  export interface GroupedInvoice {
    invoiceNo: string
    purchaseOrderNo: string
    partNo: string
    partName: string
    documentType: string
    supplierName: string
    vendorCode: string | null
    documents: Document[]
  }
  
  export interface SuppliersTableProps {
    documents: Document[]
    loading: boolean
    pagination: PaginationData
    onViewDocuments: (documents: any) => void
    onPageChange: (page: number) => void
  }
  

  export interface DocumentData {
    id: number
    invoiceNo: string
    purchaseOrderNo: string
    partNo: string
    partName: string
    documentType: string
    userId: number
    bucketKey: string
    createdAt: string
    user: {
      name: string
      vendorCode: string | null
    }
  }

  export interface PaginationData {
    totalPages: number,
    totalCount: number,
    hasNext: boolean,
    hasPrev: boolean
  }