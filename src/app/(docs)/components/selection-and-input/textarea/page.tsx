"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { ComponentSection } from "@/components/docs/component-section";
import type { PropDef } from "@/components/docs/props-table";

const PROPS: PropDef[] = [
  { name: "label",     type: "string",  description: "Label text displayed above the textarea." },
  { name: "hint",      type: "string",  description: "Helper text below the textarea." },
  { name: "error",     type: "string",  description: "Error message. Replaces hint and sets error styles." },
  { name: "rows",      type: "number",  default: "3",     description: "Number of visible text rows." },
  { name: "disabled",  type: "boolean", default: "false", description: "Disables the textarea." },
  { name: "className", type: "string",  description: "Additional CSS classes on the wrapper." },
];

export default function TextareaPage() {
  return (
    <ComponentSection
      name="Textarea"
      status="stable"
      description="A multi-line text input. Shares the same label/hint/error API as Input."
      breadcrumb={[
        { label: "Home",               href: "/" },
        { label: "Components",         href: "/components" },
        { label: "Selection and input", href: "/components" },
      ]}
      examples={[
        {
          label: "Default",
          preview: <div className="w-64"><Textarea placeholder="Enter text..." /></div>,
          code: `<Textarea placeholder="Enter text..." />`,
        },
        {
          label: "With label",
          preview: <div className="w-64"><Textarea label="Description" hint="Max 500 characters." placeholder="Describe your product..." /></div>,
          code: `<Textarea label="Description" hint="Max 500 characters." />`,
        },
        {
          label: "Error state",
          preview: <div className="w-64"><Textarea label="Bio" error="Bio is required." /></div>,
          code: `<Textarea label="Bio" error="Bio is required." />`,
        },
        {
          label: "Custom rows",
          preview: <div className="w-64"><Textarea label="Notes" rows={6} placeholder="Add notes..." /></div>,
          code: `<Textarea rows={6} placeholder="Add notes..." />`,
        },
        {
          label: "Disabled",
          preview: <div className="w-64"><Textarea label="Archived" disabled defaultValue="This field is locked." /></div>,
          code: `<Textarea disabled defaultValue="This field is locked." />`,
        },
      ]}
      props={PROPS}
      dos={[
        { label: "Use Textarea for open-ended multi-line input like descriptions or notes." },
      ]}
      donts={[
        { label: "Don't use Textarea in place of Input for short single-line fields." },
      ]}
      accessibility={{
        labeling: "The label prop renders an associated <label>. Always provide a label or aria-label.",
        keyboardSupport: [
          "Tab / Shift+Tab — move focus into and out of the field",
          "Enter — inserts a newline (native browser behavior)",
        ],
      }}
      relatedComponents={[
        { label: "Input",  href: "/components/selection-and-input/input" },
        { label: "Select", href: "/components/selection-and-input/select" },
      ]}
    />
  );
}
