import { registerOTel } from "@vercel/otel";
import { getLangfuseExporter } from "./mastra/langfuse-exporter";

export function register() {
  console.error("Debugging register");
  console.error(registerOTel as any);
  console.error(registerOTel.toString());

  registerOTel({
    serviceName: "ai",
    traceExporter: getLangfuseExporter(),
  });
}
