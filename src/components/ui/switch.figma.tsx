import figma from "@figma/code-connect";
import { Switch } from "@/components/ui/switch";

figma.connect(
  Switch,
  "https://www.figma.com/design/AjwZJsf64tNSbbSSLF234H?node-id=371:637",
  {
    props: {
      label: figma.string("Label"),
      disabled: figma.boolean("Disabled"),
      checked: figma.boolean("Checked"),
    },
    example: ({ label, disabled, checked }) => (
      <Switch label={label} disabled={disabled} defaultChecked={checked} />
    ),
  }
);
