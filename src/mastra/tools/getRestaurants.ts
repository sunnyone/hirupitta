import { createTool } from '@mastra/core/tools';
import { z } from "zod";

export const getRestaurantsTool = createTool({
    id: 'get-restaurants',
    description: '保存されているレストラン情報を返す',
    inputSchema: z.object({
    }),
    outputSchema: z.object({
        restaurants: z.array(z.string())
    }),
    execute: async ({ context }) => {
        return await getRestaurants();
    },
  });
  
export function getRestaurants() {
    return [{
            "name": "粋な一生",
            "reading": "いきないっしょう",
            "categories": ["ラーメン", "つけ麺"],
            "address": "東京都台東区台東1‑27‑2 竹善ビル 1F",
            "nearest_station": "秋葉原駅",
            "regular_holiday": "水曜日",
            "seating": {
              "total": 18,
              "counter": 10,
              "table": 8,
              "private_rooms": false
            },
    },
    {
        "name": "バー＆ジャンク・ミカク",
        "reading": "バーアンドジャンクミカク",
        "categories": ["ダイニングバー", "バー"],
        "address": "東京都千代田区神田和泉町1‑3‑3",
        "nearest_station": "秋葉原駅",
        "regular_holiday": "月曜日",
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
        "seating": {
            "total": 24,
            "counter": 8,
            "table": 16,
            "private_rooms": false
        }
    }
    ]
}