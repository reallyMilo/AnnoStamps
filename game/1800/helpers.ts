import {
  ARCTIC_GOODS,
  ENBESA_GOODS,
  GOOD_CATEGORIES_1800,
  NEW_WORLD_GOODS,
  OLD_WORLD_GOODS,
} from './data'

export function getGoodRegion(good: string): string {
  if (isOldWorldGood(good)) {
    return 'old world'
  } else if (isNewWorldGood(good)) {
    return 'new world'
  } else if (isArcticGood(good)) {
    return 'arctic'
  } else if (isEnbesaGood(good)) {
    return 'enbesa'
  } else {
    return 'none'
  }
}

export function getGoods() {
  return Object.values(GOOD_CATEGORIES_1800)
    .map((category) => category.items)
    .flat()
}

function isOldWorldGood(good: string) {
  return OLD_WORLD_GOODS.includes(good)
}

function isNewWorldGood(good: string) {
  return NEW_WORLD_GOODS.includes(good)
}

function isArcticGood(good: string) {
  return ARCTIC_GOODS.includes(good)
}

function isEnbesaGood(good: string) {
  return ENBESA_GOODS.includes(good)
}
