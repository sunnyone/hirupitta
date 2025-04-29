import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { getRestaurantsTool } from "../../tools/getRestaurants";

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
  model: openai("gpt-4o-mini"),
});

/* ------------------------------------------------------- *
 *  ⭐ 2) Filter Agent                                      *
 * ------------------------------------------------------- */
export const filterAgent = new Agent({
  name: "Filter Agent",
  instructions: `
あなたは Lunch-Selector Workflow の「フィルタリング担当」です。
ゴールは **"条件の一致度をスコアリングして並べること"** こと。
restaurantsのうち、conditionsの条件の一致度を0〜100で表現して並べてください。

**フォーマット厳守**:
上記条件を通過した店舗を **RestaurantSchema[]** と同じ形で出力。
それ以外の文字列・説明文は禁止。
  `,
  model: openai("gpt-4o-mini"),
  tools: { getRestaurantsTool }, // 追加ツールが必要ならここへ
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
  model: openai("gpt-4o-mini"),
});
