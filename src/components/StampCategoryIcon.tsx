import {
  CogIcon,
  GlobeEuropeAfricaIcon,
  HomeIcon,
  SparklesIcon,
  TagIcon,
} from '@heroicons/react/24/solid'

import { CATEGORIES } from '@/lib/game/1800/data'

type CategoryInfo = {
  color: string
  icon: React.ReactNode
}

type CategoryValues = (typeof CATEGORIES)[keyof typeof CATEGORIES]

const categoryMap: Record<CategoryValues, CategoryInfo> = {
  housing: { icon: <HomeIcon className="h-5 w-5" />, color: 'bg-[#8B6834]' },
  production: { icon: <CogIcon className="h-5 w-5" />, color: 'bg-[#18806D]' },
  cosmetic: {
    icon: <SparklesIcon className="h-5 w-5" />,
    color: 'bg-[#C34E27]',
  },
  island: {
    icon: <GlobeEuropeAfricaIcon className="h-5 w-5" />,
    color: 'bg-[#2B4162]',
  },
  general: { icon: <TagIcon className="h-5 w-5" />, color: 'bg-[#D72455]' },
}

const Category = ({ category = 'general' }: { category: string }) => {
  const { icon, color } = categoryMap[category as CategoryValues]
  return (
    <span
      className={`${color} flex w-fit items-center gap-1 rounded-full py-1 pl-2 pr-3 text-xs capitalize text-white`}
    >
      {icon}
      {category}
    </span>
  )
}

export default Category
