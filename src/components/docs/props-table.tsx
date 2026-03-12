import * as React from "react";
import { cn } from "@/lib/utils";

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

interface PropsTableProps {
  props: PropDef[];
  className?: string;
}

export function PropsTable({ props, className }: PropsTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-sm border border-grey-10 dark:border-grey-90", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-grey-5 dark:bg-grey-110">
            <th className="text-left px-4 py-2.5 font-semibold text-grey-100 dark:text-grey-10 border-b border-grey-10 dark:border-grey-90 whitespace-nowrap">Prop</th>
            <th className="text-left px-4 py-2.5 font-semibold text-grey-100 dark:text-grey-10 border-b border-grey-10 dark:border-grey-90">Type</th>
            <th className="text-left px-4 py-2.5 font-semibold text-grey-100 dark:text-grey-10 border-b border-grey-10 dark:border-grey-90 whitespace-nowrap">Default</th>
            <th className="text-left px-4 py-2.5 font-semibold text-grey-100 dark:text-grey-10 border-b border-grey-10 dark:border-grey-90">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                "border-b border-grey-10 dark:border-grey-90 last:border-0",
                index % 2 === 0 ? "bg-white dark:bg-grey-110" : "bg-grey-2 dark:bg-grey-120"
              )}
            >
              <td className="px-4 py-2.5 whitespace-nowrap">
                <code className="font-mono text-blue-100 dark:text-blue-50 text-xs">
                  {prop.name}
                  {prop.required && <span className="text-red-100 ml-0.5">*</span>}
                </code>
              </td>
              <td className="px-4 py-2.5">
                <code className="font-mono text-purple-100 dark:text-purple-50 text-xs">{prop.type}</code>
              </td>
              <td className="px-4 py-2.5 whitespace-nowrap">
                {prop.default ? (
                  <code className="font-mono text-grey-70 dark:text-grey-50 text-xs">{prop.default}</code>
                ) : (
                  <span className="text-grey-30 dark:text-grey-70">—</span>
                )}
              </td>
              <td className="px-4 py-2.5 text-grey-70 dark:text-grey-50 text-caption">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
