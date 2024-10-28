// app/api/chatbot/route.ts
import { NextResponse } from 'next/server';
import data from '../responses.json';
import stringSimilarity from 'string-similarity';

export async function POST(request: Request) {
  const { message } = await request.json();
  const response = findResponse(message);
  return NextResponse.json({ response: response || "I'm not sure about that. Let me connect you to a human agent." });
}

function findResponse(message: string): string | null {
  let bestMatch: string | null = null;
  let highestScore = 0;

  Object.values(data).forEach((category) => {
    category.forEach((entry: { pattern: string; response: string }) => {
      const score = stringSimilarity.compareTwoStrings(entry.pattern.toLowerCase(), message.toLowerCase());
      if (score > highestScore) {
        highestScore = score;
        bestMatch = entry.response;
      }
    });
  });

  return bestMatch;
}
