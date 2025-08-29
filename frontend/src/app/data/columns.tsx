"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Datapoint = {
  id: string;
  data: {
    answer: string;
  };
  count: number;
  accepted: number;
};

export const columns: ColumnDef<Datapoint>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return <div className="font-mono text-sm">{id.slice(0, 8)}...</div>;
    },
  },
  {
    id: "answer",
    accessorKey: "data.answer",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Answer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const answer = row.original.data.answer;
      const truncated =
        answer.length > 100 ? answer.slice(0, 100) + "..." : answer;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="max-w-md truncate cursor-pointer"
              style={{ maxWidth: 320 }}
            >
              {truncated}
            </div>
          </TooltipTrigger>
          <TooltipContent>{answer}</TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "count",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Count
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const count = row.getValue("count") as number;
      return <div className="text-center font-medium">{count}</div>;
    },
  },
  {
    accessorKey: "accepted",
    header: "Status",
    cell: ({ row }) => {
      const accepted = row.getValue("accepted") as number;
      return (
        <Badge variant={accepted === 1 ? "default" : "secondary"}>
          {accepted === 1 ? "Accepted" : "Pending"}
        </Badge>
      );
    },
  },
];
