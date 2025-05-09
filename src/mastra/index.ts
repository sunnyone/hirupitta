import { Mastra } from '@mastra/core';
import { hirupittaAgent, clarifyAgent, filterAgent, rankAgent } from "./agents";
import { lunchWorkflow } from "./workflows";
import { AISDKExporter } from 'langsmith/vercel';

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
        serviceName: "hirupitta-service",
        enabled: true,
        export: {
            type: "custom",
            exporter: new AISDKExporter(),
        },
    },
});
