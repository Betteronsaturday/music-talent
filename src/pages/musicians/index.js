'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function MusiciansDiscoverRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/musicians/map')
  }, [router])
  return null
}
