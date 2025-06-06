import { registerOTel } from "@vercel/otel";
import { getLangfuseExporter } from "./src/mastra/langfuse-exporter";

export function register() {
  registerOTel({
    serviceName: "ai",
    traceExporter: getLangfuseExporter(),
  });
}
