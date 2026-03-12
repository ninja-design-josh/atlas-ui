"use client";

import * as React from "react";
import { Select } from "@/components/ui/select";
import { ComponentSection } from "@/components/docs/component-section";
import type { PropDef } from "@/components/docs/props-table";

const OPTIONS = [
  { value: "admin",  label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
];

const PROPS: PropDef[] = [
  { name: "options",      type: "{ value: string; label: string }[]", required: true, description: "List of options to display." },
  { name: "label",        type: "string",  description: "Label text above the select." },
  { name: "placeholder",  type: "string",  description: "Placeholder option shown when no value is selected." },
  { name: "hint",         type: "string",  description: "Helper text below the select." },
  { name: "error",        type: "string",  description: "Error message. Replaces hint and sets error styles." },
  { name: "disabled",     type: "boolean", default: "false", description: "Disables the select." },
  { name: "className",    type: "string",  description: "Additional CSS classes on the wrapper." },
];

export default function SelectPage() {
  return (
    <ComponentSection
      name="Select"
      status="stable"
      description="A native dropdown for choosing from a fixed list of options. Use when the list has fewer than ~15 items and doesn't require search."
      breadcrumb={[
        { label: "Home",               href: "/" },
        { label: "Components",         href: "/components" },
        { label: "Selection and input", href: "/components" },
      ]}
      examples={[
        {
          label: "Default",
          preview: <div className="w-56"><Select options={OPTIONS} /></div>,
          code: `<Select options={OPTIONS} />`,
        },
        {
          label: "With placeholder",
          preview: <div className="w-56"><Select options={OPTIONS} label="Role" placeholder="Choose a role..." /></div>,
          code: `<Select options={OPTIONS} label="Role" placeholder="Choose a role..." />`,
        },
        {
          label: "With hint",
          preview: <div className="w-56"><Select options={OPTIONS} label="Role" hint="Users inherit permissions from their role." placeholder="Choose a role..." /></div>,
          code: `<Select options={OPTIONS} label="Role" hint="Users inherit permissions from their role." />`,
        },
        {
          label: "Error state",
          preview: <div className="w-56"><Select options={OPTIONS} label="Role" error="Please select a role." /></div>,
          code: `<Select options={OPTIONS} label="Role" error="Please select a role." />`,
        },
        {
          label: "Disabled",
          preview: <div className="w-56"><Select options={OPTIONS} label="Role" disabled /></div>,
          code: `<Select options={OPTIONS} label="Role" disabled />`,
        },
      ]}
      props={PROPS}
      dos={[
        { label: "Use Select for fixed lists under ~15 options." },
      ]}
      donts={[
        { label: "Don't use Select for large or searchable lists — use a Combobox instead." },
      ]}
      accessibility={{
        labeling: "The label prop renders an associated <label>. The native <select> is keyboard accessible by default.",
        keyboardSupport: [
          "Tab / Shift+Tab — move focus to the select",
          "Space or Enter — open the dropdown",
          "Arrow keys — navigate options",
        ],
      }}
      relatedComponents={[
        { label: "Input",    href: "/components/selection-and-input/input" },
        { label: "Checkbox", href: "/components/selection-and-input/checkbox" },
      ]}
    />
  );
}
