import { registerOTel } from "@vercel/otel";
import { getLangfuseExporter } from "./mastra/langfuse-exporter";
import { waitUntil } from "@vercel/functions";

console.error("Import meta outer");
console.error(import.meta.url);

export function register() {
  console.error("Debugging register");
  console.error(registerOTel as any);
  console.error(registerOTel.toString());


  console.error("Import meta inner");
  console.error(import.meta.url);
  const resolve = import.meta.resolve as any;
  if (resolve) {
    console.error(resolve("@vercel/otel"));
  } else {
    console.error("resolve is not found");
  }

  const exporter = getLangfuseExporter();
  registerOTel({
    serviceName: "ai",
    traceExporter: exporter,
  });
  waitUntil(exporter.forceFlush());
}
