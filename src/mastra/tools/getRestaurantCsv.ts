import { createTool } from "@mastra/core";
import {z} from "zod";

const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQH5NNPjipDl1cHc2z1GElfrlrtQ4Wb8yvgy644XEEygWOIIw5VyqeD9WRMd1ljhCrVVEmgmpyypA2o/pub?output=csv";

/**
 * Fetches CSV data from a URL
 * @param url URL to fetch CSV data from
 * @returns Promise<string> CSV data as string
 */
export async function fetchCsvFromUrl(url: string): Promise<string> {
    const resp = await fetch(url);
    const text = await resp.text();
    return text;
}

export async function fetchRestaurantCsv() {
    return fetchCsvFromUrl(csvUrl);
}

export const getRestaurantsCsvTool = createTool({
    id: 'get-restaurants',
    description: '保存されているレストラン情報を返す',
    inputSchema: z.object({
    }),
    outputSchema: z.string(),
    execute: async ({ }) => {
        return await fetchCsvFromUrl(csvUrl);
    },
  });
  