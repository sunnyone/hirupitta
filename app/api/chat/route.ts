import { NextRequest, NextResponse } from 'next/server';
import { mastra } from '../../../src/mastra';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let mastraMessages;

    if (body.messages && Array.isArray(body.messages)) {
      mastraMessages = body.messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
    } else if (body.query) {
      mastraMessages = [{ role: 'user', content: body.query }];
    } else {
      return NextResponse.json(
        { error: 'Messages array or query is required' },
        { status: 400 }
      );
    }

    try {
      const hirupittaAgent = mastra.getAgent('hirupitta');
      const result = await hirupittaAgent.generate(mastraMessages);
      
      return NextResponse.json({ response: result });
    } catch (agentError: any) {
      console.error('Agent error:', agentError);
      
      if (agentError.toString().includes('OpenAI API key is missing') || 
          agentError.toString().includes('Incorrect API key provided')) {
        
        let mockResponse = '';
        
        const lastUserMessage = body.messages 
          ? body.messages.filter(msg => msg.sender === 'user').pop()?.text || ''
          : body.query || '';
        
        if (lastUserMessage.includes('静か') || lastUserMessage.includes('quiet')) {
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
        } else if (lastUserMessage.includes('安い') || lastUserMessage.includes('cheap')) {
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
