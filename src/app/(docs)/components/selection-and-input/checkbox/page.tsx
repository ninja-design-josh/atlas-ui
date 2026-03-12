"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ComponentSection } from "@/components/docs/component-section";
import type { PropDef } from "@/components/docs/props-table";

const PROPS: PropDef[] = [
  { name: "label",          type: "string",                     description: "Label text next to the checkbox." },
  { name: "description",    type: "string",                     description: "Secondary descriptive text below the label." },
  { name: "checked",        type: "boolean",                    description: "Controlled checked state." },
  { name: "defaultChecked", type: "boolean", default: "false",  description: "Uncontrolled initial checked state." },
  { name: "onChange",       type: "(checked: boolean) => void", description: "Callback when checked state changes." },
  { name: "disabled",       type: "boolean", default: "false",  description: "Disables the checkbox." },
];

export default function CheckboxPage() {
  return (
    <ComponentSection
      name="Checkbox"
      status="stable"
      description="A boolean toggle for form opt-ins. Use for multi-select choices or settings that require explicit confirmation before saving."
      breadcrumb={[
        { label: "Home",               href: "/" },
        { label: "Components",         href: "/components" },
        { label: "Selection and input", href: "/components" },
      ]}
      examples={[
        {
          label: "Default",
          preview: <Checkbox label="Accept terms and conditions" />,
          code: `<Checkbox label="Accept terms and conditions" />`,
        },
        {
          label: "With description",
          preview: <Checkbox label="Marketing emails" description="Receive updates about new features and promotions." />,
          code: `<Checkbox label="Marketing emails" description="Receive updates about new features and promotions." />`,
        },
        {
          label: "Checked state",
          preview: <Checkbox label="Remember me" defaultChecked />,
          code: `<Checkbox label="Remember me" defaultChecked />`,
        },
        {
          label: "Disabled",
          preview: <div className="space-y-2"><Checkbox label="Disabled unchecked" disabled /><Checkbox label="Disabled checked" disabled defaultChecked /></div>,
          code: `<Checkbox label="Option" disabled />\n<Checkbox label="Option" disabled defaultChecked />`,
        },
        {
          label: "In a form group",
          preview: (
            <div className="space-y-3">
              <Checkbox label="Email notifications" description="Get notified by email." defaultChecked />
              <Checkbox label="Push notifications" description="Get notified on your device." />
              <Checkbox label="SMS notifications" description="Get notified by text." />
            </div>
          ),
          code: `<Checkbox label="Email notifications" defaultChecked />\n<Checkbox label="Push notifications" />\n<Checkbox label="SMS notifications" />`,
        },
      ]}
      props={PROPS}
      dos={[
        { label: "Use Checkbox for options that need explicit opt-in before a form is submitted." },
      ]}
      donts={[
        { label: "Don't use Checkbox for immediate-effect toggles — use Switch instead." },
      ]}
      accessibility={{
        labeling: "The label prop renders a <label> associated with the checkbox. Screen readers announce the label and checked state.",
        keyboardSupport: [
          "Tab / Shift+Tab — move focus to the checkbox",
          "Space — toggle checked state",
        ],
      }}
      relatedComponents={[
        { label: "Switch", href: "/components/selection-and-input/switch" },
        { label: "Select", href: "/components/selection-and-input/select" },
      ]}
    />
  );
}
