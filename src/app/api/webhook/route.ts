import { createHmac } from 'node:crypto'

import type { NextRequest } from 'next/server'

import prisma from '@/lib/prisma/singleton'

export const POST = async (request: NextRequest) => {
  const requestHeaders = new Headers(request.headers)

  if (!requestHeaders.has('signature')) {
    return Response.json({ message: 'No signature' }, { status: 400 })
  }

  const sig = requestHeaders.get('signature')
  const text = await request.text()
  const digest = createHmac('sha256', process.env.WEBHOOK_SECRET as string)
    .update(text)
    .digest('hex')

  if (digest !== sig) {
    return Response.json(
      {
        message: `No signature match`,
      },
      { status: 401 }
    )
  }

  const { id, ...url } = JSON.parse(text)

  try {
    await prisma.image.update({
      where: { id },
      data: url,
    })
    return Response.json({ message: 'updated image' }, { status: 200 })
  } catch (e) {
    return Response.json({ message: e }, { status: 500 })
  }
}
