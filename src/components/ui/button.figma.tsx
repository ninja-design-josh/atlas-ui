import figma from "@figma/code-connect";
import { Button } from "@/components/ui/button";

figma.connect(
  Button,
  "https://www.figma.com/design/AjwZJsf64tNSbbSSLF234H?node-id=318:1088",
  {
    props: {
      variant: figma.enum("Variant", {
        Solid: "solid",
        Outlined: "outlined",
        Ghost: "ghost",
      }),
      color: figma.enum("Color", {
        Primary: "primary",
        Secondary: "secondary",
        Danger: "danger",
      }),
      size: figma.enum("Size", {
        SM: "sm",
        MD: "md",
        LG: "lg",
      }),
      loading: figma.boolean("Loading"),
      disabled: figma.boolean("Disabled"),
    },
    example: ({ variant, color, size, loading, disabled }) => (
      <Button variant={variant} color={color} size={size} loading={loading} disabled={disabled}>
        Button
      </Button>
    ),
  }
);
