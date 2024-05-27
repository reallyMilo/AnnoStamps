import * as Headless from '@headlessui/react'
import { UserIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import React from 'react'

import { cn } from '@/lib/utils'

import { TouchTarget } from './Button'
import { Link } from './Link'

type AvatarProps = {
  alt?: string
  className?: string
  initials?: string
  square?: boolean
  src?: string | null
}

export const Avatar = ({
  src = null,
  square = false,
  initials,
  alt = '',
  className,
  ...props
}: AvatarProps & React.ComponentPropsWithoutRef<'span'>) => {
  return (
    <span
      data-slot="avatar"
      {...props}
      className={cn(
        // Basic layout
        'inline-grid shrink-0 align-middle [--avatar-radius:20%] [--ring-opacity:20%] *:col-start-1 *:row-start-1',

        // Add the correct border radius
        square
          ? 'rounded-[--avatar-radius] *:rounded-[--avatar-radius]'
          : 'rounded-full *:rounded-full',
        className
      )}
    >
      {initials && (
        <svg
          className="select-none fill-current text-[48px] font-medium uppercase"
          viewBox="0 0 100 100"
          aria-hidden={alt ? undefined : 'true'}
        >
          {alt && <title>{alt}</title>}
          <text
            x="50%"
            y="50%"
            alignmentBaseline="middle"
            dominantBaseline="middle"
            textAnchor="middle"
            dy=".125em"
          >
            {initials}
          </text>
        </svg>
      )}
      {src ? (
        <Image src={src} alt={alt} height={36} width={36} />
      ) : (
        <UserIcon />
      )}
    </span>
  )
}

export const AvatarButton = React.forwardRef(
  (
    {
      src,
      square = false,
      initials,
      alt,
      className,
      ...props
    }: AvatarProps &
      (
        | Omit<Headless.ButtonProps, 'className'>
        | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>
      ),
    ref: React.ForwardedRef<HTMLElement>
  ) => {
    const classes = cn(
      square ? 'rounded-[20%]' : 'rounded-full',
      'relative focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500',
      className
    )

    return 'href' in props ? (
      <Link
        {...props}
        className={classes}
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
      >
        <TouchTarget>
          <Avatar src={src} square={square} initials={initials} alt={alt} />
        </TouchTarget>
      </Link>
    ) : (
      <Headless.Button {...props} className={classes} ref={ref}>
        <TouchTarget>
          <Avatar src={src} square={square} initials={initials} alt={alt} />
        </TouchTarget>
      </Headless.Button>
    )
  }
)

AvatarButton.displayName = 'AvatarButton'
