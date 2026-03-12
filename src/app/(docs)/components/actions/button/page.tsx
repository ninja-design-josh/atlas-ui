"use client";

import * as React from "react";
import { Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ButtonVariant, ButtonColor, ButtonSize } from "@/components/ui/button";
import { ComponentSection, DocSubheading } from "@/components/docs/component-section";
import { LivePreview } from "@/components/docs/live-preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable, type PropDef } from "@/components/docs/props-table";

const IMPORT = `import { Button } from "@/components/ui/button";`;

const USAGE = `// Solid (default) — use for primary actions
<Button variant="solid" color="primary">Save Changes</Button>
<Button variant="solid" color="secondary">Cancel</Button>
<Button variant="solid" color="danger">Delete</Button>

// Outlined — use for secondary actions alongside a primary
<Button variant="outlined" color="primary">View Details</Button>

// Ghost — use for low-emphasis, tertiary actions
<Button variant="ghost" color="secondary">Reset</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// With icons
<Button leftIcon={<Plus />}>Add Item</Button>
<Button rightIcon={<ChevronRight />}>Continue</Button>

// Loading state — disables button and shows spinner
<Button loading>Saving...</Button>`;

const COMPOSITION = `// Confirm dialog footer
<CardFooter>
  <Button variant="outlined" color="secondary">Cancel</Button>
  <Button variant="solid" color="primary">Confirm</Button>
</CardFooter>

// Danger action with badge count
<div className="flex items-center gap-2">
  <Badge variant="error">3 errors</Badge>
  <Button variant="solid" color="danger" size="sm">Fix All</Button>
</div>`;

const PROPS: PropDef[] = [
  { name: "variant",  type: '"solid" | "outlined" | "ghost"',         default: '"solid"',   description: "Visual style of the button." },
  { name: "color",    type: '"primary" | "secondary" | "danger"',      default: '"primary"', description: "Color scheme applied to the variant." },
  { name: "size",     type: '"sm" | "md" | "lg"',                      default: '"md"',      description: "Height and padding of the button." },
  { name: "loading",  type: "boolean",                                  default: "false",     description: "Shows a spinner and disables the button." },
  { name: "disabled", type: "boolean",                                  default: "false",     description: "Disables interaction. Uses grey-60 fill, not opacity." },
  { name: "leftIcon", type: "ReactNode",                                                      description: "Icon rendered before the label text." },
  { name: "rightIcon",type: "ReactNode",                                                      description: "Icon rendered after the label text." },
  { name: "children", type: "ReactNode",                                required: true,       description: "Button label." },
];

export default function ButtonPage() {
  return (
    <ComponentSection
      id="button"
      name="Button"
      status="stable"
      description="A clickable element that triggers an action or navigation. Supports three visual styles and three semantic color schemes."
      whenToUse={[
        "Use for any clickable action that changes state or navigates",
        "Use solid/primary for the single main CTA on a page or form",
        "Use outlined/primary alongside a primary action (e.g. Cancel next to Save)",
        "Use ghost for low-emphasis or tertiary actions",
      ]}
      controlDefs={[
        { prop: "variant",  type: "enum",    options: ["solid","outlined","ghost"],    default: "solid" },
        { prop: "color",    type: "enum",    options: ["primary","secondary","danger"], default: "primary" },
        { prop: "size",     type: "enum",    options: ["sm","md","lg"],                 default: "md" },
        { prop: "loading",  type: "boolean",                                            default: false },
        { prop: "disabled", type: "boolean",                                            default: false },
        { prop: "children", type: "string",                                             default: "Click me" },
      ]}
      renderPreview={(p) => (
        <Button
          variant={p.variant as ButtonVariant}
          color={p.color as ButtonColor}
          size={p.size as ButtonSize}
          loading={p.loading as boolean}
          disabled={p.disabled as boolean}
        >
          {p.children as string}
        </Button>
      )}
      dos={[
        { label: "Use solid/primary for the main CTA", preview: <Button variant="solid" color="primary">Save Changes</Button> },
        { label: "Use outlined/primary for cancel", preview: <Button variant="outlined" color="primary">Cancel</Button> },
      ]}
      donts={[
        { label: "Don't use two solid/primary buttons side by side", preview: <div className="flex gap-2"><Button variant="solid" color="primary">Save</Button><Button variant="solid" color="primary">Delete</Button></div> },
        { label: "Don't use danger for non-destructive actions", preview: <Button variant="solid" color="danger">Save Profile</Button> },
      ]}
    >
      <div>
        <DocSubheading>All variants</DocSubheading>
        <LivePreview label="Preview" centered={false}>
          <div className="space-y-3 p-2">
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="solid" color="primary">Primary</Button>
              <Button variant="solid" color="secondary">Secondary</Button>
              <Button variant="solid" color="danger">Danger</Button>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="outlined" color="primary">Primary</Button>
              <Button variant="outlined" color="secondary">Secondary</Button>
              <Button variant="outlined" color="danger">Danger</Button>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="ghost" color="primary">Primary</Button>
              <Button variant="ghost" color="secondary">Secondary</Button>
              <Button variant="ghost" color="danger">Danger</Button>
            </div>
          </div>
        </LivePreview>
      </div>

      <div>
        <DocSubheading>Sizes · loading · icons</DocSubheading>
        <LivePreview centered={false}>
          <div className="space-y-3 p-2">
            <div className="flex flex-wrap gap-3 items-center">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <Button loading>Saving...</Button>
              <Button leftIcon={<Plus className="h-[18px] w-[18px]" />}>Add Item</Button>
              <Button variant="outlined" color="primary" rightIcon={<ChevronRight className="h-[18px] w-[18px]" />}>Continue</Button>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <Button disabled>Disabled</Button>
              <Button variant="outlined" color="primary" disabled>Disabled</Button>
            </div>
          </div>
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
