import { Mastra } from '@mastra/core';
import { hirupittaAgent } from "./agents";

export const mastra = new Mastra({
    agents: [hirupittaAgent]
});
