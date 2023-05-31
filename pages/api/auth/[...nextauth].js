import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { readFileSync } from 'fs'
import Handlebars from 'handlebars'
import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import EmailProvider from 'next-auth/providers/email'
import GoogleProvider from 'next-auth/providers/google'
import nodemailer from 'nodemailer'
import path from 'path'

import { prisma } from '@/lib/prisma'

// Email sender
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: false,
})

const emailsDir = path.resolve(process.cwd(), 'emails')

const sendVerificationRequest = async ({ identifier, url }) => {
  const emailFile = readFileSync(path.join(emailsDir, 'confirm-email.html'), {
    encoding: 'utf8',
  })
  const emailTemplate = Handlebars.compile(emailFile)
  await transporter.sendMail({
    from: `"Anno Stamps" ${process.env.EMAIL_FROM}`,
    to: identifier,
    subject: 'Your sign-in link for Anno Stamps',
    html: emailTemplate({
      base_url: process.env.NEXTAUTH_URL,
      signin_url: url,
      email: identifier,
    }),
  })
}

const sendWelcomeEmail = async ({ user }) => {
  const { email } = user

  try {
    const emailFile = readFileSync(path.join(emailsDir, 'welcome.html'), {
      encoding: 'utf8',
    })
    const emailTemplate = Handlebars.compile(emailFile)
    await transporter.sendMail({
      from: `"Anno Stamps" ${process.env.EMAIL_FROM}`,
      to: email,
      subject: 'Welcome to Anno Stamps! 🎉',
      html: emailTemplate({
        base_url: process.env.NEXTAUTH_URL,
        support_email: 'annostampsite@gmail.com',
      }),
    })
  } catch (error) {
    console.log(`❌ Unable to send welcome email to user (${email})`)
  }
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
    verifyRequest: '/',
  },
  providers: [
    EmailProvider({
      maxAge: 10 * 60,
      sendVerificationRequest,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  events: { createUser: sendWelcomeEmail },
}

export default NextAuth(authOptions)
