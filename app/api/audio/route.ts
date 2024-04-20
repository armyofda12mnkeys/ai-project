import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
	const { message, voiceType } = await req.json();
	const response = await openai.audio.speech.create({
		model: 'tts-1',
		voice: voiceType,
		input: message,
	});
	return new NextResponse(response.body);
}
