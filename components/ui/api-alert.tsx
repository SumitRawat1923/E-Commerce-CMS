import React from "react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Copy, Server } from "lucide-react";
import { Badge } from "./badge";
import { Button } from "./button";
import toast from "react-hot-toast";


interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

interface AlertVariant {
  type: "secondary" | "destructive";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};
const variantMap: Record<ApiAlertProps["variant"], AlertVariant["type"]> = {
  public: "secondary",
  admin: "destructive",
};

function ApiAlert({ title, description, variant = "public" }: ApiAlertProps) {
  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success("Copied the API route to the clipboard.");
  };
  return (
    <Alert>
      <AlertTitle className="flex items-center gap-x-2">
        <Server className="w-4 h-4" />
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="flex mt-2 items-center justify-between">
        <code className="relative rounded bg-muted px-[.3rem] py-[.2rem] font-mono text-sm font-semiboldbold">
          {description}
        </code>
        <Button variant={"outline"} onClick={onCopy}>
          <Copy className="w-4 h-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}

export default ApiAlert;
