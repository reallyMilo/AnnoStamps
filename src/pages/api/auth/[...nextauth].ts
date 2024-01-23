import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import Handlebars from 'handlebars'
import NextAuth, { NextAuthOptions, User } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import GoogleProvider from 'next-auth/providers/google'
import nodemailer from 'nodemailer'
import path from 'path'

import prisma from '@/lib/prisma/singleton'

const transporter = nodemailer.createTransport({
  //@ts-expect-error overload match
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: false,
})

const emailsDir = path.resolve(process.cwd(), 'emails')

const sendWelcomeEmail = async ({ user }: { user: User }) => {
  const { email } = user

  try {
    const emailFile = readFileSync(path.join(emailsDir, 'welcome.html'), {
      encoding: 'utf8',
    })
    const emailTemplate = Handlebars.compile(emailFile)
    await transporter.sendMail({
      from: `"Anno Stamps" ${process.env.EMAIL_FROM}`,
      to: email as string,
      subject: 'Welcome to Anno Stamps! 🎉',
      html: emailTemplate({
        base_url: process.env.NEXTAUTH_URL,
        support_email: 'annostampsite@gmail.com',
      }),
    })
  } catch (error) {
    return
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    signOut: '/',
    error: '/auth/error',
    verifyRequest: '/',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? '',
      clientSecret: process.env.GOOGLE_SECRET ?? '',
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
    }),
  ],
  adapter: PrismaAdapter(prisma as unknown as PrismaClient),
  events: { createUser: sendWelcomeEmail },
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id
        session.user.username = user.username
        session.user.biography = user.biography
      }
      return session
    },
  },
}

export default NextAuth(authOptions)
