import { useState } from "react";
import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

export default function DocDetails() {
    const [invoiceNo, setInvoiceNo] = useState("");
    const [purchaseOrderNo, setPurchaseOrderNo] = useState("");
    const [partNo, setPartNo] = useState("");
    const [partName, setPartName] = useState("");
    const [documentType, setDocumentType] = useState("");

    return <>
        <div className="flex flex-col gap-4 mb-6">
            <Input placeholder="Invoice No" onChange={(e) => setInvoiceNo(e.target.value)} />
            <Input placeholder="Purchase Order No" onChange={(e) => setPurchaseOrderNo(e.target.value)} />
            <Input placeholder="Part No" onChange={(e) => setPartNo(e.target.value)} />
            <Input placeholder="Part Name" onChange={(e) => setPartName(e.target.value)} />
            <Select onValueChange={(value) => setDocumentType(value)}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Document Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="light">MTC</SelectItem>
                <SelectItem value="dark">PTC</SelectItem>
                <SelectItem value="system">PDI</SelectItem>
                <SelectItem value="system">Other</SelectItem>
            </SelectContent>
            </Select>
        </div>
    </>
}