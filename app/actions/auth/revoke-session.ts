'use server'

import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function revokeSessionAction(sessionId: string) {
  try {
    const session = await getSession()
    if (!session) return { success: false, error: 'Tidak ada sesi aktif' }

    const target = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { userId: true },
    })

    if (!target || target.userId !== session.user.id) {
      return { success: false, error: 'Tidak dapat mencabut sesi ini' }
    }

    if (sessionId === session.session.id) {
      return { success: false, error: 'Tidak dapat mencabut sesi aktif saat ini' }
    }

    await prisma.session.delete({ where: { id: sessionId } })

    revalidatePath('/dashboard/sessions')
    return { success: true, message: 'Sesi berhasil dicabut' }
  } catch (error) {
    console.error('Revoke session error:', error)
    return { success: false, error: 'Gagal mencabut sesi' }
  }
}

export async function revokeAllOtherSessionsAction() {
  try {
    const session = await getSession()
    if (!session) return { success: false, error: 'Tidak ada sesi aktif' }

    // Hapus semua sesi lain milik user ini kecuali sesi saat ini
    await prisma.session.deleteMany({
      where: {
        userId: session.user.id,
        id: { not: session.session.id },
      },
    })

    revalidatePath('/dashboard/sessions')
    return { success: true, message: 'Semua sesi lain berhasil dicabut' }
  } catch (error) {
    console.error('Revoke all sessions error:', error)
    return { success: false, error: 'Gagal mencabut sesi' }
  }
}
