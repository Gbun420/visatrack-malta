import { NextResponse } from 'next/server';
import { seedDemoData } from '@/lib/seed-data';

export async function POST(request: Request) {
  // Security Check: Allow only localhost or development environment
  const host = request.headers.get('host');
  const isLocalhost = host?.includes('localhost') || host?.includes('127.0.0.1');
  const isDev = process.env.NODE_ENV === 'development';

  if (!isLocalhost && !isDev) {
    return NextResponse.json(
      { error: 'Forbidden: Seeding is only allowed in local/dev environments.' },
      { status: 403 }
    );
  }

  try {
    const result = await seedDemoData();
    
    if (result.success) {
      return NextResponse.json({ message: 'Database seeded successfully', result });
    } else {
      return NextResponse.json(
        { error: 'Seeding failed', details: result.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
