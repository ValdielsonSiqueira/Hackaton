import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface TaskFilterTabsProps {
  filter: "all" | "pending" | "done";
  onFilterChange: (filter: "all" | "pending" | "done") => void;
  totalCount: number;
  pendingCount: number;
  doneCount: number;
}

export const TaskFilterTabs: React.FC<TaskFilterTabsProps> = ({
  filter,
  onFilterChange,
  totalCount,
  pendingCount,
  doneCount,
}) => {
  return (
    <div className="mb-6">
      <Tabs>
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex h-auto p-1 bg-[var(--surface-1)] border border-[var(--hairline)]">
          <TabsTrigger
            active={filter === "all"}
            onClick={() => onFilterChange("all")}
            className="text-xs sm:text-sm font-semibold py-2 px-3"
          >
            Todas ({totalCount})
          </TabsTrigger>
          <TabsTrigger
            active={filter === "pending"}
            onClick={() => onFilterChange("pending")}
            className="text-xs sm:text-sm font-semibold py-2 px-3"
          >
            Pendentes ({pendingCount})
          </TabsTrigger>
          <TabsTrigger
            active={filter === "done"}
            onClick={() => onFilterChange("done")}
            className="text-xs sm:text-sm font-semibold py-2 px-3"
          >
            Concluídas ({doneCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
