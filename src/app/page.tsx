"use client";

import * as React from "react";
import { Mail, Search, Eye, EyeOff, ChevronRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable, type PropDef } from "@/components/docs/props-table";
import { ComponentSection, DocSubheading } from "@/components/docs/component-section";
import { LivePreview } from "@/components/docs/live-preview";

// ─── Sidebar navigation ──────────────────────────────────────────────────────

type NavItem =
  | { type: "section"; label: string }
  | { type: "link"; id: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { type: "link", id: "overview", label: "Overview" },
  { type: "section", label: "Components" },
  { type: "link", id: "button", label: "Button" },
  { type: "link", id: "input", label: "Input" },
  { type: "link", id: "textarea", label: "Textarea" },
  { type: "link", id: "select", label: "Select" },
  { type: "link", id: "checkbox", label: "Checkbox" },
  { type: "link", id: "switch", label: "Switch" },
  { type: "link", id: "badge", label: "Badge" },
  { type: "link", id: "avatar", label: "Avatar" },
  { type: "link", id: "card", label: "Card" },
];

// ─── Code snippets ────────────────────────────────────────────────────────────

const BUTTON_IMPORT = `import { Button } from "@/components/ui/button";`;

const BUTTON_USAGE = `// Solid (default) — use for primary actions
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

const BUTTON_COMPOSITION = `// Confirm dialog footer
<CardFooter>
  <Button variant="outlined" color="secondary">Cancel</Button>
  <Button variant="solid" color="primary">Confirm</Button>
</CardFooter>

// Danger action with badge count
<div className="flex items-center gap-2">
  <Badge variant="error">3 errors</Badge>
  <Button variant="solid" color="danger" size="sm">Fix All</Button>
</div>`;

const INPUT_IMPORT = `import { Input } from "@/components/ui/input";`;

const INPUT_USAGE = `// Basic
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

const INPUT_COMPOSITION = `// Search bar with button
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

const TEXTAREA_IMPORT = `import { Textarea } from "@/components/ui/textarea";`;

const TEXTAREA_USAGE = `// Basic
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

const SELECT_IMPORT = `import { Select } from "@/components/ui/select";`;

const SELECT_USAGE = `const ROLE_OPTIONS = [
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

const CHECKBOX_IMPORT = `import { Checkbox } from "@/components/ui/checkbox";`;

const CHECKBOX_USAGE = `// Uncontrolled with label
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

const SWITCH_IMPORT = `import { Switch } from "@/components/ui/switch";`;

const SWITCH_USAGE = `// Controlled
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

const BADGE_IMPORT = `import { Badge } from "@/components/ui/badge";`;

const BADGE_USAGE = `// Variants
<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="purple">Purple</Badge>

// With dot indicator
<Badge variant="success" dot>Active</Badge>
<Badge variant="error" dot>Failed</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>`;

const BADGE_COMPOSITION = `// Status badge in Card header
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>API Integration</CardTitle>
      <Badge variant="success" dot>Connected</Badge>
    </div>
    <CardDescription>Last synced 2 minutes ago.</CardDescription>
  </CardHeader>
</Card>`;

const AVATAR_IMPORT = `import { Avatar } from "@/components/ui/avatar";`;

const AVATAR_USAGE = `// With image — falls back to initials if the URL fails
<Avatar
  src="https://avatars.githubusercontent.com/u/1"
  alt="GitHub User"
  initials="GH"
  size="md"
/>

// Initials only
<Avatar initials="JD" size="lg" />

// All sizes
<Avatar initials="SM" size="sm" />
<Avatar initials="MD" size="md" />
<Avatar initials="LG" size="lg" />
<Avatar initials="XL" size="xl" />`;

const CARD_IMPORT = `import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";`;

const CARD_USAGE = `// Basic card
<Card>
  <p>Card content goes here.</p>
</Card>

// With subcomponents
<Card elevation={1}>
  <CardHeader>
    <CardTitle>Project Alpha</CardTitle>
    <CardDescription>Created Jan 12, 2025</CardDescription>
  </CardHeader>
  <p className="text-sm text-grey-70">
    A new initiative to streamline onboarding flows.
  </p>
  <CardFooter>
    <Button variant="outlined" color="secondary" size="sm">View</Button>
    <Button variant="solid" color="primary" size="sm">Edit</Button>
  </CardFooter>
</Card>

// Elevation levels
<Card elevation={0}>Flat (0)</Card>
<Card elevation={1}>Raised (1)</Card>
<Card elevation={2}>Elevated (2)</Card>
<Card elevation={4}>Floating (4)</Card>`;

