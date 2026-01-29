import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized: ({ token }) => !!token,
  },
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/bucket-items/:path*',
    '/api/gemini/:path*',
  ],
}

