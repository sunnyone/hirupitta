import type { NextApiRequest, NextApiResponse } from 'next';
import { hirupittaAgent } from '../../src/mastra/agents';

type RequestData = {
  query: string;
};

type ResponseData = {
  response: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req.body as RequestData;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    try {
      const result = await hirupittaAgent.generate([
        { role: 'user', content: query }
      ]);
      
      return res.status(200).json({ response: result });
    } catch (agentError: any) {
      console.error('Agent error:', agentError);
      
      if (agentError.toString().includes('OpenAI API key is missing') || 
          agentError.toString().includes('Incorrect API key provided')) {
        
        let mockResponse = '';
        
        if (query.includes('静か') || query.includes('quiet')) {
          mockResponse = `
開発モード: OpenAI APIキーが正しく設定されていません。

以下はモックレスポンスです:

1. 静かな喫茶店（カフェ）[95]
   💡 落ち着いた雰囲気で集中できる空間
2. 個室居酒屋 和み（和食）[85]
   💡 プライベート空間でゆっくり食事可能
3. ガーデンレストラン（洋食）[80]
   💡 緑に囲まれた静かなテラス席あり
`;
        } else if (query.includes('安い') || query.includes('cheap')) {
          mockResponse = `
開発モード: OpenAI APIキーが正しく設定されていません。

以下はモックレスポンスです:

1. 大衆食堂 まんぷく（定食）[90]
   💡 リーズナブルな価格で満足感あり
2. 中華料理 龍（中華）[85]
   💡 ランチセットがコスパ良し
3. 立ち食いそば 匠（そば）[80]
   💡 素早く食べられて経済的
`;
        } else {
          mockResponse = `
開発モード: OpenAI APIキーが正しく設定されていません。

以下はモックレスポンスです:

1. カフェレストラン サニー（洋食）[90]
   💡 明るい雰囲気で気分転換になる
2. 和食処 さくら（和食）[85]
   💡 季節の食材を使った料理が楽しめる
3. イタリアン ベラ（イタリアン）[80]
   💡 本格的なパスタが美味しい
`;
        }
        
        return res.status(200).json({ response: mockResponse });
      }
      
      throw agentError;
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
