import figma from "@figma/code-connect";
import { Textarea } from "@/components/ui/textarea";

figma.connect(
  Textarea,
  "https://www.figma.com/design/AjwZJsf64tNSbbSSLF234H?node-id=2913:1944",
  {
    props: {
      label: figma.string("Label"),
      placeholder: figma.string("Placeholder"),
      disabled: figma.boolean("Disabled"),
    },
    example: ({ label, placeholder, disabled }) => (
      <Textarea label={label} placeholder={placeholder} disabled={disabled} />
    ),
  }
);
