import * as Sentry from '@sentry/nextjs'
import type { NextPageContext } from 'next'
import NextErrorComponent from 'next/error'

const CustomErrorComponent = ({ statusCode }: { statusCode: number }) => (
  <NextErrorComponent statusCode={statusCode} />
)

CustomErrorComponent.getInitialProps = async (ctx: NextPageContext) => {
  await Sentry.captureUnderscoreErrorException(ctx)
  return NextErrorComponent.getInitialProps(ctx)
}

export default CustomErrorComponent
