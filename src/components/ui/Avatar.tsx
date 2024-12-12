import defaultAvatar from '@/../public/anno-stamps-stamp.png'
import * as Headless from '@headlessui/react'
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
  src?: null | string
}

export const Avatar = ({
  alt = '',
  className,
  initials,
  square = false,
  src = null,
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
        className,
      )}
    >
      {initials && (
        <svg
          aria-hidden={alt ? undefined : 'true'}
          className="select-none fill-current text-[48px] font-medium uppercase"
          viewBox="0 0 100 100"
        >
          {alt && <title>{alt}</title>}
          <text
            alignmentBaseline="middle"
            dominantBaseline="middle"
            dy=".125em"
            textAnchor="middle"
            x="50%"
            y="50%"
          >
            {initials}
          </text>
        </svg>
      )}
      {src ? (
        <img alt={alt} height={36} src={src} width={36} />
      ) : (
        <Image
          alt="default avatar icon"
          height={36}
          src={defaultAvatar}
          width={36}
        />
      )}
    </span>
  )
}

export const AvatarButton = React.forwardRef(
  (
    {
      alt,
      className,
      initials,
      square = false,
      src,
      ...props
    }: (
      | Omit<Headless.ButtonProps, 'className'>
      | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>
    ) &
      AvatarProps,
    ref: React.ForwardedRef<HTMLElement>,
  ) => {
    const classes = cn(
      square ? 'rounded-[20%]' : 'rounded-full',
      'relative focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500',
      className,
    )

    return 'href' in props ? (
      <Link
        {...props}
        className={classes}
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
      >
        <TouchTarget>
          <Avatar alt={alt} initials={initials} square={square} src={src} />
        </TouchTarget>
      </Link>
    ) : (
      <Headless.Button {...props} className={classes} ref={ref}>
        <TouchTarget>
          <Avatar alt={alt} initials={initials} square={square} src={src} />
        </TouchTarget>
      </Headless.Button>
    )
  },
)

AvatarButton.displayName = 'AvatarButton'
