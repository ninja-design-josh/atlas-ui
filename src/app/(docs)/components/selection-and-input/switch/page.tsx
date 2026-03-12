"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { ComponentSection } from "@/components/docs/component-section";
import type { PropDef } from "@/components/docs/props-table";

const PROPS: PropDef[] = [
  { name: "label",          type: "string",                     description: "Label text next to the switch." },
  { name: "description",    type: "string",                     description: "Secondary text below the label." },
  { name: "checked",        type: "boolean",                    description: "Controlled on/off state." },
  { name: "defaultChecked", type: "boolean", default: "false",  description: "Uncontrolled initial on/off state." },
  { name: "onChange",       type: "(checked: boolean) => void", description: "Callback when state changes." },
  { name: "disabled",       type: "boolean", default: "false",  description: "Disables the switch." },
];

export default function SwitchPage() {
  return (
    <ComponentSection
      name="Switch"
      status="stable"
      description="An immediate-effect boolean toggle. Use when the action takes effect instantly — not inside a form that requires a submit button."
      breadcrumb={[
        { label: "Home",               href: "/" },
        { label: "Components",         href: "/components" },
        { label: "Selection and input", href: "/components" },
      ]}
      examples={[
        {
          label: "Default",
          preview: <Switch label="Dark mode" />,
          code: `<Switch label="Dark mode" />`,
        },
        {
          label: "With description",
          preview: <Switch label="Email notifications" description="Receive alerts when someone mentions you." />,
          code: `<Switch label="Email notifications" description="Receive alerts when someone mentions you." />`,
        },
        {
          label: "On state",
          preview: <Switch label="Auto-save" defaultChecked />,
          code: `<Switch label="Auto-save" defaultChecked />`,
        },
        {
          label: "Disabled",
          preview: <div className="space-y-2"><Switch label="Managed by admin" disabled /><Switch label="Enforced setting" disabled defaultChecked /></div>,
          code: `<Switch label="Managed by admin" disabled />`,
        },
      ]}
      props={PROPS}
      dos={[
        { label: "Use Switch for settings that take effect immediately without a save action." },
      ]}
      donts={[
        { label: "Don't use Switch inside a submit-form — use Checkbox instead." },
      ]}
      accessibility={{
        description: "Switch renders with role='switch' and aria-checked. Screen readers announce the on/off state.",
        labeling: "Always provide a label. The switch is announced as '[label], switch, on/off'.",
        keyboardSupport: [
          "Tab / Shift+Tab — move focus to the switch",
          "Space — toggle on/off state",
        ],
      }}
      relatedComponents={[
        { label: "Checkbox", href: "/components/selection-and-input/checkbox" },
      ]}
    />
  );
}
