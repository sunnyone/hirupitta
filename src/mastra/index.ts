import { Mastra } from '@mastra/core';
import { hirupittaAgent, clarifyAgent, filterAgent, rankAgent } from "./agents";
import { lunchWorkflow } from "./workflows";

export const mastra = new Mastra({
    agents: [hirupittaAgent, clarifyAgent, filterAgent, rankAgent],
    workflows: [lunchWorkflow]
});
