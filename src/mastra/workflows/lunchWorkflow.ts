import { Workflow, Step } from "@mastra/core/workflows";
import { z } from "zod";
import { clarifyAgent, filterAgent, rankAgent } from "../agents";
import { getRestaurants } from "../tools/getRestaurants";
import { CondSchema } from "../schemas/lunchSchemas";

const TriggerSchema = z.object({
  query: z.string().describe("ユーザーからの昼食に関する要望"),
});

export const lunchWorkflow = new Workflow({
  id: "lunch-selector-workflow",
  name: "昼食選択ワークフロー",
  description: "ユーザーの要望に基づいて最適なランチ候補を提案するワークフロー",
  triggerSchema: TriggerSchema,
})
  .step({
    id: "clarify",
    name: "要望の明確化",
    description: "ユーザーの自然な要望を構造化JSONに変換",
    outputSchema: CondSchema,
    execute: async ({ trigger }) => {
      const { query } = trigger;
      return await clarifyAgent.chatCompletionAsJSON({
        messages: [{ role: "user", content: query }],
        parse: CondSchema,
      });
    },
  })
  .then({
    id: "filter",
    name: "レストランのフィルタリング",
    description: "条件に基づいてレストランをフィルタリング",
    outputSchema: z.array(z.any()),
    execute: async ({ prev }) => {
      const conditions = prev;
      const { restaurants } = await getRestaurants();
      return await filterAgent.chatCompletionAsJSON({
        messages: [
          {
            role: "user",
            content: JSON.stringify({
              restaurants,
              conditions,
            }),
          },
        ],
      });
    },
  })
  .then({
    id: "rank",
    name: "レストランのランク付け",
    description: "フィルタリングされたレストランを最適な順にランク付け",
    execute: async ({ prev }) => {
      const candidates = prev;
      return await rankAgent.chatCompletion({
        messages: [
          {
            role: "user",
            content: JSON.stringify({ cand: candidates }),
          },
        ],
      });
    },
  })
  .commit();
