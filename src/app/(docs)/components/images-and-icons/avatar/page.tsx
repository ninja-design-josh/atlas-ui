"use client";

import { Avatar } from "@/components/ui/avatar";
import type { AvatarSize } from "@/components/ui/avatar";
import { ComponentSection, DocSubheading } from "@/components/docs/component-section";
import { LivePreview } from "@/components/docs/live-preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable, type PropDef } from "@/components/docs/props-table";

const IMPORT = `import { Avatar } from "@/components/ui/avatar";`;

const USAGE = `// With image — falls back to initials if the URL fails
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

const PROPS: PropDef[] = [
  { name: "src",      type: "string",  description: "Image URL. Falls back to initials or icon if the image fails to load." },
  { name: "alt",      type: "string",  default: '""', description: "Alt text for the image." },
  { name: "initials", type: "string",  description: "1–2 characters shown when no image is available." },
  { name: "size",     type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "Diameter of the avatar circle." },
];

export default function AvatarPage() {
  return (
    <ComponentSection
      id="avatar"
      name="Avatar"
      status="stable"
      description="A circular image or fallback representing a user, team, or entity. Falls back gracefully: image → initials → generic icon."
      whenToUse={[
        "Use in navigation headers, comment threads, and user list rows.",
        "Provide initials as a fallback for when a profile image is unavailable.",
        "Use size=xl for profile pages; size=sm for dense tables or sidebar items.",
      ]}
      controlDefs={[
        { prop: "initials", type: "string", default: "JB" },
        { prop: "size",     type: "enum",   options: ["sm","md","lg","xl"], default: "md" },
        { prop: "alt",      type: "string", default: "Josh Brinksman" },
      ]}
      renderPreview={(p) => (
        <Avatar initials={p.initials as string} size={p.size as AvatarSize} alt={p.alt as string} />
      )}
    >
      <div>
        <DocSubheading>Sizes</DocSubheading>
        <LivePreview>
          {(["sm","md","lg","xl"] as const).map((size) => (
            <div key={size} className="flex flex-col items-center gap-1">
              <Avatar initials={size.toUpperCase()} size={size} />
              <span className="text-caption text-grey-50">{size}</span>
            </div>
          ))}
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
            <Avatar size="lg" alt="No image or initials" />
            <span className="text-caption text-grey-50">No src/initials</span>
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
