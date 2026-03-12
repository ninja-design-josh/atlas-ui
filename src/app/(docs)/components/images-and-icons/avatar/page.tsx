"use client";

import * as React from "react";
import { Avatar } from "@/components/ui/avatar";
import { ComponentSection } from "@/components/docs/component-section";
import type { PropDef } from "@/components/docs/props-table";

const PROPS: PropDef[] = [
  { name: "src",      type: "string",              description: "Image URL. Falls back to initials, then icon." },
  { name: "initials", type: "string",              description: "1–2 character fallback shown when src fails or is absent." },
  { name: "alt",      type: "string", required: true, description: "Alt text for the image. Required for accessibility." },
  { name: "size",     type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "Avatar dimensions." },
];

export default function AvatarPage() {
  return (
    <ComponentSection
      name="Avatar"
      status="stable"
      description="Represents a user or entity. Renders an image when available, falls back to initials, then to a generic icon."
      breadcrumb={[
        { label: "Home",             href: "/" },
        { label: "Components",       href: "/components" },
        { label: "Images and icons", href: "/components" },
      ]}
      examples={[
        {
          label: "With initials",
          description: "Shown when no image is provided.",
          preview: <Avatar initials="JB" alt="Josh Brinksman" />,
          code: `<Avatar initials="JB" alt="Josh Brinksman" />`,
        },
        {
          label: "Icon fallback",
          description: "Shown when neither src nor initials is provided.",
          preview: <Avatar alt="Unknown user" />,
          code: `<Avatar alt="Unknown user" />`,
        },
        {
          label: "All sizes",
          preview: (
            <div className="flex items-end gap-3">
              <Avatar initials="SM" alt="Small" size="sm" />
              <Avatar initials="MD" alt="Medium" size="md" />
              <Avatar initials="LG" alt="Large" size="lg" />
              <Avatar initials="XL" alt="Extra large" size="xl" />
            </div>
          ),
          code: `<Avatar initials="JB" alt="Josh" size="sm" />\n<Avatar initials="JB" alt="Josh" size="md" />\n<Avatar initials="JB" alt="Josh" size="lg" />\n<Avatar initials="JB" alt="Josh" size="xl" />`,
        },
      ]}
      props={PROPS}
      dos={[
        { label: "Always provide alt text — it's required for screen readers." },
        { label: "Provide initials as a fallback so the avatar is never empty." },
      ]}
      donts={[
        { label: "Don't omit the alt prop, even if the avatar is decorative — pass an empty string instead." },
      ]}
      accessibility={{
        labeling: "The alt prop is passed to the <img> element. When using initials or icon fallback, the alt text is used as the accessible name.",
      }}
      relatedComponents={[
        { label: "Badge", href: "/components/feedback-indicators/badge" },
      ]}
    />
  );
}
