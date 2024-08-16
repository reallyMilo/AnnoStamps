import {
  CogIcon,
  GlobeEuropeAfricaIcon,
  HomeIcon,
  SparklesIcon,
  TagIcon,
} from '@heroicons/react/24/solid'

import { CATEGORIES } from '@/lib/constants'

type CategoryInfo = {
  color: string
  icon: React.ReactNode
}

type CategoryValues = (typeof CATEGORIES)[keyof typeof CATEGORIES]

const categoryMap: Record<CategoryValues, CategoryInfo> = {
  cosmetic: {
    color: 'bg-accent text-default',
    icon: <SparklesIcon className="h-5 w-5" />,
  },
  general: {
    color: 'bg-[#C34E27] text-default',
    icon: <TagIcon className="h-5 w-5" />,
  },
  housing: {
    color: 'bg-secondary text-midnight',
    icon: <HomeIcon className="h-5 w-5" />,
  },
  island: {
    color: 'bg-midnight text-default dark:text-midnight dark:bg-default',
    icon: <GlobeEuropeAfricaIcon className="h-5 w-5" />,
  },
  production: {
    color: 'bg-primary text-midnight',
    icon: <CogIcon className="h-5 w-5" />,
  },
}

export const StampCategoryIcon = ({
  category = 'general',
}: {
  category: string
}) => {
  const { color, icon } = categoryMap[category as CategoryValues]
  return (
    <span
      className={`${color} flex w-fit items-center gap-1 rounded-full py-1 pl-2 pr-3 text-xs capitalize`}
    >
      {icon}
      {category}
    </span>
  )
}
