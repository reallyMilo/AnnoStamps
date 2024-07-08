'use client'

import * as Headless from '@headlessui/react'
import type React from 'react'

import { cn } from '@/lib/utils'

import { Button } from './Button'
import { Link } from './Link'

export const Dropdown = (props: Headless.MenuProps) => {
  return <Headless.Menu {...props} />
}

export const DropdownButton = <T extends React.ElementType = typeof Button>({
  as = Button,
  ...props
}: { className?: string } & Omit<Headless.MenuButtonProps<T>, 'className'>) => {
  return <Headless.MenuButton as={as} {...props} />
}

export const DropdownMenu = ({
  anchor = 'bottom',
  className,
  ...props
}: { className?: string } & Omit<Headless.MenuItemsProps, 'className'>) => {
  return (
    <Headless.Transition leave="duration-100 ease-in" leaveTo="opacity-0">
      <Headless.MenuItems
        {...props}
        anchor={anchor}
        className={cn(
          // Anchor positioning
          '[--anchor-gap:theme(spacing.2)] [--anchor-padding:theme(spacing.1)] data-[anchor~=start]:[--anchor-offset:-6px] data-[anchor~=end]:[--anchor-offset:6px] sm:data-[anchor~=start]:[--anchor-offset:-4px] sm:data-[anchor~=end]:[--anchor-offset:4px]',
          // Base styles
          'isolate w-max rounded-xl p-1',
          // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
          'outline outline-1 outline-transparent focus:outline-none',
          // Handle scrolling when menu won't fit in viewport
          'overflow-y-auto',
          // Popover background
          'bg-white/75 backdrop-blur-xl dark:bg-zinc-800/75',
          // Shadows
          'shadow-lg ring-1 ring-midnight/10 dark:ring-inset dark:ring-white/10',
          // Define grid at the menu level if subgrid is supported
          'supports-[grid-template-columns:subgrid]:grid supports-[grid-template-columns:subgrid]:grid-cols-[auto_1fr_1.5rem_0.5rem_auto]',
          className,
        )}
      />
    </Headless.Transition>
  )
}

export const DropdownItem = ({
  className,
  ...props
}: { className?: string } & (
  | Omit<Headless.MenuItemProps<typeof Link>, 'className'>
  | Omit<Headless.MenuItemProps<'button'>, 'className'>
)) => {
  const classes = cn(
    // Base styles
    'group cursor-default rounded-lg px-3.5 py-2.5 focus:outline-none sm:px-3 sm:py-1.5',
    // Text styles
    'text-left text-base/6 text-midnight sm:text-sm/6 dark:text-white forced-colors:text-[CanvasText]',
    // Focus
    'data-[focus]:bg-midnight/15 data-[focus]:dark:bg-default/25 data-[focus]:text-midnight data-[focus]:dark:text-white',
    // Disabled state
    'data-[disabled]:opacity-50',
    // Forced colors mode
    'forced-color-adjust-none forced-colors:data-[focus]:bg-[Highlight] forced-colors:data-[focus]:text-[HighlightText] forced-colors:[&>[data-slot=icon]]:data-[focus]:text-[HighlightText]',
    // Use subgrid when available but fallback to an explicit grid layout if not
    'col-span-full grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] items-center supports-[grid-template-columns:subgrid]:grid-cols-subgrid',
    // Icons
    '[&>[data-slot=icon]]:col-start-1 [&>[data-slot=icon]]:row-start-1 [&>[data-slot=icon]]:-ml-0.5 [&>[data-slot=icon]]:mr-2.5 [&>[data-slot=icon]]:size-5 sm:[&>[data-slot=icon]]:mr-2 [&>[data-slot=icon]]:sm:size-4',
    '[&>[data-slot=icon]]:text-zinc-500 [&>[data-slot=icon]]:data-[focus]:text-white [&>[data-slot=icon]]:dark:text-zinc-400 [&>[data-slot=icon]]:data-[focus]:dark:text-white',
    // Avatar
    '[&>[data-slot=avatar]]:-ml-1 [&>[data-slot=avatar]]:mr-2.5 [&>[data-slot=avatar]]:size-6 sm:[&>[data-slot=avatar]]:mr-2 sm:[&>[data-slot=avatar]]:size-5',
    className,
  )

  return 'href' in props ? (
    <Headless.MenuItem as={Link} {...props} className={classes} />
  ) : (
    <Headless.MenuItem
      as="button"
      type="button"
      {...props}
      className={classes}
    />
  )
}

