import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            AutoFront Dashboard
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Manage your datapoints with our powerful data table
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Data Table</h2>
            <p className="text-muted-foreground mb-4">
              View and manage your datapoints with advanced filtering, sorting,
              and pagination.
            </p>
            <Link
              href="/data"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              View Data Table
            </Link>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Audio Assignments</h2>
            <p className="text-muted-foreground mb-4">
              Browse and manage your microtask audio assignments with
              pagination.
            </p>
            <Link
              href="/audio"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              View Audio Assignments
            </Link>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Features</h2>
            <ul className="text-muted-foreground space-y-1">
              <li>• Advanced filtering</li>
              <li>• Column sorting</li>
              <li>• Row selection</li>
              <li>• Column visibility</li>
              <li>• Pagination</li>
            </ul>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">API Integration</h2>
            <p className="text-muted-foreground">
              Connect to your FastAPI backend for real-time data updates.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
