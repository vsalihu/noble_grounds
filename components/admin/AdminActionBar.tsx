"use client";

import { FolderKanban, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

type AdminActionBarProps = {
  isAddingProject: boolean;
  onAddProject: () => void;
  onManageProjects: () => void;
  onRefresh: () => void;
};

export function AdminActionBar({
  isAddingProject,
  onAddProject,
  onManageProjects,
  onRefresh,
}: AdminActionBarProps) {
  return (
    <div className="grid gap-2 rounded-lg border border-border-soft bg-ivory p-3 shadow-soft min-[430px]:grid-cols-3">
      <Button
        type="button"
        variant={isAddingProject ? "primary" : "secondary"}
        onClick={onAddProject}
      >
        <Plus className="mr-2 size-4" />
        Add Project
      </Button>
      <Button type="button" variant="secondary" onClick={onManageProjects}>
        <FolderKanban className="mr-2 size-4" />
        Manage Projects
      </Button>
      <Button type="button" variant="secondary" onClick={onRefresh}>
        <RefreshCw className="mr-2 size-4" />
        Refresh
      </Button>
    </div>
  );
}
