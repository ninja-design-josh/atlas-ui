"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { ComponentSection } from "@/components/docs/component-section";
import type { PropDef } from "@/components/docs/props-table";

const PROPS: PropDef[] = [
  { name: "variant", type: '"default" | "success" | "warning" | "error" | "info" | "purple"', default: '"default"', description: "Semantic color variant." },
  { name: "size",    type: '"sm" | "md"',                                                       default: '"md"',      description: "Badge size." },
  { name: "dot",     type: "boolean",                                                            default: "false",     description: "Shows a colored dot indicator before the label." },
  { name: "status",  type: "boolean",                                                            default: "false",     description: "Adds role='status' for live-region announcements." },
  { name: "children",type: "ReactNode",                                                          required: true,       description: "Badge label text." },
];

export default function BadgePage() {
  return (
    <ComponentSection
      name="Badge"
      status="stable"
      description="A small label used to communicate status, category, or count. Six semantic variants cover the most common feedback states."
      breadcrumb={[
        { label: "Home",                href: "/" },
        { label: "Components",          href: "/components" },
        { label: "Feedback indicators", href: "/components" },
      ]}
      examples={[
        {
          label: "Default",
          preview: <Badge>Default</Badge>,
          code: `<Badge>Default</Badge>`,
        },
        {
          label: "All variants",
          preview: (
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="purple">Purple</Badge>
            </div>
          ),
          code: `<Badge variant="success">Success</Badge>\n<Badge variant="warning">Warning</Badge>\n<Badge variant="error">Error</Badge>`,
        },
        {
          label: "With dot",
          preview: (
            <div className="flex flex-wrap gap-2">
              <Badge variant="success" dot>Active</Badge>
              <Badge variant="warning" dot>Pending</Badge>
              <Badge variant="error" dot>Failed</Badge>
            </div>
          ),
          code: `<Badge variant="success" dot>Active</Badge>`,
        },
        {
          label: "Sizes",
          preview: (
            <div className="flex items-center gap-3">
              <Badge size="sm" variant="success">Small</Badge>
              <Badge size="md" variant="success">Medium</Badge>
            </div>
          ),
          code: `<Badge size="sm">Small</Badge>\n<Badge size="md">Medium</Badge>`,
        },
        {
          label: "Live region",
          description: "Use the status prop when badge content updates dynamically — it adds role='status' for screen reader announcements.",
          preview: <Badge variant="error" status>3 errors</Badge>,
          code: `<Badge variant="error" status>3 errors</Badge>`,
        },
      ]}
      props={PROPS}
      dos={[
        { label: "Use semantic variants that match the nature of the status (error for failures, success for completions)." },
      ]}
      donts={[
        { label: "Don't use error variant for warnings or info — use the correct semantic variant." },
      ]}
      accessibility={{
        labeling: "Badge text is read by screen readers inline. Use the status prop for dynamically updated badges.",
        keyboardSupport: [],
      }}
      relatedComponents={[
        { label: "Button", href: "/components/actions/button" },
      ]}
    />
  );
}
