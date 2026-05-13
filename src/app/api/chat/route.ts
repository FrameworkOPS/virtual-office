import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { getAgent } from '@/lib/agents/config';

export const runtime = 'nodejs';
export const maxDuration = 60;

type IncomingMessage = { role: 'user' | 'assistant'; content: string };

export async function POST(req: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        {
          error:
            'ANTHROPIC_API_KEY is not set on the server. Add it to your environment (e.g. `.env.local`) and restart the dev server.',
        },
        { status: 500 },
      );
    }

    const body = (await req.json()) as {
      agentId?: string;
      messages?: IncomingMessage[];
    };

    const agent = body.agentId ? getAgent(body.agentId) : undefined;
    if (!agent) {
      return Response.json(
        { error: `Unknown agent: ${body.agentId ?? '(missing)'}` },
        { status: 404 },
      );
    }

    const messages = (body.messages ?? [])
      .filter((m) => typeof m?.content === 'string' && m.content.trim().length > 0)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    if (messages.length === 0) {
      return Response.json({ error: 'No messages provided.' }, { status: 400 });
    }

    const result = streamText({
      model: anthropic('claude-sonnet-4-6'),
      system: agent.systemPrompt,
      messages,
      onError: ({ error }) => {
        console.error('[api/chat] streamText error:', error);
      },
    });

    return result.toTextStreamResponse();
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Unknown server error';
    console.error('[api/chat] route error:', err);
    return Response.json({ error: message }, { status: 500 });
  }
}
