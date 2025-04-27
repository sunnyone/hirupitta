import { z } from "zod";

/* ==== 共有スキーマ ==== */
export const CondSchema = z.object({
  人数:           z.number(),
  最大徒歩分数:   z.number(),
  混雑希望レベル: z.enum(["空いている", "普通まで", "人気店も可"]),
  ジャンル希望:   z.string().nullable(),
  その他条件:     z.string().nullable(),
});

export type Cond = z.infer<typeof CondSchema>;
