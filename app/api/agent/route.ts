import { ToolInvocation, experimental_createMCPClient, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

import { z } from 'zod';
import { RetrievalService } from '@/lib/retrieval';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

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

const truncateResponse = (
  response: unknown,
  maxLength: number = 2000
): string => {
  const str =
    typeof response === 'string' ? response : JSON.stringify(response, null, 2);
  if (str.length <= maxLength) return str;
  return (
    str.substring(0, maxLength) + '\n\n... (response truncated due to length)'
  );
};

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  let mcpClient:
    | Awaited<ReturnType<typeof experimental_createMCPClient>>
    | undefined;

  let mcpTools: Record<string, unknown> = {};

  try {
    mcpClient = await experimental_createMCPClient({
      transport: new StreamableHTTPClientTransport(
        new URL(
          'https://server.smithery.ai/@MCP-100/stock-market-server/mcp?api_key=9bb3cb2e-7614-489d-ad60-d03626c7ecbb'
        )
      ),
    });

    mcpTools = await mcpClient.tools();
    console.log('Successfully connected to Smithery stock market server');
    console.log('Available MCP tools:', Object.keys(mcpTools));
  } catch (error) {
    console.error('Failed to connect to MCP server:', error);
    // Continue without MCP tools if connection fails
  }

  const systemPrompt = `You are a finance AI assistant specializing in credit cards, stocks, and cryptocurrency. Always respond in the user's language and translate any retrieved content to match their language.`;

  const result = streamText({
    model: openai('gpt-4o-mini'), // Use mini version for better token efficiency
    system: systemPrompt,
    messages,
    maxSteps: 3, // Reduce steps to manage token usage
    maxTokens: 1000, // Limit response length
    tools: {
      ...mcpTools,
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
          return truncateResponse(documents);
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
          return truncateResponse(prices);
        },
      },
    },
    onStepFinish: (step) => {
      console.log(step.response);
      console.log('toolCalls==>', step.toolCalls);
      console.log('toolResults==>', step.toolResults);
    },
    onFinish: async () => {
      if (mcpClient) {
        try {
          await mcpClient.close();
          console.log('MCP client connection closed');
        } catch (error) {
          console.error('Error closing MCP client:', error);
        }
      }
    },
  });

  return result.toDataStreamResponse();
}
