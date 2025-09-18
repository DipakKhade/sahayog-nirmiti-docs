import { DocumentTable } from "@/components/data-table";
import { Header } from "@/components/header";


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <Header />
      <div className="space-y-8">
        <div className="p-3">
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">document details</p>
        </div>
        <DocumentTable />
      </div>
    </main>
  )
}
