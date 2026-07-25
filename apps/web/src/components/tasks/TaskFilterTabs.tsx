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
    <div className="mb-6 w-full">
      <Tabs className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-auto p-1 bg-[var(--surface-1)] border border-[var(--hairline)] rounded-lg">
          <TabsTrigger
            active={filter === "all"}
            onClick={() => onFilterChange("all")}
            className="w-full text-xs sm:text-sm font-semibold py-2.5 px-3 flex items-center justify-center text-center"
          >
            Todas ({totalCount})
          </TabsTrigger>
          <TabsTrigger
            active={filter === "pending"}
            onClick={() => onFilterChange("pending")}
            className="w-full text-xs sm:text-sm font-semibold py-2.5 px-3 flex items-center justify-center text-center"
          >
            Pendentes ({pendingCount})
          </TabsTrigger>
          <TabsTrigger
            active={filter === "done"}
            onClick={() => onFilterChange("done")}
            className="w-full text-xs sm:text-sm font-semibold py-2.5 px-3 flex items-center justify-center text-center"
          >
            Concluídas ({doneCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
