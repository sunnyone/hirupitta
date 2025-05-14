import { Mastra } from '@mastra/core';
import { hirupittaAgent, clarifyAgent, filterAgent, rankAgent } from "./agents";
import { lunchWorkflow } from "./workflows";
import { getLangfuseExporter } from './langfuse-exporter';

export const mastra = new Mastra({
    agents: {
        hirupitta: hirupittaAgent, 
        clarify: clarifyAgent, 
        filter: filterAgent, 
        rank: rankAgent
    },
    workflows: {
        lunch: lunchWorkflow
    },
    telemetry: {
        serviceName: "ai", // this must be set to "ai" so that the LangfuseExporter thinks it's an AI SDK trace
        enabled: true,
        export: {
            type: "custom",
            exporter: getLangfuseExporter(),
        },
    }
});
