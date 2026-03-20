import { Container, Heading, Link, Text } from '@/components/ui'

const errorConfigs = {
  '400': {
    description:
      'The download request was malformed. Please retry from the stamp page.',
    title: 'Bad Request',
  },
  '403': {
    description:
      'This stamp file is not currently accessible. The link may be expired or invalid.',
    title: 'Access Denied',
  },
  '404': {
    description:
      'We could not find that stamp file on CDN. It may have been moved or removed.',
    title: 'Not Found',
  },
  '500': {
    description:
      'The CDN hit an internal issue while serving the file. This should be temporary.',
    title: 'Internal Server Error',
  },
  '502': {
    description:
      'An upstream service returned an invalid response. Please retry the request in a moment.',
    title: 'Bad Gateway',
  },
  '503': {
    description:
      'The service is temporarily unavailable due to maintenance or overload.',
    title: 'Service Unavailable',
  },
  '504': {
    description:
      'The request timed out while reaching the upstream service. Retry in a few seconds.',
    title: 'Gateway Timeout',
  },
} as const

type ErrorCode = keyof typeof errorConfigs

export const generateStaticParams = async () => {
  return Object.keys(errorConfigs).map((code) => ({ code }))
}

const fallbackConfig = {
  action: 'Back to home',
  description: 'Something went wrong while loading this resource.',
  title: 'Download Error',
}

const supportData = {
  contactEmail: 'support@annostamps.com',
  discordInvite: 'https://discord.gg/73hfP54qXe',
}

const StampErrorPage = async (props: { params: Promise<{ code: string }> }) => {
  const { code } = await props.params

  const config = errorConfigs[code as ErrorCode] ?? fallbackConfig

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-10">
      <div className="rounded-md bg-zinc-900 p-8 text-center">
        <Heading className="text-4xl">{`${config.title} (${code})`}</Heading>
        <Text className="text-lg">{config.description}</Text>
        <div className="mt-6 border-t border-zinc-700/80 pt-6">
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <Link
              className="text-cyan-300 underline"
              href={supportData.discordInvite}
              htmlLink
              rel="noreferrer"
              target="_blank"
            >
              Join Discord support
            </Link>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default StampErrorPage
