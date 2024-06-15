import { auth } from '@/auth'
import { userIncludeStatement } from '@/lib/prisma/queries'
import prisma from '@/lib/prisma/singleton'

export const GET = auth(async (req) => {
  if (!req.auth) {
    return Response.json(
      { message: 'Unauthorized.', data: null },
      { status: 401 }
    )
  }

  const userId = req.auth.user.id
  try {
    const user = await prisma.user.findUnique({
      include: userIncludeStatement,
      where: {
        id: userId,
      },
    })

    if (!user) {
      return Response.json(
        { message: 'No user found.', data: null },
        { status: 404 }
      )
    }
    return Response.json({ message: 'User with stamps.', data: user })
  } catch (e) {
    return Response.json({ message: 'Server error.' }, { status: 500 })
  }
})
