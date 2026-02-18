import { createOpenAI, openai } from '@ai-sdk/openai';

const defaultModel = process.env.LLM_MODEL ?? 'gpt-5-mini-2025-08-07';

function getModelName(): string {
  if (process.env.USE_CLAUDE_OPUS_4_6 === 'true') {
    return 'anthropic/claude-opus-4-6';
  }
  return defaultModel;
}

function getProvider() {
  const hasOpenRouterKey = Boolean(process.env.OPENROUTER_API_KEY);
  const baseURL =
    process.env.OPENAI_BASE_URL ??
    process.env.OPENROUTER_BASE_URL ??
    (hasOpenRouterKey ? 'https://openrouter.ai/api/v1' : undefined);
  const apiKey = process.env.OPENROUTER_API_KEY ?? process.env.OPENAI_API_KEY;

  if (!baseURL) {
    return openai;
  }

  return createOpenAI({
    name: 'compatible',
    apiKey,
    baseURL,
    headers: {
      ...(process.env.OPENROUTER_SITE_URL ? { 'HTTP-Referer': process.env.OPENROUTER_SITE_URL } : {}),
      ...(process.env.OPENROUTER_APP_NAME ? { 'X-Title': process.env.OPENROUTER_APP_NAME } : {}),
    },
  });
}

export const defaultChatModel = getProvider()(getModelName());
