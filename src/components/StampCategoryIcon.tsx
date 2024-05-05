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
  housing: {
    icon: <HomeIcon className="h-5 w-5" />,
    color: 'bg-secondary text-dark',
  },
  production: {
    icon: <CogIcon className="h-5 w-5" />,
    color: 'bg-primary text-dark',
  },
  cosmetic: {
    icon: <SparklesIcon className="h-5 w-5" />,
    color: 'bg-accent text-default',
  },
  island: {
    icon: <GlobeEuropeAfricaIcon className="h-5 w-5" />,
    color: 'bg-dark text-default',
  },
  general: {
    icon: <TagIcon className="h-5 w-5" />,
    color: 'bg-[#C34E27] text-default',
  },
}

const Category = ({ category = 'general' }: { category: string }) => {
  const { icon, color } = categoryMap[category as CategoryValues]
  return (
    <span
      className={`${color} flex w-fit items-center gap-1 rounded-full py-1 pl-2 pr-3 text-xs capitalize`}
    >
      {icon}
      {category}
    </span>
  )
}

export default Category
