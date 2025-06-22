import { ToolInvocation, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { RetrievalService } from '@/lib/retrieval';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolInvocation[];
}

const getCryptoPrices = async (ids: string[], currency = 'usd') => {
  const idsParam = ids.join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${idsParam}&vs_currencies=${currency}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch prices: ${res.statusText}`);
  const result = await res.json();
  return result;
};

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  const systemPrompt = `You are a helpful AI assistant that specializes in answering questions about finance, credit cards, and cryptocurrency.

IMPORTANT LANGUAGE INSTRUCTIONS:
1. Always detect the language of the user's question
2. Always respond in the SAME language as the user's question
3. If you retrieve information from tools that is in a different language (e.g., Spanish), you MUST translate it to match the user's language
4. For example: If user asks in English but credit card info is in Spanish, translate all Spanish content to English before responding
5. Maintain the same tone and formality level as the user's question

When using tools:
- Use the retrieved information as your source of truth
- Always translate retrieved content to match the user's language
- Provide accurate, helpful responses based on the data retrieved`;

  const result = streamText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages,
    tools: {
      getBancoPichinchaCreditCardsInfo: {
        description:
          'This will pull information from credit cards from banco pichincha',
        parameters: z.object({
          query: z
            .string()
            .describe('The search query to find credit cards information'),
        }),
        execute: async ({ query }) => {
          const retrievalService = new RetrievalService();
          const documents = await retrievalService.searchDocuments(query);
          return documents;
        },
      },
      getCryptoPrices: {
        description:
          'This will pull information from crypto prices from the api from coingecko',
        parameters: z.object({
          ids: z
            .array(z.string())
            .describe('The ids of the crypto to get prices for'),
        }),
        execute: async ({ ids }) => {
          const prices = await getCryptoPrices(ids);
          return prices;
        },
      },
    },
    onStepFinish: (step) => {
      console.log(step.response);
      console.log('toolCalls==>', step.toolCalls);
      console.log('toolResults==>', step.toolResults);
    },
  });

  return result.toDataStreamResponse();
}