const CARD_COMPOSITION = `// Entity card: Card + Avatar + Badge + Button
<Card elevation={1}>
  <CardHeader>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar initials="AB" size="md" />
        <div>
          <CardTitle>Alicia Brown</CardTitle>
          <CardDescription>Product Designer</CardDescription>
        </div>
      </div>
      <Badge variant="success" dot>Active</Badge>
    </div>
  </CardHeader>
  <CardFooter>
    <Button variant="ghost" color="secondary" size="sm">Message</Button>
    <Button variant="outlined" color="primary" size="sm">View Profile</Button>
  </CardFooter>
</Card>`;

// ─── Props definitions ────────────────────────────────────────────────────────

const BUTTON_PROPS: PropDef[] = [
  { name: "variant", type: '"solid" | "outlined" | "ghost"', default: '"solid"', description: "Visual style of the button." },
  { name: "color", type: '"primary" | "secondary" | "danger"', default: '"primary"', description: "Color scheme applied to the variant." },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Height and padding of the button." },
  { name: "loading", type: "boolean", default: "false", description: "Shows a spinner and disables the button." },
  { name: "disabled", type: "boolean", default: "false", description: "Disables interaction." },
  { name: "leftIcon", type: "ReactNode", description: "Icon rendered before the label text." },
  { name: "rightIcon", type: "ReactNode", description: "Icon rendered after the label text." },
  { name: "children", type: "ReactNode", required: true, description: "Button label." },
];

const INPUT_PROPS: PropDef[] = [
  { name: "label", type: "string", description: "Label text displayed above the input." },
  { name: "hint", type: "string", description: "Helper text displayed below the input." },
  { name: "error", type: "string", description: "Error message; overrides hint and changes border to red." },
  { name: "leadingIcon", type: "ReactNode", description: "Icon shown inside the left of the input." },
  { name: "trailingIcon", type: "ReactNode", description: "Icon shown inside the right of the input." },
  { name: "disabled", type: "boolean", default: "false", description: "Disables the input." },
  { name: "placeholder", type: "string", description: "Placeholder text when empty." },
  { name: "...InputHTMLAttributes", type: "React.InputHTMLAttributes", description: "All standard HTML input attributes are supported." },
];

const TEXTAREA_PROPS: PropDef[] = [
  { name: "label", type: "string", description: "Label text displayed above the textarea." },
  { name: "hint", type: "string", description: "Helper text displayed below." },
  { name: "error", type: "string", description: "Error message; overrides hint and changes border to red." },
  { name: "rows", type: "number", default: "4", description: "Initial visible row count." },
  { name: "disabled", type: "boolean", default: "false", description: "Disables the textarea." },
  { name: "...TextareaHTMLAttributes", type: "React.TextareaHTMLAttributes", description: "All standard HTML textarea attributes are supported." },
];

const SELECT_PROPS: PropDef[] = [
  { name: "options", type: "SelectOption[]", required: true, description: 'Array of { value: string; label: string; disabled?: boolean }.' },
  { name: "label", type: "string", description: "Label text displayed above the select." },
  { name: "hint", type: "string", description: "Helper text displayed below." },
  { name: "error", type: "string", description: "Error message; changes border to red." },
  { name: "placeholder", type: "string", description: "Disabled first option used as a prompt." },
  { name: "disabled", type: "boolean", default: "false", description: "Disables the select." },
];

const CHECKBOX_PROPS: PropDef[] = [
  { name: "label", type: "string", description: "Label text shown next to the checkbox." },
  { name: "description", type: "string", description: "Secondary helper text below the label." },
  { name: "checked", type: "boolean", description: "Controlled checked state." },
  { name: "defaultChecked", type: "boolean", default: "false", description: "Initial checked state (uncontrolled)." },
  { name: "disabled", type: "boolean", default: "false", description: "Disables the checkbox." },
  { name: "onChange", type: "(checked: boolean) => void", description: "Called when the checked state changes." },
];

const SWITCH_PROPS: PropDef[] = [
  { name: "label", type: "string", description: "Label text shown next to the toggle." },
  { name: "description", type: "string", description: "Secondary helper text below the label." },
  { name: "checked", type: "boolean", description: "Controlled checked state." },
  { name: "defaultChecked", type: "boolean", default: "false", description: "Initial checked state (uncontrolled)." },
  { name: "disabled", type: "boolean", default: "false", description: "Disables the toggle." },
  { name: "onChange", type: "(checked: boolean) => void", description: "Called when the toggle state changes." },
];

