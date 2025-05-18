import { NextResponse } from 'next/server';
import { PythonShell } from 'python-shell';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { genre, runtime, age, topN = 5, minRating = 8.0 } = await request.json();

    if (!genre || !runtime || !age) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const options = {
      mode: 'text',
      pythonPath: 'python',
      scriptPath: path.join(process.cwd(), 'api'),
      args: [genre, runtime, age.toString(), topN.toString(), minRating.toString()],
    };

    const result = await new Promise((resolve, reject) => {
      PythonShell.run('recommend.py', options, (err, results) => {
        if (err) reject(err);
        resolve(results ? results[0] : '');
      });
    });

    const recommendations = JSON.parse(result as string);
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error in recommendations API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
} 