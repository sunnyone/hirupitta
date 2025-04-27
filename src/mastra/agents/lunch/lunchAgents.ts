import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { getRestaurants, RestaurantSchema, getRestaurantsTool } from "../../tools/getRestaurants";
import { CondSchema } from "../../schemas/lunchSchemas";

/* ------------------------------------------------------- *
 *  ⭐ 1) Clarify Agent                                     *
 * ------------------------------------------------------- */
export const clarifyAgent = new Agent({
  name: "Clarify Agent",
  /**
   * System-level Instructions
   * -------------------------
   * - 背景: オフィスの同僚がお昼を選ぶ "Lunch-Selector Workflow" の入口
   * - 目的: ユーザーの自然文を、後続フィルタで使える **構造化 JSON** に変換
   */
  instructions: `
あなたは「Lunch-Selector Workflow」の最初の守護者です。
このワークフローのゴールは **"今この瞬間に最適なランチ候補を 3 件提案する"** こと。
後続エージェント（Filter → Rank）が機械的に処理できるよう、
ユーザーの曖昧な要望を以下スキーマで厳密に出力してください。余計な文字は出力禁止。

${CondSchema.toString()} 
`,
  model: openai("gpt-4o-mini"),
});

/* ------------------------------------------------------- *
 *  ⭐ 2) Filter Agent                                      *
 * ------------------------------------------------------- */
export const filterAgent = new Agent({
  name: "Filter Agent",
  /**
   * System-level Instructions
   * -------------------------
   * - 背景: ランチ候補リストと整理済み条件を受け取り "行ける店だけ" に絞る番人
   * - 入力: role:user で渡されるオブジェクト
   *   {
   *     "restaurants": Restaurant[],   // getRestaurants ツールの結果
   *     "conditions":  CondSchema      // Clarify Agent の成果物
   *   }
   * - 出力: Restaurant[] — **同じスキーマ** で返す
   */
  instructions: `
あなたは Lunch-Selector Workflow の「フィルタリング担当」です。
ゴールは **"条件をすべて満たす店だけを残す"** こと。
入力 JSON の "restaurants" 配列を走査し、下記ルールで精査してください:

  1. seats  ≥  conditions.人数
  2. walkMinutes ≤ conditions.最大徒歩分数
  3. crowdLevel  : 
       - "人気店も可"     → 制限なし
       - "普通まで"       → "空いている" | "普通" を許可
       - "空いている"     → "空いている" のみ
  4. ジャンル希望が null でない場合、部分一致必須

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
入力 "cand" は **すでに行けることが確定した店リスト** です。
以下優先度で比較し、上位 3 件のみ提案してください。  
  A. walkMinutes が短いほど上位  
  B. seats が多いほど上位  
  C. crowdLevel が "空いている" を優先  

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
