import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { clarifyAgent, filterAgent, rankAgent } from "../agents";

const TriggerSchema = z.object({
  query: z.string().describe("ユーザーからの昼食に関する要望"),
});

const clarifyStep = createStep({
  id: "clarify",
  description: "ユーザーの自然な要望を構造化JSONに変換",
  inputSchema: TriggerSchema,
  outputSchema: z.any(),
  execute: async ({ inputData }) => {
    return await clarifyAgent.generate([
      { role: "user", content: inputData.query },
    ]);
  },
});

const filterStep = createStep({
  id: "filter",
  description: "条件に基づいてレストランをフィルタリング",
  inputSchema: z.any(),
  outputSchema: z.any(),
  execute: async ({ inputData }) => {
    const conditions = inputData;
    return await filterAgent.generate([
      {
        role: "user",
        content: JSON.stringify({
          conditions,
        }),
      },
    ]);
  },
});

const rankStep = createStep({
  id: "rank",
  description: "フィルタリングされたレストランを出力",
  inputSchema: z.any(),
  outputSchema: z.any(),
  execute: async ({ inputData }) => {
    const candidates = inputData;
    return await rankAgent.generate([
      {
        role: "user",
        content: JSON.stringify({ cand: candidates }),
      },
    ]);
  },
});

export const lunchWorkflow = createWorkflow({
  id: "lunch-workflow",
  description: "昼食選択ワークフロー",
  inputSchema: TriggerSchema,
  outputSchema: z.any(),
})
  .then(clarifyStep)
  .then(filterStep)
  .then(rankStep)
  .commit();
