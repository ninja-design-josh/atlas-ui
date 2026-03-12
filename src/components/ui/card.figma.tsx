import figma from "@figma/code-connect";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

figma.connect(
  Card,
  "https://www.figma.com/design/AjwZJsf64tNSbbSSLF234H?node-id=318:1376",
  {
    props: {
      padding: figma.enum("Padding", {
        None: "none",
        SM: "sm",
        MD: "md",
        LG: "lg",
      }),
      elevation: figma.enum("Elevation", {
        "0": 0,
        "1": 1,
        "2": 2,
        "4": 4,
        "8": 8,
      }),
    },
    example: ({ padding, elevation }) => (
      <Card padding={padding} elevation={elevation}>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
      </Card>
    ),
  }
);
