import { NextRequest, NextResponse } from 'next/server';
import { mastra } from '../../../src/mastra';
import { getLangfuseExporter } from '@/src/mastra/langfuse-exporter';
import { waitUntil } from "@vercel/functions";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    console.log("Runtime");
    console.log(process.env.NEXT_RUNTIME);

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    try {
      const hirupittaAgent = mastra.getAgent('hirupitta');
      const result = await hirupittaAgent.generate([
        { role: 'user', content: query }
      ]);
      const exporter =  getLangfuseExporter();
      // await exporter.forceFlush();
      waitUntil(exporter.forceFlush());

      return NextResponse.json({ response: result });
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
        
        return NextResponse.json({ response: mockResponse });
      }
      
      throw agentError;
    }
  } catch (error) {
    console.error('Error processing request:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
