"use client";

import * as React from "react";
import { Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentSection } from "@/components/docs/component-section";
import type { PropDef } from "@/components/docs/props-table";

const PROPS: PropDef[] = [
  { name: "variant",  type: '"solid" | "outlined" | "ghost"',    default: '"solid"',   description: "Visual style of the button." },
  { name: "color",    type: '"primary" | "secondary" | "danger"', default: '"primary"', description: "Semantic color role." },
  { name: "size",     type: '"sm" | "md" | "lg"',                default: '"md"',      description: "Height and padding." },
  { name: "loading",  type: "boolean",                            default: "false",     description: "Shows a spinner and disables the button." },
  { name: "disabled", type: "boolean",                            default: "false",     description: "Disables interaction." },
  { name: "leftIcon", type: "ReactNode",                                                description: "Icon rendered before the label." },
  { name: "rightIcon",type: "ReactNode",                                                description: "Icon rendered after the label." },
  { name: "children", type: "ReactNode",                          required: true,       description: "Button label." },
];

export default function ButtonPage() {
  return (
    <ComponentSection
      name="Button"
      status="stable"
      description="Buttons are used primarily for actions, such as Add, Close, Cancel, or Save. Use variant and color props to communicate the visual weight and intent of the action."
      breadcrumb={[
        { label: "Home",       href: "/" },
        { label: "Components", href: "/components" },
        { label: "Actions",    href: "/components" },
      ]}
      examples={[
        {
          label: "Default",
          description: "Use solid/primary for the main CTA. Only one per page or form.",
          preview: <Button variant="solid" color="primary">Add product</Button>,
          code: `<Button variant="solid" color="primary">Add product</Button>`,
        },
        {
          label: "Secondary",
          description: "Use solid/secondary for supporting actions next to a primary.",
          preview: <div className="flex gap-3"><Button variant="solid" color="primary">Save</Button><Button variant="solid" color="secondary">Cancel</Button></div>,
          code: `<Button variant="solid" color="secondary">Cancel</Button>`,
        },
        {
          label: "Outlined",
          description: "Use outlined for secondary emphasis actions.",
          preview: <div className="flex gap-3"><Button variant="outlined" color="primary">View details</Button><Button variant="outlined" color="secondary">Export</Button></div>,
          code: `<Button variant="outlined" color="primary">View details</Button>`,
        },
        {
          label: "Ghost",
          description: "Use ghost for tertiary, low-emphasis actions.",
          preview: <div className="flex gap-3"><Button variant="ghost" color="primary">Learn more</Button><Button variant="ghost" color="secondary">Reset</Button></div>,
          code: `<Button variant="ghost" color="secondary">Reset</Button>`,
        },
        {
          label: "Danger",
          description: "Use color=danger only for destructive, irreversible actions.",
          preview: <div className="flex gap-3"><Button variant="solid" color="danger">Delete</Button><Button variant="outlined" color="danger">Remove</Button></div>,
          code: `<Button variant="solid" color="danger">Delete account</Button>`,
        },
        {
          label: "Sizes",
          description: "Three sizes — sm, md (default), lg.",
          preview: <div className="flex items-center gap-3"><Button size="sm">Small</Button><Button size="md">Medium</Button><Button size="lg">Large</Button></div>,
          code: `<Button size="sm">Small</Button>\n<Button size="md">Medium</Button>\n<Button size="lg">Large</Button>`,
        },
        {
          label: "Loading state",
          description: "Shows a spinner and disables interaction while an action is processing.",
          preview: <Button loading>Saving…</Button>,
          code: `<Button loading>Saving…</Button>`,
        },
        {
          label: "With icon",
          description: "Use leftIcon or rightIcon to add a Lucide icon.",
          preview: <div className="flex gap-3"><Button leftIcon={<Plus className="h-4 w-4" />}>Add item</Button><Button variant="outlined" color="primary" rightIcon={<ChevronRight className="h-4 w-4" />}>Continue</Button></div>,
          code: `<Button leftIcon={<Plus className="h-4 w-4" />}>Add item</Button>\n<Button rightIcon={<ChevronRight className="h-4 w-4" />}>Continue</Button>`,
        },
        {
          label: "Disabled state",
          preview: <div className="flex gap-3"><Button disabled>Disabled</Button><Button variant="outlined" color="primary" disabled>Disabled</Button></div>,
          code: `<Button disabled>Disabled</Button>`,
        },
      ]}
      props={PROPS}
      dos={[
        { label: "Use solid/primary for the single main CTA on a page or form.", preview: <Button variant="solid" color="primary">Save changes</Button> },
        { label: "Pair outlined/primary with solid/primary for cancel actions.", preview: <div className="flex gap-2"><Button variant="outlined" color="primary">Cancel</Button><Button variant="solid" color="primary">Save</Button></div> },
      ]}
      donts={[
        { label: "Don't place two solid/primary buttons side by side.", preview: <div className="flex gap-2"><Button variant="solid" color="primary">Save</Button><Button variant="solid" color="primary">Delete</Button></div> },
        { label: "Don't use danger color for non-destructive actions.", preview: <Button variant="solid" color="danger">Save profile</Button> },
      ]}
      accessibility={{
        description: "Buttons use native <button> elements for built-in keyboard and screen reader support.",
        labeling: "Always provide a descriptive label via children. If the button is icon-only, add an aria-label.",
        keyboardSupport: [
          "Tab / Shift+Tab — move focus to or away from the button",
          "Enter or Space — activate the button",
        ],
      }}
      relatedComponents={[
        { label: "Button group", href: "/components/actions/button-group" },
      ]}
    />
  );
}
