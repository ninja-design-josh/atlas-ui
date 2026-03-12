"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ComponentSection, DocSubheading } from "@/components/docs/component-section";
import { LivePreview } from "@/components/docs/live-preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable, type PropDef } from "@/components/docs/props-table";

const IMPORT = `import { Checkbox } from "@/components/ui/checkbox";`;

const USAGE = `// Uncontrolled with label
<Checkbox label="Accept terms of service" defaultChecked={false} />

// Controlled
const [checked, setChecked] = React.useState(false);
<Checkbox
  label="Enable notifications"
  checked={checked}
  onChange={setChecked}
/>

// With description
<Checkbox
  label="Marketing emails"
  description="Receive product updates and promotions."
  defaultChecked
/>

// Disabled
<Checkbox label="Read-only field" checked disabled />`;

const PROPS: PropDef[] = [
  { name: "label",        type: "string",  description: "Label text shown next to the checkbox." },
  { name: "description",  type: "string",  description: "Secondary helper text below the label." },
  { name: "checked",      type: "boolean", description: "Controlled checked state." },
  { name: "defaultChecked", type: "boolean", default: "false", description: "Initial checked state (uncontrolled)." },
  { name: "disabled",     type: "boolean", default: "false", description: "Disables the checkbox." },
  { name: "onChange",     type: "(checked: boolean) => void", description: "Called when the checked state changes." },
];

export default function CheckboxPage() {
  const [checkboxA, setCheckboxA] = React.useState(false);
  const [checkboxB, setCheckboxB] = React.useState(true);

  return (
    <ComponentSection
      id="checkbox"
      name="Checkbox"
      status="stable"
      description="A binary selection control for toggling individual options or selecting multiple items from a list."
      whenToUse={[
        "Use for independent yes/no choices in forms (accept terms, enable feature).",
        "Use a group of Checkboxes when users can select multiple items from a list.",
        "Use Switch instead for settings that take immediate effect without a form submit.",
      ]}
      controlDefs={[
        { prop: "label",       type: "string",  default: "Accept terms of service" },
        { prop: "description", type: "string",  default: "Required to continue." },
        { prop: "disabled",    type: "boolean", default: false },
      ]}
      renderPreview={(p) => (
        <Checkbox
          label={p.label as string}
          description={(p.description as string) || undefined}
          disabled={p.disabled as boolean}
        />
      )}
    >
      <div>
        <DocSubheading>States</DocSubheading>
        <LivePreview centered={false}>
          <div className="space-y-3 p-2">
            <Checkbox label="Unchecked" checked={checkboxA} onChange={setCheckboxA} />
            <Checkbox label="Checked" checked={checkboxB} onChange={setCheckboxB} />
            <Checkbox label="Marketing emails" description="Receive product updates and promotions." defaultChecked />
            <Checkbox label="Disabled unchecked" disabled />
            <Checkbox label="Disabled checked" checked disabled />
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