const BADGE_PROPS: PropDef[] = [
  { name: "variant", type: '"default" | "success" | "warning" | "error" | "info" | "purple"', default: '"default"', description: "Color scheme of the badge." },
  { name: "size", type: '"sm" | "md"', default: '"md"', description: "Padding and text size." },
  { name: "dot", type: "boolean", default: "false", description: "Shows a colored dot before the label." },
  { name: "children", type: "ReactNode", required: true, description: "Badge label content." },
];

const AVATAR_PROPS: PropDef[] = [
  { name: "src", type: "string", description: "Image URL. Falls back to initials or icon if the image fails to load." },
  { name: "alt", type: "string", default: '""', description: "Alt text for the image." },
  { name: "initials", type: "string", description: "1–2 characters shown when no image is available." },
  { name: "size", type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "Diameter of the avatar circle." },
];

const CARD_PROPS: PropDef[] = [
  { name: "padding", type: '"none" | "sm" | "md" | "lg"', default: '"md"', description: "Internal padding of the card." },
  { name: "border", type: "boolean", default: "true", description: "Shows a 1px border around the card." },
  { name: "elevation", type: "0 | 1 | 2 | 4 | 8", default: "0", description: "MUI-style box-shadow depth. 0 = flat, 8 = highest elevation." },
  { name: "children", type: "ReactNode", required: true, description: "Card content." },
];

