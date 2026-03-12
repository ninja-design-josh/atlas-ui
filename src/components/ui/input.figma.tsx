import figma from "@figma/code-connect";
import { Input } from "@/components/ui/input";

figma.connect(
  Input,
  "https://www.figma.com/design/AjwZJsf64tNSbbSSLF234H?node-id=318:1162",
  {
    props: {
      label: figma.string("Label"),
      placeholder: figma.string("Placeholder"),
      disabled: figma.boolean("Disabled"),
    },
    example: ({ label, placeholder, disabled }) => (
      <Input label={label} placeholder={placeholder} disabled={disabled} />
    ),
  }
);
