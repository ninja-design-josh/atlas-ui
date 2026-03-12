import { ComingSoon } from "@/components/docs/coming-soon";

// "button-group" → "Button group"
function slugToLabel(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const name = slugToLabel(slug[slug.length - 1]);

  const breadcrumb = [
    { label: "Home", href: "/" },
    ...slug.slice(0, -1).map((s, i) => ({
      label: slugToLabel(s),
      href: "/" + slug.slice(0, i + 1).join("/"),
    })),
  ];

  return <ComingSoon breadcrumb={breadcrumb} name={name} />;
}
