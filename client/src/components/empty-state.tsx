import { ReactNode } from "react";
import { LucideIcon, FileQuestion, Users, FileText, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  action,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center" data-testid="empty-state">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 max-w-md mb-4">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} data-testid="empty-state-action">
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
}

export function NoDataEmptyState({ type }: { type: "users" | "documents" | "leads" | "records" }) {
  const configs = {
    users: {
      icon: Users,
      title: "No users found",
      description: "There are no users matching your criteria.",
    },
    documents: {
      icon: FileText,
      title: "No documents yet",
      description: "Documents will appear here once they're created.",
    },
    leads: {
      icon: Inbox,
      title: "No leads yet",
      description: "New leads will appear here when submitted.",
    },
    records: {
      icon: FileQuestion,
      title: "No records found",
      description: "There are no records to display.",
    },
  };

  const config = configs[type];
  return <EmptyState icon={config.icon} title={config.title} description={config.description} />;
}

export default EmptyState;
