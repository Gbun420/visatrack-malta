import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory store for rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map()

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Rate limiting check
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown'
  const key = `rate-limit:${ip}`
  const now = Date.now()
  const windowMs = 60000 // 1 minute
  const maxRequests = 100

  const record = rateLimitMap.get(key)
  if (!record) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })
  } else {
    if (now > record.resetTime) {
      // Reset window
      record.count = 1
      record.resetTime = now + windowMs
    } else {
      record.count++
      if (record.count > maxRequests) {
        return new Response('Rate limit exceeded', { status: 429 })
      }
    }
  }

  // Security headers
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // If user is not signed in and trying to access dashboard, redirect to login
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // If user is signed in and trying to access login or register, redirect to dashboard
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}
