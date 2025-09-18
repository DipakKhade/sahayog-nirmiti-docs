import { DocumentTable } from "@/components/data-table";


export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">document details</p>
        </div>
        <DocumentTable />
      </div>
    </main>
  )
}
