"use client"

import { useEffect, useState } from "react"
import { getSessionClient } from "@/app/actions/auth/get-session-client"
import { Button } from "./ui/button"

export function AuthChecker() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const sessionData = await getSessionClient()
      setSession(sessionData)
      setLoading(false)
    }
    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Sesi tidak valid</p>
          <Button onClick={() => window.location.href = '/login'}>
            Login Ulang
          </Button>
        </div>
      </div>
    )
  }

  return null
}
