import { DocumentUpload } from "@/components/document-upload"
import { Header } from "@/components/header"
import DocDetails from "@/components/ui/doc-details"

export default function HomePage() {
  return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Document Manager</h1>
              <p className="text-muted-foreground">Upload and manage your documents securely</p>
            </div>
            <div>
            <DocDetails/>
            <DocumentUpload />
            </div>
          </div>
        </main>
      </div>
  )
}
