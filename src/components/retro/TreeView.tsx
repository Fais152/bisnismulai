"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface TreeNode {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  children?: TreeNode[];
  defaultOpen?: boolean;
  status?: "active" | "locked" | "completed" | "default";
}

interface TreeViewProps {
  nodes: TreeNode[];
  activePath?: string;
  onSelect?: (node: TreeNode) => void;
  className?: string;
  level?: number;
}

const STATUS_ICONS: Record<string, string> = {
  completed: "✅",
  active: "▶️",
  locked: "🔒",
  default: "📄",
};

export function TreeView({ nodes, activePath, onSelect, className, level = 0 }: TreeViewProps) {
  return (
    <div className={cn("w-full", className)}>
      {nodes.map(node => (
        <TreeNode
          key={node.id}
          node={node}
          activePath={activePath}
          onSelect={onSelect}
          level={level}
        />
      ))}
    </div>
  );
}

function TreeNode({
  node,
  activePath,
  onSelect,
  level,
}: {
  node: TreeNode;
  activePath?: string;
  onSelect?: (node: TreeNode) => void;
  level: number;
}) {
  const isActive = activePath === node.href || activePath === node.id;
  const statusIcon = node.status ? STATUS_ICONS[node.status] : (node.children ? "📁" : "📄");
  const displayIcon = node.icon ?? statusIcon;

  const content = (
    <div
      className={cn("tree-item", isActive && "active")}
      style={{ paddingLeft: `${level * 16 + 8}px` }}
      onClick={() => onSelect?.(node)}
    >
      <span className="text-base leading-none">{displayIcon}</span>
      <span className="text-[13px]">{node.label}</span>
    </div>
  );

  return (
    <div>
      {node.href && node.status !== "locked" ? (
        <Link href={node.href} className="block no-underline text-inherit hover:no-underline">
          {content}
        </Link>
      ) : (
        content
      )}
      {node.children && (
        <TreeView
          nodes={node.children}
          activePath={activePath}
          onSelect={onSelect}
          level={level + 1}
        />
      )}
    </div>
  );
}
