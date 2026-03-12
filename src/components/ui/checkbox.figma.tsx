import figma from "@figma/code-connect";
import { Checkbox } from "@/components/ui/checkbox";

figma.connect(
  Checkbox,
  "https://www.figma.com/design/AjwZJsf64tNSbbSSLF234H?node-id=371:636",
  {
    props: {
      label: figma.string("Label"),
      disabled: figma.boolean("Disabled"),
      checked: figma.boolean("Checked"),
    },
    example: ({ label, disabled, checked }) => (
      <Checkbox label={label} disabled={disabled} defaultChecked={checked} />
    ),
  }
);
