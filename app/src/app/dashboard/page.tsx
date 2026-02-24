'use client'
import { useUserStore } from '@/lib/stores/useUserStore'
import { redirect } from 'next/navigation'

export default function Home() {
  const { user } = useUserStore()

  redirect(user?.role === "user" ? "/" : '/dashboard/users')
}