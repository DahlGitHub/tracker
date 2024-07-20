import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const pageSize = searchParams.get('pageSize') || '10';
  const apiUrl = `https://api.hevyapp.com/v1/workouts?page=${page}&pageSize=${pageSize}&since=1970-01-01T00%3A00%3A00Z`;
  const apiKey = '4e41ccaa-0685-4307-bd32-ac791722cbee';

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'accept': 'application/json',
        'api-key': apiKey
      }
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching data from Hevy API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: (error as any).response?.status || 500 });
  }
}
