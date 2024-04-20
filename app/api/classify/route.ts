import { classifyImage } from '@/app/lib/classifier';
import { NextResponse, NextRequest } from 'next/server';
import { StreamingTextResponse } from 'ai';
//import { OpenAI } from 'openai';
//import fs from 'fs';
// Set the runtime to edge for best performance

export const runtime = 'edge';

// add a listener to POST requests

//const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
	// read our file from request data
	const data = await request.formData();

	const file: File | null = data.get('file') as unknown as File;

	if (!file) {
		return NextResponse.json(
			{ message: 'File not present in body' },

			{ status: 400, statusText: 'Bad Request' }
		);
	}

	//call our classify function and stream to the client
	const response = await classifyImage(file);

	return new StreamingTextResponse(response);
}
