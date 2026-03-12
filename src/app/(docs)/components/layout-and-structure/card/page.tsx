"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ComponentSection } from "@/components/docs/component-section";
import type { PropDef } from "@/components/docs/props-table";

const PROPS: PropDef[] = [
  { name: "padding",   type: '"none" | "sm" | "md" | "lg"', default: '"md"',   description: "Inner padding of the card." },
  { name: "border",    type: "boolean",                      default: "true",   description: "Shows a 1px border around the card." },
  { name: "elevation", type: "0 | 1 | 2 | 4 | 8",           default: "0",      description: "Box-shadow depth (MUI-style elevation)." },
  { name: "className", type: "string",                                          description: "Additional CSS classes." },
];

export default function CardPage() {
  return (
    <ComponentSection
      name="Card"
      status="stable"
      description="A surface container used to group related content and actions. Compose with CardHeader, CardTitle, CardDescription, and CardFooter subcomponents."
      breadcrumb={[
        { label: "Home",                href: "/" },
        { label: "Components",          href: "/components" },
        { label: "Layout and structure", href: "/components" },
      ]}
      examples={[
        {
          label: "Default",
          description: "Basic card with medium padding.",
          preview: (
            <Card padding="md" className="w-64">
              <p className="text-text-secondary text-sm">Card content goes here.</p>
            </Card>
          ),
          code: `<Card padding="md">\n  <p>Card content goes here.</p>\n</Card>`,
        },
        {
          label: "With header",
          description: "Use CardHeader, CardTitle, and CardDescription to add a structured header.",
          preview: (
            <Card padding="md" className="w-72">
              <CardHeader>
                <CardTitle>Account settings</CardTitle>
                <CardDescription>Manage your profile and preferences.</CardDescription>
              </CardHeader>
              <p className="text-text-secondary text-sm">Content area.</p>
            </Card>
          ),
          code: `<Card padding="md">\n  <CardHeader>\n    <CardTitle>Account settings</CardTitle>\n    <CardDescription>Manage your profile.</CardDescription>\n  </CardHeader>\n</Card>`,
        },
        {
          label: "With footer",
          description: "Use CardFooter to add action buttons at the bottom.",
          preview: (
            <Card padding="md" className="w-72">
              <CardHeader>
                <CardTitle>Confirm action</CardTitle>
              </CardHeader>
              <p className="text-text-secondary text-sm mb-4">Are you sure you want to continue?</p>
              <CardFooter>
                <Button variant="outlined" color="secondary">Cancel</Button>
                <Button variant="solid" color="primary">Confirm</Button>
              </CardFooter>
            </Card>
          ),
          code: `<Card padding="md">\n  <CardFooter>\n    <Button variant="outlined" color="secondary">Cancel</Button>\n    <Button variant="solid" color="primary">Confirm</Button>\n  </CardFooter>\n</Card>`,
        },
        {
          label: "Elevated",
          description: "Use elevation to add a drop shadow.",
          preview: (
            <div className="flex gap-4">
              <Card padding="md" elevation={1} className="w-28 text-center"><p className="text-text-secondary text-xs">elevation 1</p></Card>
              <Card padding="md" elevation={2} className="w-28 text-center"><p className="text-text-secondary text-xs">elevation 2</p></Card>
              <Card padding="md" elevation={4} className="w-28 text-center"><p className="text-text-secondary text-xs">elevation 4</p></Card>
            </div>
          ),
          code: `<Card elevation={1}>...</Card>\n<Card elevation={2}>...</Card>\n<Card elevation={4}>...</Card>`,
        },
        {
          label: "Full composition",
          description: "Settings form pattern from the design system.",
          preview: (
            <Card padding="md" className="w-80">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your display name and role.</CardDescription>
              </CardHeader>
              <div className="space-y-3 my-4">
                <Input label="Display name" placeholder="Your name" />
                <Select label="Role" options={[{ value: "admin", label: "Admin" }, { value: "member", label: "Member" }]} />
              </div>
              <CardFooter>
                <Button variant="outlined" color="secondary">Cancel</Button>
                <Button variant="solid" color="primary">Save changes</Button>
              </CardFooter>
            </Card>
          ),
          code: `<Card padding="md">\n  <CardHeader>\n    <CardTitle>Profile</CardTitle>\n    <CardDescription>Update your display name and role.</CardDescription>\n  </CardHeader>\n  <div className="space-y-3 my-4">\n    <Input label="Display name" placeholder="Your name" />\n    <Select label="Role" options={ROLE_OPTIONS} />\n  </div>\n  <CardFooter>\n    <Button variant="outlined" color="secondary">Cancel</Button>\n    <Button variant="solid" color="primary">Save changes</Button>\n  </CardFooter>\n</Card>`,
        },
      ]}
      props={PROPS}
      dos={[
        { label: "Use CardHeader + CardTitle for structured content with a clear heading." },
        { label: "Use CardFooter for action buttons — it handles spacing and alignment." },
      ]}
      donts={[
        { label: "Don't nest cards more than 1 level deep." },
        { label: "Don't use elevation and border together — pick one for visual hierarchy." },
      ]}
      accessibility={{
        description: "Card is a plain <div> with no implicit ARIA role. Add role and aria-label if the card acts as a landmark.",
        labeling: "If a card is interactive (e.g., entirely clickable), wrap it in an anchor or button and provide an accessible label.",
      }}
      relatedComponents={[
        { label: "Button",   href: "/components/actions/button" },
        { label: "Input",    href: "/components/selection-and-input/input" },
      ]}
    />
  );
}