// ─── Demo data ────────────────────────────────────────────────────────────────

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const [darkMode, setDarkMode] = React.useState(false);

  function toggleDark() {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
  }

  const [inputValue, setInputValue] = React.useState("");
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [checkboxA, setCheckboxA] = React.useState(false);
  const [checkboxB, setCheckboxB] = React.useState(true);
  const [switchA, setSwitchA] = React.useState(false);
  const [switchB, setSwitchB] = React.useState(true);

  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <header className="sticky top-0 z-50 h-14 bg-white dark:bg-grey-110 border-b border-grey-10 dark:border-grey-90 flex-shrink-0">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center gap-3">
            <span className="font-bold text-grey-100 dark:text-grey-10 text-lg">Atlas UI</span>
            <span className="text-grey-30 dark:text-grey-70 select-none">·</span>
            <span className="text-sm text-grey-50">Bento / MUI</span>
          </div>
          <button
            onClick={toggleDark}
            className="text-sm px-3 py-1.5 rounded-sm border border-grey-20 dark:border-grey-70 text-grey-70 dark:text-grey-40 hover:bg-grey-5 dark:hover:bg-grey-90 transition-colors"
          >
            {darkMode ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0">

        {/* Sidebar */}
        <nav className="w-[260px] flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-grey-10 dark:border-grey-90 bg-white dark:bg-grey-110 py-6 px-4">
          <ul className="space-y-0.5">
            {NAV_ITEMS.map((item, i) => {
              if (item.type === "section") {
                return (
                  <li key={i} className="pt-5 pb-1">
                    <span className="text-overline text-grey-40 dark:text-grey-60">{item.label}</span>
                  </li>
                );
              }
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block px-3 py-2 rounded-sm text-sm text-grey-70 dark:text-grey-40 hover:bg-grey-5 dark:hover:bg-grey-90 hover:text-grey-100 dark:hover:text-grey-10 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Main */}
        <main className="flex-1 min-w-0 px-10 py-8 max-w-4xl">

          {/* Overview */}
          <section id="overview" className="scroll-mt-16 pb-10 border-b border-grey-10 dark:border-grey-90">
            <h1 className="text-3xl font-bold text-grey-100 dark:text-grey-10 mb-3">Atlas UI</h1>
            <p className="text-grey-70 dark:text-grey-50 mb-6 leading-relaxed max-w-2xl">
              A React component library built on the Bento design system with MUI-inspired interaction patterns. Designed for AI-assisted development — every component has explicit TypeScript interfaces, copy-paste ready snippets, and composition guidance.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Stack", value: "Next.js 15 · React 19 · TypeScript" },
                { label: "Styling", value: "Tailwind CSS v4 · Inter font" },
                { label: "Import pattern", value: "@/components/ui/[name]" },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-sm bg-grey-5 dark:bg-grey-110 border border-grey-10 dark:border-grey-90">
                  <p className="text-overline text-grey-50 mb-1">{item.label}</p>
                  <p className="text-sm text-grey-100 dark:text-grey-10 font-mono">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Button */}
          <ComponentSection
            id="button"
            name="Button"
            description="A clickable element that triggers an action or navigation. Supports three visual styles and three semantic color schemes."
            whenToUse={[
              "Use solid + primary for the main call-to-action on a page or form.",
              "Use outlined or ghost for secondary and tertiary actions that accompany a primary button.",
              "Use color=danger to confirm destructive operations like deleting or revoking access.",
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
                    <Button leftIcon={<Plus className="h-4 w-4" />}>Add Item</Button>
                    <Button variant="outlined" color="secondary" rightIcon={<ChevronRight className="h-4 w-4" />}>Continue</Button>
                  </div>
                </div>
              </LivePreview>
            </div>

            <div>
              <DocSubheading>Import</DocSubheading>
              <CodeBlock code={BUTTON_IMPORT} language="tsx" />
            </div>
            <div>
              <DocSubheading>Usage</DocSubheading>
              <CodeBlock code={BUTTON_USAGE} language="tsx" />
            </div>
            <div>
              <DocSubheading>Props</DocSubheading>
              <PropsTable props={BUTTON_PROPS} />
            </div>
            <div>
              <DocSubheading>Composition</DocSubheading>
              <CodeBlock code={BUTTON_COMPOSITION} language="tsx" />
            </div>
          </ComponentSection>

          {/* Input */}
          <ComponentSection
            id="input"
            name="Input"
            description="A single-line text field for collecting user input. Supports labels, icons, hints, and error states."
            whenToUse={[
              "Use for short text values: names, emails, URLs, search queries.",
              "Pair with a label for form fields and a hint for format guidance.",
              "Switch the error prop to show inline validation feedback without changing the DOM structure.",
            ]}
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
                        className="cursor-pointer text-grey-50 hover:text-grey-100 dark:hover:text-grey-10"
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
              <DocSubheading>Import</DocSubheading>
              <CodeBlock code={INPUT_IMPORT} language="tsx" />
            </div>
            <div>
              <DocSubheading>Usage</DocSubheading>
              <CodeBlock code={INPUT_USAGE} language="tsx" />
            </div>
            <div>
              <DocSubheading>Props</DocSubheading>
              <PropsTable props={INPUT_PROPS} />
            </div>
            <div>
              <DocSubheading>Composition</DocSubheading>
              <CodeBlock code={INPUT_COMPOSITION} language="tsx" />
            </div>
          </ComponentSection>

          {/* Textarea */}
          <ComponentSection
            id="textarea"
            name="Textarea"
            description="A multi-line text field for longer content like descriptions, comments, or notes. Shares the same label/hint/error API as Input."
            whenToUse={[
              "Use instead of Input when the expected content spans multiple sentences.",
              "Provide a rows prop to hint at the expected content length.",
              "Use the same label + error pattern as Input for consistent form UX.",
            ]}
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
              <CodeBlock code={TEXTAREA_IMPORT} language="tsx" />
            </div>
            <div>
              <DocSubheading>Usage</DocSubheading>
              <CodeBlock code={TEXTAREA_USAGE} language="tsx" />
            </div>
            <div>
              <DocSubheading>Props</DocSubheading>
              <PropsTable props={TEXTAREA_PROPS} />
            </div>
          </ComponentSection>

          {/* Select */}
          <ComponentSection
            id="select"
            name="Select"
            description="A native dropdown for choosing from a fixed list of options. Uses the browser's native select element for accessibility and mobile support."
            whenToUse={[
              "Use when the user must choose exactly one value from 4+ options.",
              "Prefer Checkbox or Switch for binary on/off choices.",
              "Provide a placeholder option to prompt selection in required fields.",
            ]}
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
              <CodeBlock code={SELECT_IMPORT} language="tsx" />
            </div>
            <div>
              <DocSubheading>Usage</DocSubheading>
              <CodeBlock code={SELECT_USAGE} language="tsx" />
            </div>
            <div>
              <DocSubheading>Props</DocSubheading>
              <PropsTable props={SELECT_PROPS} />
            </div>
          </ComponentSection>

          {/* Checkbox */}
          <ComponentSection
            id="checkbox"
            name="Checkbox"
            description="A binary selection control for toggling individual options or selecting multiple items from a list."
            whenToUse={[
              "Use for independent yes/no choices in forms (accept terms, enable feature).",
              "Use a group of Checkboxes when users can select multiple items from a list.",
              "Use Switch instead for settings that take immediate effect without a form submit.",
            ]}
          >
            <div>
              <DocSubheading>States</DocSubheading>
              <LivePreview centered={false}>
                <div className="space-y-3 p-2">
                  <Checkbox label="Unchecked" checked={checkboxA} onChange={setCheckboxA} />
                  <Checkbox label="Checked" checked={checkboxB} onChange={setCheckboxB} />
                  <Checkbox
                    label="Marketing emails"
                    description="Receive product updates and promotions."
                    defaultChecked
                  />
                  <Checkbox label="Disabled unchecked" disabled />
                  <Checkbox label="Disabled checked" checked disabled />
                </div>
              </LivePreview>
            </div>

            <div>
              <DocSubheading>Import</DocSubheading>
              <CodeBlock code={CHECKBOX_IMPORT} language="tsx" />
            </div>
            <div>
              <DocSubheading>Usage</DocSubheading>
              <CodeBlock code={CHECKBOX_USAGE} language="tsx" />
            </div>
            <div>
              <DocSubheading>Props</DocSubheading>
              <PropsTable props={CHECKBOX_PROPS} />
            </div>
          </ComponentSection>

          {/* Switch */}
          <ComponentSection
            id="switch"
            name="Switch"
            description="A toggle control for binary settings that take effect immediately without requiring a form submit."
            whenToUse={[
              "Use for settings that apply instantly (dark mode, notifications, feature toggles).",
              "Use Checkbox instead when the change requires a form submit to take effect.",
              "Add a description to clarify the impact of toggling.",
            ]}
          >
            <div>
              <DocSubheading>States</DocSubheading>
              <LivePreview centered={false}>
                <div className="space-y-4 p-2">
                  <Switch label="Off" checked={switchA} onChange={setSwitchA} />
                  <Switch label="On" checked={switchB} onChange={setSwitchB} />
                  <Switch
                    label="Two-factor authentication"
                    description="Add an extra layer of security to your account."
                    defaultChecked={false}
                  />
                  <Switch label="Disabled off" disabled />
                  <Switch label="Disabled on" checked disabled />
                </div>
              </LivePreview>
            </div>

            <div>
              <DocSubheading>Import</DocSubheading>
              <CodeBlock code={SWITCH_IMPORT} language="tsx" />
            </div>
            <div>
              <DocSubheading>Usage</DocSubheading>
              <CodeBlock code={SWITCH_USAGE} language="tsx" />
            </div>
            <div>
              <DocSubheading>Props</DocSubheading>
              <PropsTable props={SWITCH_PROPS} />
            </div>
          </ComponentSection>

          {/* Badge */}
          <ComponentSection
            id="badge"
            name="Badge"
            description="A small label for surfacing status, categories, or counts. Renders inline; use inside Card headers, list rows, or next to Avatars."
            whenToUse={[
              "Use to communicate the status of an item (active, failed, pending).",
              "Use the dot variant for a status indicator paired with a short label.",
              "Keep badge labels short — 1 to 3 words maximum.",
            ]}
          >
            <div>
              <DocSubheading>Variants</DocSubheading>
              <LivePreview>
                <Badge variant="default">Default</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="purple">Purple</Badge>
              </LivePreview>
            </div>

            <div>
              <DocSubheading>With dot · sizes</DocSubheading>
              <LivePreview>
                <Badge variant="success" dot>Active</Badge>
                <Badge variant="error" dot>Failed</Badge>
                <Badge variant="warning" dot>Pending</Badge>
                <Badge variant="info" size="sm">Small</Badge>
                <Badge variant="default" size="md">Medium</Badge>
              </LivePreview>
            </div>

            <div>
              <DocSubheading>Import</DocSubheading>
              <CodeBlock code={BADGE_IMPORT} language="tsx" />
            </div>
            <div>
              <DocSubheading>Usage</DocSubheading>
              <CodeBlock code={BADGE_USAGE} language="tsx" />
            </div>
            <div>
              <DocSubheading>Props</DocSubheading>
              <PropsTable props={BADGE_PROPS} />
            </div>
            <div>
              <DocSubheading>Composition</DocSubheading>
              <CodeBlock code={BADGE_COMPOSITION} language="tsx" />
            </div>
          </ComponentSection>

          {/* Avatar */}
          <ComponentSection
            id="avatar"
            name="Avatar"
            description="A circular image or fallback representing a user, team, or entity. Falls back gracefully: image → initials → generic icon."
            whenToUse={[
              "Use in navigation headers, comment threads, and user list rows.",
              "Provide initials as a fallback for when a profile image is unavailable.",
              "Use size=xl for profile pages; size=sm for dense tables or sidebar items.",
            ]}
          >
            <div>
              <DocSubheading>Sizes</DocSubheading>
              <LivePreview>
                <div className="flex flex-col items-center gap-1">
                  <Avatar initials="SM" size="sm" />
                  <span className="text-caption text-grey-50">sm</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Avatar initials="MD" size="md" />
                  <span className="text-caption text-grey-50">md</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Avatar initials="LG" size="lg" />
                  <span className="text-caption text-grey-50">lg</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Avatar initials="XL" size="xl" />
                  <span className="text-caption text-grey-50">xl</span>
                </div>
              </LivePreview>
            </div>

            <div>
              <DocSubheading>Fallback states</DocSubheading>
              <LivePreview>
                <div className="flex flex-col items-center gap-1">
                  <Avatar src="https://github.com/vercel.png" alt="Vercel" size="lg" />
                  <span className="text-caption text-grey-50">Image</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Avatar initials="JD" size="lg" />
                  <span className="text-caption text-grey-50">Initials</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Avatar size="lg" />
                  <span className="text-caption text-grey-50">No src/initials</span>
                </div>
              </LivePreview>
            </div>

            <div>
              <DocSubheading>Import</DocSubheading>
              <CodeBlock code={AVATAR_IMPORT} language="tsx" />
            </div>
            <div>
              <DocSubheading>Usage</DocSubheading>
              <CodeBlock code={AVATAR_USAGE} language="tsx" />
            </div>
            <div>
              <DocSubheading>Props</DocSubheading>
              <PropsTable props={AVATAR_PROPS} />
            </div>
          </ComponentSection>

          {/* Card */}
          <ComponentSection
            id="card"
            name="Card"
            description="A surface container for grouping related content. Use the CardHeader, CardTitle, CardDescription, and CardFooter subcomponents for consistent layout."
            whenToUse={[
              "Use to visually group content that belongs together (settings sections, list items, entity details).",
              "Use elevation > 0 when the card must stand out from a grey or surface-subtle background.",
              "Combine with Badge and Avatar in CardHeader for entity cards (user profiles, projects, integrations).",
            ]}
          >
            <div>
              <DocSubheading>Elevation levels</DocSubheading>
              <LivePreview centered={false} className="bg-grey-5 dark:bg-grey-120">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 w-full">
                  {([0, 1, 2, 4] as const).map((level) => (
                    <Card key={level} elevation={level} className="text-center">
                      <p className="text-sm font-semibold text-grey-100 dark:text-grey-10">elevation={level}</p>
                      <p className="text-caption text-grey-50 mt-1">
                        {level === 0 ? "Flat" : level === 1 ? "Raised" : level === 2 ? "Elevated" : "Floating"}
                      </p>
                    </Card>
                  ))}
                </div>
              </LivePreview>
            </div>

            <div>
              <DocSubheading>With subcomponents</DocSubheading>
              <LivePreview>
                <Card elevation={1} className="w-72">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Project Alpha</CardTitle>
                      <Badge variant="success" dot>Active</Badge>
                    </div>
                    <CardDescription>Last updated 2 minutes ago</CardDescription>
                  </CardHeader>
                  <p className="text-sm text-grey-70 dark:text-grey-50">
                    A new initiative to streamline onboarding flows across web and mobile.
                  </p>
                  <CardFooter>
                    <Button variant="outlined" color="secondary" size="sm">View</Button>
                    <Button variant="solid" color="primary" size="sm">Edit</Button>
                  </CardFooter>
                </Card>
              </LivePreview>
            </div>

            <div>
              <DocSubheading>Import</DocSubheading>
              <CodeBlock code={CARD_IMPORT} language="tsx" />
            </div>
            <div>
              <DocSubheading>Usage</DocSubheading>
              <CodeBlock code={CARD_USAGE} language="tsx" />
            </div>
            <div>
              <DocSubheading>Props</DocSubheading>
              <PropsTable props={CARD_PROPS} />
            </div>
            <div>
              <DocSubheading>Composition</DocSubheading>
              <CodeBlock code={CARD_COMPOSITION} language="tsx" />
            </div>
          </ComponentSection>

        </main>
      </div>
    </div>
  );
}
