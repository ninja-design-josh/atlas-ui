"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import type { CardPadding, CardElevation } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ComponentSection, DocSubheading } from "@/components/docs/component-section";
import { LivePreview } from "@/components/docs/live-preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable, type PropDef } from "@/components/docs/props-table";

const IMPORT = `import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";`;

const USAGE = `// Basic card
<Card>
  <p>Card content goes here.</p>
</Card>

// With subcomponents
<Card elevation={1}>
  <CardHeader>
    <CardTitle>Project Alpha</CardTitle>
    <CardDescription>Created Jan 12, 2025</CardDescription>
  </CardHeader>
  <p className="text-sm text-grey-70">
    A new initiative to streamline onboarding flows.
  </p>
  <CardFooter>
    <Button variant="outlined" color="secondary" size="sm">View</Button>
    <Button variant="solid" color="primary" size="sm">Edit</Button>
  </CardFooter>
</Card>

// Elevation levels
<Card elevation={0}>Flat (0)</Card>
<Card elevation={1}>Raised (1)</Card>
<Card elevation={2}>Elevated (2)</Card>
<Card elevation={4}>Floating (4)</Card>`;

const COMPOSITION = `// Entity card: Card + Avatar + Badge + Button
<Card elevation={1}>
  <CardHeader>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar initials="AB" size="md" />
        <div>
          <CardTitle>Alicia Brown</CardTitle>
          <CardDescription>Product Designer</CardDescription>
        </div>
      </div>
      <Badge variant="success" dot>Active</Badge>
    </div>
  </CardHeader>
  <CardFooter>
    <Button variant="ghost" color="secondary" size="sm">Message</Button>
    <Button variant="outlined" color="primary" size="sm">View Profile</Button>
  </CardFooter>
</Card>`;

const PROPS: PropDef[] = [
  { name: "padding",   type: '"none" | "sm" | "md" | "lg"', default: '"md"',  description: "Internal padding of the card." },
  { name: "border",    type: "boolean",                      default: "true",  description: "Shows a 1px border around the card." },
  { name: "elevation", type: "0 | 1 | 2 | 4 | 8",           default: "0",     description: "MUI-style box-shadow depth. 0 = flat, 8 = highest elevation." },
  { name: "children",  type: "ReactNode",                    required: true,   description: "Card content." },
];

export default function CardPage() {
  return (
    <ComponentSection
      id="card"
      name="Card"
      status="stable"
      description="A surface container for grouping related content. Use the CardHeader, CardTitle, CardDescription, and CardFooter subcomponents for consistent layout."
      whenToUse={[
        "Use to visually group content that belongs together (settings sections, list items, entity details).",
        "Use elevation > 0 when the card must stand out from a grey or surface-subtle background.",
        "Combine with Badge and Avatar in CardHeader for entity cards (user profiles, projects, integrations).",
      ]}
      controlDefs={[
        { prop: "padding",   type: "enum",    options: ["none","sm","md","lg"], default: "md" },
        { prop: "border",    type: "boolean",                                    default: true },
        { prop: "elevation", type: "enum",    options: ["0","1","2","4","8"],    default: "0" },
      ]}
      renderPreview={(p) => (
        <Card padding={p.padding as CardPadding} border={p.border as boolean} elevation={Number(p.elevation) as CardElevation}>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Supporting description text.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outlined" color="secondary" size="sm">Cancel</Button>
            <Button variant="solid" color="primary" size="sm">Save</Button>
          </CardFooter>
        </Card>
      )}
    >
      <div>
        <DocSubheading>Elevation levels</DocSubheading>
        <LivePreview centered={false} className="bg-grey-5 dark:bg-grey-120">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 w-full">
            {([0, 1, 2, 4] as const).map((level) => (
              <Card key={level} elevation={level} className="text-center">
                <p className="text-sm font-semibold text-grey-100 dark:text-grey-10">elevation={level}</p>
                <p className="text-caption text-grey-50 mt-1">
                  {level === 0 ? "Flat" : level === 1 ? "Raised" : level === 2 ? "Elevated" : "Floating"}
                </p>
              </Card>
            ))}
          </div>
        </LivePreview>
      </div>

      <div>
        <DocSubheading>Entity card</DocSubheading>
        <LivePreview>
          <Card elevation={1} className="w-72">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar initials="AB" size="md" />
                  <div>
                    <CardTitle>Alicia Brown</CardTitle>
                    <CardDescription>Product Designer</CardDescription>
                  </div>
                </div>
                <Badge variant="success" dot>Active</Badge>
              </div>
            </CardHeader>
            <CardFooter>
              <Button variant="ghost" color="secondary" size="sm">Message</Button>
              <Button variant="outlined" color="primary" size="sm">View Profile</Button>
            </CardFooter>
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
