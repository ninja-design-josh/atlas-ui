import figma from "@figma/code-connect";
import { Avatar } from "@/components/ui/avatar";

figma.connect(
  Avatar,
  "https://www.figma.com/design/AjwZJsf64tNSbbSSLF234H?node-id=353:1349",
  {
    props: {
      size: figma.enum("Size", {
        SM: "sm",
        MD: "md",
        LG: "lg",
        XL: "xl",
      }),
      initials: figma.string("Initials"),
    },
    example: ({ size, initials }) => (
      <Avatar size={size} initials={initials} alt="User" />
    ),
  }
);
