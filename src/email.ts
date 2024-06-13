import { readFileSync } from 'fs'
import Handlebars from 'handlebars'
import type { User } from 'next-auth'
import nodemailer from 'nodemailer'
import path from 'path'

export const sendWelcomeEmail = async ({ user }: { user: User }) => {
  const emailsDir = path.resolve(process.cwd(), 'emails')
  const { email } = user
  const emailFile = readFileSync(path.join(emailsDir, 'welcome.html'), {
    encoding: 'utf8',
  })
  const emailTemplate = Handlebars.compile(emailFile)

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

  try {
    await transporter.sendMail({
      from: `"Anno Stamps" ${process.env.EMAIL_FROM}`,
      to: email as string,
      subject: 'Welcome to Anno Stamps! 🎉',
      html: emailTemplate({
        base_url: process.env.AUTH_URL,
        support_email: 'annostampsite@gmail.com',
      }),
    })
  } catch (error) {
    return
  }
}
