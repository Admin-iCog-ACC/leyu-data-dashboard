"use client";

import { useState, useEffect } from "react";
import { columns, Datapoint } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { RefreshCw, Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";

// API base URL - loaded from environment variable (see .env.local)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export default function DatapointsPage() {
  const [data, setData] = useState<Datapoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [pageSize, setPageSize] = useState(100); // Default to first 100 items
  const [totalCount, setTotalCount] = useState(0);

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  // Fetch data from API with pagination
  const fetchData = async () => {
    try {
      setLoading(true);
      console.log(
        "🔄 Fetching data from:",
        `${API_BASE_URL}/datapoints-with-count?skip=0&limit=${pageSize}`
      );

      const response = await fetch(
        `${API_BASE_URL}/datapoints-with-count?skip=0&limit=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📡 Response status:", response.status);
      console.log(
        "📡 Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error Response:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("✅ Data fetched successfully:", result.length, "items");

      // Handle different API response formats
      if (Array.isArray(result)) {
        setData(result);
        setTotalCount(result.length);
      } else if (result.data && result.total_count) {
        setData(result.data);
        setTotalCount(result.total_count);
      } else {
        setData(result);
        setTotalCount(result.length);
      }

      toast.success(
        `Loaded ${
          Array.isArray(result)
            ? result.length
            : result.data?.length || result.length
        } datapoints`
      );
    } catch (error) {
      console.error("❌ Error fetching data:", error);

      // More specific error messages
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error("🌐 Network error - Is the FastAPI server running?");
        toast.error(
          "Network error: Is the FastAPI server running on port 8000?"
        );
      } else {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error(`Failed to fetch data: ${errorMessage}`);
      }

      // Clear data on error instead of using fallback
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Sync data with backend
  const handleSync = async () => {
    try {
      setSyncing(true);
      console.log("🔄 Starting sync with:", `${API_BASE_URL}/run-once`);

      const response = await fetch(`${API_BASE_URL}/run-once`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Sync response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Sync API Error Response:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("✅ Sync completed:", result);
      toast.success("Data synchronized successfully");

      // Refresh data after sync
      await fetchData();
    } catch (error) {
      console.error("❌ Error syncing data:", error);

      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error("🌐 Network error - Is the FastAPI server running?");
        toast.error(
          "Network error: Is the FastAPI server running on port 8000?"
        );
      } else {
        toast.error(
          `Failed to sync data: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    } finally {
      setSyncing(false);
    }
  };

  // Test API connection
  const testConnection = async () => {
    try {
      console.log("🧪 Testing API connection...");
      const response = await fetch(`${API_BASE_URL}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("🧪 Test response status:", response.status);
      if (response.ok) {
        toast.success("API connection successful!");
      } else {
        toast.error(`API returned status ${response.status}`);
      }
    } catch (error) {
      console.error("🧪 Connection test failed:", error);
      toast.error("Cannot connect to API server");
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageSize]);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-4">
        <Link href="/">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Datapoints</h1>
            <p className="text-muted-foreground">
              Manage and view your datapoints with advanced filtering, sorting,
              and pagination.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  Show {pageSize} items
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                  value={String(pageSize)}
                  onValueChange={(v) => handlePageSizeChange(Number(v))}
                >
                  <DropdownMenuRadioItem value="100">
                    First 100 items
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="500">
                    First 500 items
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="1000">
                    First 1000 items
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2"
            >
              {syncing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {syncing ? "Syncing..." : "Sync Data"}
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading data...</span>
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
}
