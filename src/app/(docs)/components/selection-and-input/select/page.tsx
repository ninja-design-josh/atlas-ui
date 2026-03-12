"use client";

import { Select } from "@/components/ui/select";
import { ComponentSection, DocSubheading } from "@/components/docs/component-section";
import { LivePreview } from "@/components/docs/live-preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable, type PropDef } from "@/components/docs/props-table";

const ROLE_OPTIONS = [
  { value: "admin",  label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
];

const IMPORT = `import { Select } from "@/components/ui/select";`;

const USAGE = `const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
];

// Basic
<Select
  options={ROLE_OPTIONS}
  placeholder="Select a role..."
/>

// With label
<Select
  label="User Role"
  options={ROLE_OPTIONS}
  defaultValue="viewer"
/>

// Error state
<Select
  label="Country"
  options={COUNTRY_OPTIONS}
  error="Please select a country."
/>`;

const PROPS: PropDef[] = [
  { name: "options",     type: "SelectOption[]", required: true, description: 'Array of { value: string; label: string; disabled?: boolean }.' },
  { name: "label",       type: "string",         description: "Label text displayed above the select." },
  { name: "hint",        type: "string",         description: "Helper text displayed below." },
  { name: "error",       type: "string",         description: "Error message; changes border to red." },
  { name: "placeholder", type: "string",         description: "Disabled first option used as a prompt." },
  { name: "disabled",    type: "boolean",        default: "false", description: "Disables the select." },
];

export default function SelectPage() {
  return (
    <ComponentSection
      id="select"
      name="Select"
      status="stable"
      description="A native dropdown for choosing from a fixed list of options. Uses the browser's native select element for accessibility and mobile support."
      whenToUse={[
        "Use when the user must choose exactly one value from 4+ options.",
        "Prefer Checkbox or Switch for binary on/off choices.",
        "Provide a placeholder option to prompt selection in required fields.",
      ]}
      controlDefs={[
        { prop: "label",    type: "string",  default: "Role" },
        { prop: "error",    type: "string",  default: "" },
        { prop: "disabled", type: "boolean", default: false },
      ]}
      renderPreview={(p) => (
        <div className="w-64">
          <Select
            label={(p.label as string) || undefined}
            options={ROLE_OPTIONS}
            placeholder="Select a role..."
            error={(p.error as string) || undefined}
            disabled={p.disabled as boolean}
          />
        </div>
      )}
    >
      <div>
        <DocSubheading>States</DocSubheading>
        <LivePreview centered={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full p-2">
            <Select options={ROLE_OPTIONS} placeholder="Select a role..." />
            <Select label="User Role" options={ROLE_OPTIONS} defaultValue="viewer" />
            <Select label="Department" options={ROLE_OPTIONS} error="Please select a department." />
            <Select label="Access Level (disabled)" options={ROLE_OPTIONS} defaultValue="viewer" disabled />
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
    </ComponentSection>
  );
}
