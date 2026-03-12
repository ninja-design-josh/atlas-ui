"use client";

import * as React from "react";
import { DocsLayout, type NavItem } from "@/components/docs/docs-layout";
import { SearchModal } from "@/components/docs/search-modal";

const NAV_ITEMS: NavItem[] = [
  { type: "top-section", label: "Getting started", href: "/getting-started" },
  { type: "top-section", label: "Foundations", href: "/foundations" },
  { type: "top-section", label: "Design", href: "/design" },
  { type: "top-section", label: "Content", href: "/content" },
  { type: "top-section", label: "Patterns", href: "/patterns" },
  {
    type: "top-section",
    label: "Components",
    children: [
      {
        type: "category",
        label: "Actions",
        children: [
          { type: "link", href: "/components/actions/account-connection", label: "Account connection", status: "coming-soon" },
          { type: "link", href: "/components/actions/button",             label: "Button",             status: "stable" },
          { type: "link", href: "/components/actions/button-group",       label: "Button group",       status: "coming-soon" },
        ],
      },
      {
        type: "category",
        label: "Layout and structure",
        children: [
          { type: "link", href: "/components/layout-and-structure/bleed",        label: "Bleed",        status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/block-stack",  label: "Block stack",  status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/box",          label: "Box",          status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/callout-card", label: "Callout card", status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/card",         label: "Card",         status: "stable" },
          { type: "link", href: "/components/layout-and-structure/divider",      label: "Divider",      status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/empty-state",  label: "Empty state",  status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/form-layout",  label: "Form layout",  status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/grid",         label: "Grid",         status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/inline-grid",  label: "Inline grid",  status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/inline-stack", label: "Inline stack", status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/layout",       label: "Layout",       status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/media-card",   label: "Media card",   status: "coming-soon" },
          { type: "link", href: "/components/layout-and-structure/page",         label: "Page",         status: "coming-soon" },
        ],
      },
      {
        type: "category",
        label: "Selection and input",
        children: [
          { type: "link", href: "/components/selection-and-input/autocomplete",  label: "Autocomplete",  status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/checkbox",      label: "Checkbox",      status: "stable" },
          { type: "link", href: "/components/selection-and-input/choice-list",   label: "Choice list",   status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/color-picker",  label: "Color picker",  status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/combobox",      label: "Combobox",      status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/date-picker",   label: "Date picker",   status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/drop-zone",     label: "Drop zone",     status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/filters",       label: "Filters",       status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/form",          label: "Form",          status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/index-filters", label: "Index filters", status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/inline-error",  label: "Inline error",  status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/input",         label: "Input",         status: "stable" },
          { type: "link", href: "/components/selection-and-input/radio-button",  label: "Radio button",  status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/range-slider",  label: "Range slider",  status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/select",        label: "Select",        status: "stable" },
          { type: "link", href: "/components/selection-and-input/switch",        label: "Switch",        status: "stable" },
          { type: "link", href: "/components/selection-and-input/tag",           label: "Tag",           status: "coming-soon" },
          { type: "link", href: "/components/selection-and-input/textarea",      label: "Textarea",      status: "stable" },
        ],
      },
      {
        type: "category",
        label: "Images and icons",
        children: [
          { type: "link", href: "/components/images-and-icons/avatar",          label: "Avatar",          status: "stable" },
          { type: "link", href: "/components/images-and-icons/icon",            label: "Icon",            status: "coming-soon" },
          { type: "link", href: "/components/images-and-icons/keyboard-key",    label: "Keyboard key",    status: "coming-soon" },
          { type: "link", href: "/components/images-and-icons/thumbnail",       label: "Thumbnail",       status: "coming-soon" },
          { type: "link", href: "/components/images-and-icons/video-thumbnail", label: "Video thumbnail", status: "coming-soon" },
        ],
      },
      {
        type: "category",
        label: "Feedback indicators",
        children: [
          { type: "link", href: "/components/feedback-indicators/badge",                 label: "Badge",                 status: "stable" },
          { type: "link", href: "/components/feedback-indicators/banner",                label: "Banner",                status: "coming-soon" },
          { type: "link", href: "/components/feedback-indicators/exception-list",        label: "Exception list",        status: "coming-soon" },
          { type: "link", href: "/components/feedback-indicators/progress-bar",          label: "Progress bar",          status: "coming-soon" },
          { type: "link", href: "/components/feedback-indicators/skeleton-body-text",    label: "Skeleton body text",    status: "coming-soon" },
          { type: "link", href: "/components/feedback-indicators/skeleton-display-text", label: "Skeleton display text", status: "coming-soon" },
          { type: "link", href: "/components/feedback-indicators/skeleton-page",         label: "Skeleton page",         status: "coming-soon" },
          { type: "link", href: "/components/feedback-indicators/skeleton-tabs",         label: "Skeleton tabs",         status: "coming-soon" },
          { type: "link", href: "/components/feedback-indicators/skeleton-thumbnail",    label: "Skeleton thumbnail",    status: "coming-soon" },
          { type: "link", href: "/components/feedback-indicators/spinner",               label: "Spinner",               status: "coming-soon" },
        ],
      },
      {
        type: "category",
        label: "Typography",
        children: [
          { type: "link", href: "/components/typography/text", label: "Text", status: "coming-soon" },
        ],
      },
      {
        type: "category",
        label: "Tables",
        children: [
          { type: "link", href: "/components/tables/data-table",  label: "Data table",  status: "coming-soon" },
          { type: "link", href: "/components/tables/index-table", label: "Index table", status: "coming-soon" },
        ],
      },
      {
        type: "category",
        label: "Lists",
        children: [
          { type: "link", href: "/components/lists/action-list",      label: "Action list",      status: "coming-soon" },
          { type: "link", href: "/components/lists/description-list", label: "Description list", status: "coming-soon" },
          { type: "link", href: "/components/lists/list",             label: "List",             status: "coming-soon" },
          { type: "link", href: "/components/lists/listbox",          label: "Listbox",          status: "coming-soon" },
          { type: "link", href: "/components/lists/option-list",      label: "Option list",      status: "coming-soon" },
          { type: "link", href: "/components/lists/resource-item",    label: "Resource item",    status: "coming-soon" },
          { type: "link", href: "/components/lists/resource-list",    label: "Resource list",    status: "coming-soon" },
        ],
      },
      {
        type: "category",
        label: "Navigation",
        children: [
          { type: "link", href: "/components/navigation/footer-help", label: "Footer help", status: "coming-soon" },
          { type: "link", href: "/components/navigation/link",        label: "Link",        status: "coming-soon" },
          { type: "link", href: "/components/navigation/pagination",  label: "Pagination",  status: "coming-soon" },
          { type: "link", href: "/components/navigation/tabs",        label: "Tabs",        status: "coming-soon" },
        ],
      },
      {
        type: "category",
        label: "Overlays",
        children: [
          { type: "link", href: "/components/overlays/popover", label: "Popover", status: "coming-soon" },
          { type: "link", href: "/components/overlays/tooltip", label: "Tooltip", status: "coming-soon" },
        ],
      },
      {
        type: "category",
        label: "Utilities",
        children: [
          { type: "link", href: "/components/utilities/app-provider",  label: "App provider",  status: "coming-soon" },
          { type: "link", href: "/components/utilities/collapsible",   label: "Collapsible",   status: "coming-soon" },
          { type: "link", href: "/components/utilities/scrollable",    label: "Scrollable",    status: "coming-soon" },
        ],
      },
    ],
  },
  {
    type: "top-section",
    label: "Tokens",
    children: [
      { type: "link", href: "/tokens/color",      label: "Color",      status: "stable" },
      { type: "link", href: "/tokens/typography", label: "Typography", status: "stable" },
    ],
  },
  { type: "top-section", label: "Icons",          href: "/icons" },
  { type: "top-section", label: "Contributing",   href: "/contributing" },
  { type: "top-section", label: "Tools",          href: "/tools" },
  { type: "top-section", label: "Version guides", href: "/version-guides" },
];

const SEARCH_ITEMS = [
  { id: "components/actions/button",               label: "Button",   description: "Action trigger — solid, outlined, ghost variants",          type: "component" as const },
  { id: "components/layout-and-structure/card",    label: "Card",     description: "Surface container — compose with CardHeader etc.",          type: "component" as const },
  { id: "components/selection-and-input/input",    label: "Input",    description: "Text input with label, hint, error, icon support",          type: "component" as const },
  { id: "components/selection-and-input/textarea", label: "Textarea", description: "Multi-line text input",                                     type: "component" as const },
  { id: "components/selection-and-input/select",   label: "Select",   description: "Native dropdown for fixed option lists",                    type: "component" as const },
  { id: "components/selection-and-input/checkbox", label: "Checkbox", description: "Boolean toggle for form opt-ins",                          type: "component" as const },
  { id: "components/selection-and-input/switch",   label: "Switch",   description: "Immediate-effect boolean toggle",                          type: "component" as const },
  { id: "components/images-and-icons/avatar",      label: "Avatar",   description: "User representation — image, initials, icon",              type: "component" as const },
  { id: "components/feedback-indicators/badge",    label: "Badge",    description: "Status/label indicator with semantic variants",            type: "component" as const },
];

export default function DocsRootLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      if (localStorage.getItem("atlas-dark-mode") === "true") setDarkMode(true);
    } catch { /* SSR */ }
  }, []);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function toggleDark() {
    const next = !darkMode;
    setDarkMode(next);
    try { localStorage.setItem("atlas-dark-mode", String(next)); } catch { /* ignore */ }
  }

  return (
    <DocsLayout
      navItems={NAV_ITEMS}
      darkMode={darkMode}
      onDarkModeToggle={toggleDark}
      onSearchOpen={() => setSearchOpen(true)}
    >
      {children}
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        items={SEARCH_ITEMS}
      />
    </DocsLayout>
  );
}
