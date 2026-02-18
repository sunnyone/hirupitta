import { Mastra } from '@mastra/core';
import { Observability } from '@mastra/observability';
import { LangfuseExporter } from '@mastra/langfuse';
import { hirupittaAgent, clarifyAgent, filterAgent, rankAgent } from "./agents";
import { lunchWorkflow } from "./workflows";

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
    observability: new Observability({
        configs: {
            default: {
                serviceName: "ai",
                exporters: [new LangfuseExporter()],
            },
        },
    }),
});
