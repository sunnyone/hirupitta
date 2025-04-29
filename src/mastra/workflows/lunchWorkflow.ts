import { Workflow, Step } from "@mastra/core/workflows";
import { z } from "zod";
import { clarifyAgent, filterAgent, rankAgent } from "../agents";
import { getRestaurants } from "../tools/getRestaurants";
import { CondSchema } from "../schemas/lunchSchemas";

const TriggerSchema = z.object({
  query: z.string().describe("ユーザーからの昼食に関する要望"),
});

export const lunchWorkflow = new Workflow({
  name: "昼食選択ワークフロー",
  triggerSchema: TriggerSchema,
})
  .step({
    id: "clarify",
    name: "要望の明確化",
    description: "ユーザーの自然な要望を構造化JSONに変換",
    outputSchema: CondSchema,
    execute: async ({ context }) => {
      return await clarifyAgent.generate(
        [{ role: "user", content: context.triggerData.query }]
      );
    },
  })
  .then({
    id: "filter",
    name: "レストランのフィルタリング",
    description: "条件に基づいてレストランをフィルタリング",
    outputSchema: z.array(z.any()),
    execute: async ({ prev }) => {
      const conditions = prev;
      const restaurants = await getRestaurants();
      return await filterAgent.generate(
        [
          {
            role: "user",
            content: JSON.stringify({
              restaurants,
              conditions,
            }),
          },
        ]
      );
    },
  })
  .then({
    id: "rank",
    name: "レストランのランク付け",
    description: "フィルタリングされたレストランを出力",
    execute: async ({ prev }) => {
      const candidates = prev;
      return await rankAgent.generate(
        [
          {
            role: "user",
            content: JSON.stringify({ cand: candidates }),
          },
        ]
      );
    },
  })
  .commit();
