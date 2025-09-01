"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

// Types for the microtask assignment
interface MicrotaskAssignment {
  data: {
    duration: number;
    own_access_code: string;
  };
  files: {
    record: string;
  };
}

export default function MicrotaskAssignmentsPage() {
  // State for total duration hours
  const [totalDurationHours, setTotalDurationHours] = useState<number | null>(
    null
  );
  // Fetch total duration hours
  const fetchTotalDuration = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/microtask-assignments/duration-sum`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const result = await response.json();
      setTotalDurationHours(result.total_duration_hours ?? null);
    } catch (error) {
      setTotalDurationHours(null);
    }
  };
  // Pagination state
  const [assignments, setAssignments] = useState<MicrotaskAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch assignments (all, then paginate client-side)
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/microtask-assignments`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      const result = await response.json();
      setAssignments(result.output || []);
      toast.success(`Loaded ${result.output?.length ?? 0} assignments`);
    } catch (error) {
      toast.error(
        `Failed to fetch assignments: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchTotalDuration();
  }, []);

  // Pagination logic
  const totalAssignments = assignments.length;
  const totalPages = Math.ceil(totalAssignments / pageSize) || 1;
  const paginatedAssignments = assignments.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Handlers
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(1); // Reset to first page
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-4">
        <Link href="/">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Microtask Assignments</h1>
      {/* Card for total duration hours */}
      <Card className="mb-6 max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Total Duration (hours)</CardTitle>
        </CardHeader>
        <CardContent>
          {totalDurationHours !== null ? (
            <span className="text-2xl font-bold">{totalDurationHours}</span>
          ) : (
            <span className="text-muted-foreground">Loading...</span>
          )}
        </CardContent>
      </Card>
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading assignments...</span>
        </div>
      ) : assignments.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          No assignments found.
        </div>
      ) : (
        <>
          <div className="flex items-center mb-2 gap-4">
            <span>
              Page {page} of {totalPages}
            </span>
            <label className="flex items-center gap-1">
              Show
              <select
                className="border rounded px-1 py-0.5"
                value={pageSize}
                onChange={handlePageSizeChange}
                disabled={loading}
              >
                {[5, 10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              per page
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Duration (s)</th>
                  <th className="border px-4 py-2">Access Code</th>
                  <th className="border px-4 py-2">Record File</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAssignments.map((a, i) => (
                  <tr key={i + (page - 1) * pageSize}>
                    <td className="border px-4 py-2">{a.data.duration}</td>
                    <td className="border px-4 py-2 font-mono">
                      {a.data.own_access_code}
                    </td>
                    <td className="border px-4 py-2 break-all">
                      {a.files.record}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Button
              onClick={handlePrev}
              disabled={page === 1 || loading}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={page === totalPages || loading}
              variant="outline"
            >
              Next
            </Button>
            <span className="ml-2 text-xs text-muted-foreground">
              Showing {totalAssignments === 0 ? 0 : (page - 1) * pageSize + 1}-
              {Math.min(page * pageSize, totalAssignments)} of{" "}
              {totalAssignments}
            </span>
          </div>
        </>
      )}
      {/* Reload button removed as requested */}
    </div>
  );
}
