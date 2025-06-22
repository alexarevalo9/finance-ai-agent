# Finance AI Assistant

> An AI-powered financial assistant built with **Next.js App Router**, **@ai-sdk/react**, and **Vectorize.io**. Ask about cryptocurrency prices, credit-card products, or general finance topics and get authoritative, multi-language answers enriched with live data and retrieved documents.

---

## ✨ Key Features

• **Conversational Agent** – Powered by OpenAI `gpt-4o` via `@ai-sdk`, with tool-calling for dynamic data lookup.  
• **Contextual Retrieval** – Searches your private knowledge base through Vectorize pipelines to ground responses.  
• **Live Crypto Prices** – Fetches real-time quotes from the CoinGecko API.  
• **Multi-language** – Detects the user language automatically and answers in the same language.  
• **Rich UI** – Tailwind-powered chat interface with typing indicators, tool execution logs, and source citations.

---

## ⚙️ How It Works

1. **User sends a message** from `components/agent-chat.tsx`.
2. The message is POSTed to **`/api/agent`** where we invoke `streamText` from **@ai-sdk**.
3. The assistant may decide to call one of two _tools_:
   • `getBancoPichinchaCreditCardsInfo` → Uses `RetrievalService` → `VectorizeService` → Vectorize API.  
   • `getCryptoPrices` → Direct call to the CoinGecko REST API.
4. Tool results are streamed back to the model as function results, allowing the model to craft a grounded response.
5. The final assistant message, along with structured tool call data, is streamed to the frontend and rendered in the chat.

---

## 🖼️ Architecture Flow Chart

![Architecture Flow](./chart.png)

---

## 📁 Important Modules

| Path                        | Responsibility                                                            |
| --------------------------- | ------------------------------------------------------------------------- |
| `app/api/agent/route.ts`    | Defines the streaming chat endpoint, system prompt, and tool definitions. |
| `components/agent-chat.tsx` | Front-end chat widget that streams responses and visualises tool calls.   |
| `lib/retrieval.ts`          | Wraps `VectorizeService` to format retrieved documents for the LLM.       |
| `lib/vectorize.ts`          | Thin client around Vectorize REST API for semantic search.                |
| `types/*`                   | Shared TypeScript interfaces for vectorize docs and chat sources.         |
| `lib/consts.ts`             | List of whimsical loading messages for the UI.                            |
| `lib/utils.ts`              | Tailwind-merge helper `cn`.                                               |

---

## 🛠️ Getting Started

```bash
# 1. Install dependencies
pnpm install  # or npm / yarn / bun

# 2. Set environment variables (see below)
cp .env.example .env.local && $EDITOR .env.local

# 3. Run the dev server
pnpm dev
```

Open <http://localhost:3000> and start chatting! 🚀

### Required Environment Variables

| Variable                          | Description                              |
| --------------------------------- | ---------------------------------------- |
| `OPENAI_API_KEY`                  | Your OpenAI key used by `@ai-sdk`        |
| `VECTORIZE_PIPELINE_ACCESS_TOKEN` | Secret token for your Vectorize pipeline |
| `VECTORIZE_ORGANIZATION_ID`       | Vectorize organization id                |
| `VECTORIZE_PIPELINE_ID`           | Pipeline id containing your finance docs |

> _Tip:_ You can retrieve Vectorize IDs from the dashboard under **Settings → API**.

---

## 📝 Example Prompts

```text
¿Cuál es la mejor tarjeta de crédito de Banco Pichincha para acumular millas?

¿Cuánto cuesta 1 BTC y 2 ETH en USD ahora mismo?

Recomiéndame una estrategia para ahorrar dinero si mi ingreso mensual es de $1500.
```

---

## 🚀 Deployment

The app is zero-config on **Vercel**:

1. Push your repo.
2. Add the environment variables in the Vercel dashboard.
3. Profit 🎉

---

## 🤝 Contributing

1. Fork the repo & create a feature branch.
2. Follow the existing ESLint & Prettier rules.
3. Open a pull request – all PRs are welcome!

---

## 📄 License

MIT © 2024 Alex