export const DropdownHeader = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  return (
    <div
      {...props}
      className={cn('col-span-5 px-3.5 pb-1 pt-2.5 sm:px-3', className)}
    />
  )
}

export const DropdownSection = ({
  className,
  ...props
}: { className?: string } & Omit<Headless.MenuSectionProps, 'className'>) => {
  return (
    <Headless.MenuSection
      {...props}
      className={cn(
        // Define grid at the section level instead of the item level if subgrid is supported
        'col-span-full supports-[grid-template-columns:subgrid]:grid supports-[grid-template-columns:subgrid]:grid-cols-[auto_1fr_1.5rem_0.5rem_auto]',
        className,
      )}
    />
  )
}

export const DropdownHeading = ({
  className,
  ...props
}: { className?: string } & Omit<Headless.MenuHeadingProps, 'className'>) => {
  return (
    <Headless.MenuHeading
      {...props}
      className={cn(
        'col-span-full grid grid-cols-[1fr,auto] gap-x-12 px-3.5 pb-1 pt-2 text-sm/5 font-medium text-zinc-500 sm:px-3 sm:text-xs/5 dark:text-zinc-400',
        className,
      )}
    />
  )
}

export const DropdownDivider = ({
  className,
  ...props
}: { className?: string } & Omit<Headless.MenuSeparatorProps, 'className'>) => {
  return (
    <Headless.MenuSeparator
      {...props}
      className={cn(
        'col-span-full mx-3.5 my-1 h-px border-0 bg-midnight/5 sm:mx-3 dark:bg-white/10 forced-colors:bg-[CanvasText]',
        className,
      )}
    />
  )
}

export const DropdownLabel = ({
  className,
  ...props
}: { className?: string } & Omit<Headless.LabelProps, 'className'>) => {
  return (
    <Headless.Label
      {...props}
      data-slot="label"
      className={cn('col-start-2 row-start-1', className)}
      {...props}
    />
  )
}

export const DropdownDescription = ({
  className,
  ...props
}: { className?: string } & Omit<Headless.DescriptionProps, 'className'>) => {
  return (
    <Headless.Description
      data-slot="description"
      {...props}
      className={cn(
        'col-span-2 col-start-2 row-start-2 text-sm/5 text-zinc-500 group-data-[focus]:text-white sm:text-xs/5 dark:text-zinc-400 forced-colors:group-data-[focus]:text-[HighlightText]',
        className,
      )}
    />
  )
}

export const DropdownShortcut = ({
  keys,
  className,
  ...props
}: { className?: string; keys: string | string[] } & Omit<
  Headless.DescriptionProps<'kbd'>,
  'className'
>) => {
  return (
    <Headless.Description
      as="kbd"
      {...props}
      className={cn('col-start-5 row-start-1 flex justify-self-end', className)}
    >
      {(Array.isArray(keys) ? keys : keys.split('')).map((char, index) => (
        <kbd
          key={index}
          className={cn([
            'min-w-[2ch] text-center font-sans capitalize text-zinc-400 group-data-[focus]:text-white forced-colors:group-data-[focus]:text-[HighlightText]',
            // Make sure key names that are longer than one character (like "Tab") have extra space
            index > 0 && char.length > 1 && 'pl-1',
          ])}
        >
          {char}
        </kbd>
      ))}
    </Headless.Description>
  )
}
