import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Loader2 } from 'lucide-react'

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [isChecking, setIsChecking] = useState(true)
  const checkAuthStatus = useAuthStore((state) => state.auth.checkAuthStatus)

  useEffect(() => {
    const performAuthCheck = async () => {
      try {
        await checkAuthStatus()
      } catch (error) {
        // Auth check failed, but we'll let the app continue
        // The router protection will handle redirects
      } finally {
        setIsChecking(false)
      }
    }

    performAuthCheck()
  }, [checkAuthStatus])

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}