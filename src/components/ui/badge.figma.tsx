import figma from "@figma/code-connect";
import { Badge } from "@/components/ui/badge";

figma.connect(
  Badge,
  "https://www.figma.com/design/AjwZJsf64tNSbbSSLF234H?node-id=552:28",
  {
    props: {
      variant: figma.enum("Variant", {
        Default: "default",
        Success: "success",
        Warning: "warning",
        Error: "error",
        Info: "info",
        Purple: "purple",
      }),
      dot: figma.boolean("Dot"),
    },
    example: ({ variant, dot }) => (
      <Badge variant={variant} dot={dot}>
        Label
      </Badge>
    ),
  }
);
