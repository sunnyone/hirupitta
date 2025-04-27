import { createTool } from '@mastra/core/tools';
import { z } from "zod";

export const RestaurantSchema = z.object({
    name: z.string(),
    reading: z.string(),
    categories: z.array(z.string()),
    address: z.string(),
    nearest_station: z.string(),
    regular_holiday: z.string(),
    walkMinutes: z.number(), // 追加
    crowdLevel: z.enum(["空いている", "普通", "混雑"]), // 追加
    seats: z.number(), // 追加
    seating: z.object({
        total: z.number(),
        counter: z.number().nullable(),
        table: z.number().nullable(),
        private_rooms: z.boolean()
    })
});

export type Restaurant = z.infer<typeof RestaurantSchema>;

export const getRestaurantsTool = createTool({
    id: 'get-restaurants',
    description: '保存されているレストラン情報を返す',
    inputSchema: z.object({
    }),
    outputSchema: z.object({
        restaurants: z.array(RestaurantSchema)
    }),
    execute: async ({ context }) => {
        return { restaurants: await getRestaurants() };
    },
  });
  
export async function getRestaurants(): Promise<Restaurant[]> {
    return [{
            "name": "粋な一生",
            "reading": "いきないっしょう",
            "categories": ["ラーメン", "つけ麺"],
            "address": "東京都台東区台東1‑27‑2 竹善ビル 1F",
            "nearest_station": "秋葉原駅",
            "regular_holiday": "水曜日",
            "walkMinutes": 5, // 追加
            "crowdLevel": "普通", // 追加
            "seats": 18, // 追加
            "seating": {
              "total": 18,
              "counter": 10,
              "table": 8,
              "private_rooms": false
            }
    },
    {
        "name": "バー＆ジャンク・ミカク",
        "reading": "バーアンドジャンクミカク",
        "categories": ["ダイニングバー", "バー"],
        "address": "東京都千代田区神田和泉町1‑3‑3",
        "nearest_station": "秋葉原駅",
        "regular_holiday": "月曜日",
        "walkMinutes": 8, // 追加
        "crowdLevel": "混雑", // 追加
        "seats": 39, // 追加
        "seating": {
          "total": 39,
          "counter": null,
          "table": null,
          "private_rooms": false
        }
      },
      
      {
        "name": "Nonnki PASTAYA",
        "reading": "ノンキパスタヤ",
        "categories": ["パスタ", "ピザ"],
        "address": "東京都千代田区神田和泉町1‑9‑3",
        "nearest_station": "秋葉原駅",
        "regular_holiday": "日曜・祝日",
        "walkMinutes": 3, // 追加
        "crowdLevel": "空いている", // 追加
        "seats": 24, // 追加
        "seating": {
            "total": 24,
            "counter": 8,
            "table": 16,
            "private_rooms": false
        }
    }
    ]
}
