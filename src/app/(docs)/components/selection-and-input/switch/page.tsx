"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { ComponentSection, DocSubheading } from "@/components/docs/component-section";
import { LivePreview } from "@/components/docs/live-preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable, type PropDef } from "@/components/docs/props-table";

const IMPORT = `import { Switch } from "@/components/ui/switch";`;

const USAGE = `// Controlled
const [enabled, setEnabled] = React.useState(false);
<Switch
  label="Dark mode"
  checked={enabled}
  onChange={setEnabled}
/>

// With label and description
<Switch
  label="Two-factor authentication"
  description="Add an extra layer of security to your account."
  defaultChecked={false}
/>`;

const PROPS: PropDef[] = [
  { name: "label",        type: "string",  description: "Label text shown next to the toggle." },
  { name: "description",  type: "string",  description: "Secondary helper text below the label." },
  { name: "checked",      type: "boolean", description: "Controlled checked state." },
  { name: "defaultChecked", type: "boolean", default: "false", description: "Initial checked state (uncontrolled)." },
  { name: "disabled",     type: "boolean", default: "false", description: "Disables the toggle." },
  { name: "onChange",     type: "(checked: boolean) => void", description: "Called when the toggle state changes." },
];

export default function SwitchPage() {
  const [switchA, setSwitchA] = React.useState(false);
  const [switchB, setSwitchB] = React.useState(true);

  return (
    <ComponentSection
      id="switch"
      name="Switch"
      status="stable"
      description="A toggle control for binary settings that take effect immediately without requiring a form submit."
      whenToUse={[
        "Use for settings that apply instantly (dark mode, notifications, feature toggles).",
        "Use Checkbox instead when the change requires a form submit to take effect.",
        "Add a description to clarify the impact of toggling.",
      ]}
      controlDefs={[
        { prop: "label",       type: "string",  default: "Email notifications" },
        { prop: "description", type: "string",  default: "Receive updates by email." },
        { prop: "disabled",    type: "boolean", default: false },
      ]}
      renderPreview={(p) => (
        <Switch
          label={p.label as string}
          description={(p.description as string) || undefined}
          disabled={p.disabled as boolean}
        />
      )}
    >
      <div>
        <DocSubheading>States</DocSubheading>
        <LivePreview centered={false}>
          <div className="space-y-4 p-2">
            <Switch label="Off" checked={switchA} onChange={setSwitchA} />
            <Switch label="On" checked={switchB} onChange={setSwitchB} />
            <Switch label="Two-factor authentication" description="Add an extra layer of security to your account." defaultChecked={false} />
            <Switch label="Disabled off" disabled />
            <Switch label="Disabled on" checked disabled />
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
