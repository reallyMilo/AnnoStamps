import Image from 'next/image'

const socials = [
  {
    name: 'discord',
    url: 'https://discord.gg/73hfP54qXe',
    src: '/discord-white-icon.svg',
  },
  {
    name: 'github',
    url: 'https://github.com/reallyMilo/AnnoStamps',
    src: '/github-mark.svg',
  },
]
const Footer = () => {
  return (
    <footer className="mt-auto  bg-[#222939] py-6">
      <div className="container mx-auto flex items-center justify-between px-5">
        <p className="text-sm font-bold text-white">Anno Stamps</p>

        <div className="flex items-center space-x-5 px-5">
          <a
            href="https://www.buymeacoffee.com/miloK"
            target="_blank"
            className="text-white"
          >
            Support AnnoStamps
          </a>
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              data-testid={social.name}
            >
              <Image
                src={social.src}
                alt={social.name}
                width={32}
                height={32}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />{' '}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
