import { Mastra } from '@mastra/core';
import { LangfuseExporter } from "langfuse-vercel";
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
    telemetry: {
        serviceName: "ai", // this must be set to "ai" so that the LangfuseExporter thinks it's an AI SDK trace
        enabled: true,
        export: {
            type: "custom",
            exporter: new LangfuseExporter({
                publicKey: process.env.LANGFUSE_PUBLIC_KEY,
                secretKey: process.env.LANGFUSE_SECRET_KEY,
                baseUrl: process.env.LANGFUSE_HOST,
            }),
        },
    }
});
