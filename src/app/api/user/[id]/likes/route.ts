import { auth } from '@/auth'
import prisma from '@/lib/prisma/singleton'

export const GET = async (request: Request) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return Response.json({ error: 'Unauthorized', ok: false }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      select: { likedStamps: { select: { id: true } } },
      where: { id: session.userId },
    })

    if (!user) {
      return Response.json(
        { error: 'User not found', ok: false },
        { status: 404 },
      )
    }

    return Response.json(
      { data: user.likedStamps.map((i) => i.id), ok: true },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error fetching liked stamps:', error)
    return Response.json(
      { error: 'Internal Server Error', ok: false },
      { status: 500 },
    )
  }
}
