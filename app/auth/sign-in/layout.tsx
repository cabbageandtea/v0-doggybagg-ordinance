import { Suspense } from 'react'

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Suspense fallback={<SignInFallback />}>{children}</Suspense>
}

function SignInFallback() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md liquid-glass rounded-2xl p-8 animate-pulse">
        <div className="h-8 w-32 bg-muted rounded mb-6" />
        <div className="h-8 w-48 bg-muted rounded mb-2" />
        <div className="h-4 w-full bg-muted rounded mb-6" />
        <div className="space-y-4">
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded mt-6" />
        </div>
      </div>
    </main>
  )
}
