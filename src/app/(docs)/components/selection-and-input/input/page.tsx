"use client";

import * as React from "react";
import { Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ComponentSection } from "@/components/docs/component-section";
import type { PropDef } from "@/components/docs/props-table";

const PROPS: PropDef[] = [
  { name: "label",       type: "string",    description: "Label text displayed above the input." },
  { name: "hint",        type: "string",    description: "Helper text below the input." },
  { name: "error",       type: "string",    description: "Error message. Replaces hint and sets error styles." },
  { name: "leadingIcon", type: "ReactNode", description: "Icon rendered inside the left edge of the input." },
  { name: "trailingIcon",type: "ReactNode", description: "Icon rendered inside the right edge of the input." },
  { name: "disabled",    type: "boolean",   default: "false", description: "Disables the input." },
  { name: "className",   type: "string",    description: "Additional CSS classes on the wrapper." },
];

export default function InputPage() {
  return (
    <ComponentSection
      name="Input"
      status="stable"
      description="A single-line text input with support for labels, hints, error states, and leading/trailing icons."
      breadcrumb={[
        { label: "Home",               href: "/" },
        { label: "Components",         href: "/components" },
        { label: "Selection and input", href: "/components" },
      ]}
      examples={[
        {
          label: "Default",
          preview: <div className="w-64"><Input placeholder="Enter value" /></div>,
          code: `<Input placeholder="Enter value" />`,
        },
        {
          label: "With label and hint",
          preview: <div className="w-64"><Input label="Email" hint="We'll never share your email." placeholder="you@example.com" /></div>,
          code: `<Input label="Email" hint="We'll never share your email." placeholder="you@example.com" />`,
        },
        {
          label: "Error state",
          preview: <div className="w-64"><Input label="Username" error="Username is already taken." defaultValue="johnsmith" /></div>,
          code: `<Input label="Username" error="Username is already taken." />`,
        },
        {
          label: "With leading icon",
          preview: <div className="w-64"><Input leadingIcon={<Search className="h-4 w-4" />} placeholder="Search..." /></div>,
          code: `<Input leadingIcon={<Search className="h-4 w-4" />} placeholder="Search..." />`,
        },
        {
          label: "With trailing icon",
          preview: <div className="w-64"><Input trailingIcon={<Eye className="h-4 w-4" />} type="password" placeholder="Password" /></div>,
          code: `<Input trailingIcon={<Eye className="h-4 w-4" />} type="password" placeholder="Password" />`,
        },
        {
          label: "Disabled",
          preview: <div className="w-64"><Input label="Read only" disabled defaultValue="Cannot edit" /></div>,
          code: `<Input disabled defaultValue="Cannot edit" />`,
        },
      ]}
      props={PROPS}
      dos={[
        { label: "Always include a visible label — don't rely on placeholder alone." },
        { label: "Use the error prop for validation feedback, not a separate element." },
      ]}
      donts={[
        { label: "Don't use Input for multi-line text — use Textarea instead." },
      ]}
      accessibility={{
        labeling: "The label prop renders a <label> element associated with the input via htmlFor/id. Placeholder text is not a label substitute.",
        keyboardSupport: [
          "Tab / Shift+Tab — move focus into and out of the field",
        ],
      }}
      relatedComponents={[
        { label: "Textarea", href: "/components/selection-and-input/textarea" },
        { label: "Select",   href: "/components/selection-and-input/select" },
      ]}
    />
  );
}
