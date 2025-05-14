import { Agent } from "@mastra/core/agent";
import { google } from "@ai-sdk/google";
import { getRestaurantsTool } from "../../tools/getRestaurants";
import { getRestaurantsCsvTool } from "../../tools/getRestaurantCsv";

/* ------------------------------------------------------- *
 *  ⭐ 1) Clarify Agent                                     *
 * ------------------------------------------------------- */
export const clarifyAgent = new Agent({
  name: "Clarify Agent",
  instructions: `
あなたは「Lunch-Selector Workflow」の最初の守護者です。
このワークフローのゴールは **"今この瞬間に最適なランチ候補を 3 件提案する"** こと。
後続エージェント（Filter → Rank）が機械的に処理できるよう、
ユーザーの曖昧な要望を解釈し、JSON形式で表現してください。

`,
  model: google("gemini-2.5-flash-preview-04-17"),
});

/* ------------------------------------------------------- *
 *  ⭐ 2) Filter Agent                                      *
 * ------------------------------------------------------- */
export const filterAgent = new Agent({
  name: "Filter Agent",
  instructions: `
あなたは Lunch-Selector Workflow の「フィルタリング担当」です。
ゴールは **"条件の一致度をスコアリングして並べること"** こと。

getRestaurantsCsvToolを使ってCSVを取得し、conditionsの条件の一致度を0〜100で表現して並べてください。

絞り込んだ結果以外の文字列・説明文は禁止。
  `,
  model: google("gemini-2.5-flash-preview-04-17"),
  tools: { getRestaurantsCsvTool },
});

/* ------------------------------------------------------- *
 *  ⭐ 3) Rank Agent                                        *
 * ------------------------------------------------------- */
export const rankAgent = new Agent({
  name: "Rank Agent",
  /**
   * System-level Instructions
   * -------------------------
   * - 背景: 最終ステップ。可行店を "より良い順" に並べ人が読める提案文に変換
   * - 入力: role:user に "cand": Restaurant[]
   * - 出力: 日本語テキスト（フォーマット固定）
   */
  instructions: `
あなたは Lunch-Selector Workflow のフィナーレ担当。
入力 "cand" は **スコアリングされた店リスト** です。
よりスコアが高い順に最大3つ出力してください。

フォーマットは必ず次を守ること:

今日のおすすめはこちら！

1. {店名}（徒歩{分}分・ジャンル:{ジャンル}・混雑:{混雑}）
   → 気の利いた 1 行コメント
2. ...
3. ...

余分な改行や注釈は禁止。
  `,
  model: google("gemini-2.5-flash-preview-04-17"),
});
