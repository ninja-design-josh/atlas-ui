import figma from "@figma/code-connect";
import { Select } from "@/components/ui/select";

figma.connect(
  Select,
  "https://www.figma.com/design/AjwZJsf64tNSbbSSLF234H?node-id=318:1189",
  {
    props: {
      label: figma.string("Label"),
      placeholder: figma.string("Placeholder"),
      disabled: figma.boolean("Disabled"),
    },
    example: ({ label, placeholder, disabled }) => (
      <Select
        label={label}
        placeholder={placeholder}
        disabled={disabled}
        options={[{ value: "option1", label: "Option 1" }]}
      />
    ),
  }
);
