import type { GeminiMessage } from '../types';

const apiUrl = (import.meta as ImportMeta & {
  env?: Record<string, string | undefined>;
}).env?.VITE_API_URL || 'http://localhost:3001/api';

export const requestGemini = async (
  messages: GeminiMessage[],
  systemInstruction?: string
): Promise<string> => {
  const response = await fetch(`${apiUrl}/ai/generate`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages.map(({ role, text }) => ({ role, parts: [{ text }] })),
      systemInstruction
    })
  });
  const data = await response.json() as { text?: string; error?: string };
  if (!response.ok) {
    throw new Error(data.error || 'A API do Gemini retornou um erro.');
  }

  const text = data.text?.trim();
  if (!text) {
    throw new Error('A API do Gemini retornou uma resposta vazia.');
  }

  return text;
};
