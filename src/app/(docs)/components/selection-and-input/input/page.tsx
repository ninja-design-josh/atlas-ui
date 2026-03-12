"use client";

import * as React from "react";
import { Search, Eye, EyeOff, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ComponentSection, DocSubheading } from "@/components/docs/component-section";
import { LivePreview } from "@/components/docs/live-preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable, type PropDef } from "@/components/docs/props-table";

const IMPORT = `import { Input } from "@/components/ui/input";`;

const USAGE = `// Basic
<Input placeholder="Enter a value" />

// With label and hint
<Input
  label="Email address"
  hint="We'll never share your email."
  placeholder="you@example.com"
/>

// Error state
<Input
  label="Username"
  error="Username is already taken."
  defaultValue="josh123"
/>

// With icons
<Input leadingIcon={<Mail />} placeholder="Search emails..." />
<Input trailingIcon={<Search />} placeholder="Search..." />

// Disabled
<Input label="API Key" value="sk-proj-xxxxxxxxxxxx" disabled />`;

const COMPOSITION = `// Search bar with button
<div className="flex gap-2">
  <Input leadingIcon={<Search />} placeholder="Search components..." />
  <Button variant="solid" color="primary">Search</Button>
</div>

// Form fields inside Card
<Card>
  <CardHeader>
    <CardTitle>Account Settings</CardTitle>
  </CardHeader>
  <div className="space-y-4">
    <Input label="Display name" placeholder="Your name" />
    <Input label="Email" type="email" placeholder="you@example.com" />
  </div>
  <CardFooter>
    <Button variant="solid" color="primary">Save</Button>
  </CardFooter>
</Card>`;

const PROPS: PropDef[] = [
  { name: "label",          type: "string",    description: "Label text displayed above the input." },
  { name: "hint",           type: "string",    description: "Helper text displayed below the input." },
  { name: "error",          type: "string",    description: "Error message; overrides hint and changes border to red." },
  { name: "leadingIcon",    type: "ReactNode", description: "Icon shown inside the left of the input." },
  { name: "trailingIcon",   type: "ReactNode", description: "Icon shown inside the right of the input." },
  { name: "disabled",       type: "boolean",   default: "false", description: "Disables the input." },
  { name: "placeholder",    type: "string",    description: "Placeholder text when empty." },
  { name: "...InputHTMLAttributes", type: "React.InputHTMLAttributes", description: "All standard HTML input attributes are supported." },
];

export default function InputPage() {
  const [inputValue, setInputValue] = React.useState("");
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  return (
    <ComponentSection
      id="input"
      name="Input"
      status="stable"
      description="A single-line text field for collecting user input. Supports labels, icons, hints, and error states."
      whenToUse={[
        "Use for short text values: names, emails, URLs, search queries.",
        "Pair with a label for form fields and a hint for format guidance.",
        "Switch the error prop to show inline validation feedback without changing the DOM structure.",
      ]}
      controlDefs={[
        { prop: "label",       type: "string",  default: "Email address" },
        { prop: "placeholder", type: "string",  default: "you@example.com" },
        { prop: "hint",        type: "string",  default: "We'll never share this." },
        { prop: "error",       type: "string",  default: "" },
        { prop: "disabled",    type: "boolean", default: false },
      ]}
      renderPreview={(p) => (
        <div className="w-64">
          <Input
            label={(p.label as string) || undefined}
            placeholder={p.placeholder as string}
            hint={(p.hint as string) || undefined}
            error={(p.error as string) || undefined}
            disabled={p.disabled as boolean}
          />
        </div>
      )}
    >
      <div>
        <DocSubheading>States</DocSubheading>
        <LivePreview label="Preview" centered={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full p-2">
            <Input placeholder="Default input" />
            <Input label="Email address" hint="We'll never share your email." placeholder="you@example.com" />
            <Input label="Username" error="Username is already taken." defaultValue="josh123" />
            <Input label="Search" leadingIcon={<Search className="h-4 w-4" />} placeholder="Search..." />
            <Input
              label="Password"
              type={passwordVisible ? "text" : "password"}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              trailingIcon={
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="cursor-pointer text-grey-50 hover:text-grey-100"
                >
                  {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              placeholder="••••••••"
            />
            <Input label="API Key" value="sk-proj-xxxxxxxxxxxx" disabled readOnly />
          </div>
        </LivePreview>
      </div>

      <div>
        <DocSubheading>Composition — search bar</DocSubheading>
        <LivePreview>
          <div className="flex gap-2 w-full max-w-sm">
            <Input leadingIcon={<Search className="h-4 w-4" />} placeholder="Search components..." />
            <Button variant="solid" color="primary">Search</Button>
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
