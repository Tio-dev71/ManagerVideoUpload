import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (err) {
    console.error("Middleware Supabase getUser error:", err)
    // Continue without user if fetch fails
  }
  
  const pathname = request.nextUrl.pathname

  // App routes that require authentication
  const protectedPrefixes = ['/dashboard', '/super-admin', '/thanh-toan']
  const isProtectedRoute = protectedPrefixes.some(prefix => pathname.startsWith(prefix))
  
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Auth routes redirect away if already logged in
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
  if (authRoutes.includes(pathname) && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}
