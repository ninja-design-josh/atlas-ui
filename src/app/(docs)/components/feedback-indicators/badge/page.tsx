"use client";

import { Badge } from "@/components/ui/badge";
import type { BadgeVariant, BadgeSize } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ComponentSection, DocSubheading } from "@/components/docs/component-section";
import { LivePreview } from "@/components/docs/live-preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable, type PropDef } from "@/components/docs/props-table";

const IMPORT = `import { Badge } from "@/components/ui/badge";`;

const USAGE = `// Variants
<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="purple">Purple</Badge>

// With dot indicator
<Badge variant="success" dot>Active</Badge>
<Badge variant="error" dot>Failed</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>`;

const COMPOSITION = `// Status badge in Card header
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>API Integration</CardTitle>
      <Badge variant="success" dot>Connected</Badge>
    </div>
    <CardDescription>Last synced 2 minutes ago.</CardDescription>
  </CardHeader>
</Card>`;

const PROPS: PropDef[] = [
  { name: "variant",  type: '"default" | "success" | "warning" | "error" | "info" | "purple"', default: '"default"', description: "Color scheme of the badge." },
  { name: "size",     type: '"sm" | "md"', default: '"md"', description: "Padding and text size." },
  { name: "dot",      type: "boolean",     default: "false", description: "Shows a colored dot before the label." },
  { name: "children", type: "ReactNode",   required: true,   description: "Badge label content." },
];

export default function BadgePage() {
  return (
    <ComponentSection
      id="badge"
      name="Badge"
      status="stable"
      description="A small label for surfacing status, categories, or counts. Renders inline; use inside Card headers, list rows, or next to Avatars."
      whenToUse={[
        "Use to communicate the status of an item (active, failed, pending).",
        "Use the dot variant for a status indicator paired with a short label.",
        "Keep badge labels short — 1 to 3 words maximum.",
      ]}
      controlDefs={[
        { prop: "variant", type: "enum",    options: ["default","success","warning","error","info","purple"], default: "success" },
        { prop: "size",    type: "enum",    options: ["sm","md"],                                              default: "md" },
        { prop: "dot",     type: "boolean",                                                                    default: false },
        { prop: "label",   type: "string",                                                                     default: "Active" },
      ]}
      renderPreview={(p) => (
        <Badge variant={p.variant as BadgeVariant} size={p.size as BadgeSize} dot={p.dot as boolean}>
          {p.label as string}
        </Badge>
      )}
    >
      <div>
        <DocSubheading>Variants</DocSubheading>
        <LivePreview>
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="purple">Purple</Badge>
        </LivePreview>
      </div>

      <div>
        <DocSubheading>With dot · sizes</DocSubheading>
        <LivePreview>
          <Badge variant="success" dot>Active</Badge>
          <Badge variant="error" dot>Failed</Badge>
          <Badge variant="warning" dot>Pending</Badge>
          <Badge variant="info" size="sm">Small</Badge>
          <Badge variant="default" size="md">Medium</Badge>
        </LivePreview>
      </div>

      <div>
        <DocSubheading>Composition — card header</DocSubheading>
        <LivePreview>
          <Card elevation={1} className="w-72">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>API Integration</CardTitle>
                <Badge variant="success" dot>Connected</Badge>
              </div>
              <CardDescription>Last synced 2 minutes ago.</CardDescription>
            </CardHeader>
          </Card>
        </LivePreview>
      </div>

      <div>
        <DocSubheading>Import</DocSubheading>
        <CodeBlock code={IMPORT} language="tsx" />
      </div>
      <div>
        <DocSubheading>Usage</DocSubheading>
        <CodeBlock code={USAGE} language="tsx" />
      </div>
      <div>
        <DocSubheading>Props</DocSubheading>
        <PropsTable props={PROPS} />
      </div>
      <div>
        <DocSubheading>Composition</DocSubheading>
        <CodeBlock code={COMPOSITION} language="tsx" />
      </div>
    </ComponentSection>
  );
}
