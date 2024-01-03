import type { NextPageContext } from 'next'
import NextErrorComponent from 'next/error'

const CustomErrorComponent = ({ statusCode }: { statusCode: number }) => (
  <NextErrorComponent statusCode={statusCode} />
)

CustomErrorComponent.getInitialProps = async (ctx: NextPageContext) => {
  return NextErrorComponent.getInitialProps(ctx)
}

export default CustomErrorComponent
