"use client";

import { Textarea } from "@/components/ui/textarea";
import { ComponentSection, DocSubheading } from "@/components/docs/component-section";
import { LivePreview } from "@/components/docs/live-preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable, type PropDef } from "@/components/docs/props-table";

const IMPORT = `import { Textarea } from "@/components/ui/textarea";`;

const USAGE = `// Basic
<Textarea placeholder="Write something..." />

// With label and hint
<Textarea
  label="Description"
  hint="Max 500 characters."
  placeholder="Describe your project..."
  rows={5}
/>

// Error state
<Textarea
  label="Bio"
  error="Bio cannot be empty."
/>`;

const PROPS: PropDef[] = [
  { name: "label",    type: "string",  description: "Label text displayed above the textarea." },
  { name: "hint",     type: "string",  description: "Helper text displayed below." },
  { name: "error",    type: "string",  description: "Error message; overrides hint and changes border to red." },
  { name: "rows",     type: "number",  default: "4", description: "Initial visible row count." },
  { name: "disabled", type: "boolean", default: "false", description: "Disables the textarea." },
  { name: "...TextareaHTMLAttributes", type: "React.TextareaHTMLAttributes", description: "All standard HTML textarea attributes are supported." },
];

export default function TextareaPage() {
  return (
    <ComponentSection
      id="textarea"
      name="Textarea"
      status="stable"
      description="A multi-line text field for longer content like descriptions, comments, or notes. Shares the same label/hint/error API as Input."
      whenToUse={[
        "Use instead of Input when the expected content spans multiple sentences.",
        "Provide a rows prop to hint at the expected content length.",
        "Use the same label + error pattern as Input for consistent form UX.",
      ]}
      controlDefs={[
        { prop: "label",       type: "string",  default: "Description" },
        { prop: "placeholder", type: "string",  default: "Write something..." },
        { prop: "hint",        type: "string",  default: "" },
        { prop: "error",       type: "string",  default: "" },
        { prop: "rows",        type: "string",  default: "4" },
        { prop: "disabled",    type: "boolean", default: false },
      ]}
      renderPreview={(p) => (
        <div className="w-64">
          <Textarea
            label={(p.label as string) || undefined}
            placeholder={p.placeholder as string}
            hint={(p.hint as string) || undefined}
            error={(p.error as string) || undefined}
            rows={Number(p.rows)}
            disabled={p.disabled as boolean}
          />
        </div>
      )}
    >
      <div>
        <DocSubheading>States</DocSubheading>
        <LivePreview centered={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full p-2">
            <Textarea placeholder="Write something..." rows={3} />
            <Textarea label="Description" hint="Max 500 characters." placeholder="Describe your project..." rows={3} />
            <Textarea label="Bio" error="Bio cannot be empty." rows={3} />
            <Textarea label="Notes (disabled)" value="Read-only content." disabled rows={3} />
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
