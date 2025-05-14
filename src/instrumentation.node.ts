import {
  NodeSDK,
  ATTR_SERVICE_NAME,
  Resource,
} from '@mastra/core/telemetry/otel-vendor';
import { getLangfuseExporter } from "./mastra/langfuse-exporter";

const exporter = getLangfuseExporter();

const sdk = new NodeSDK({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: 'ai',
  }),
  traceExporter: exporter,
});

sdk.start();