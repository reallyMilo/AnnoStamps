import {
  ARCTIC_GOODS,
  ENBESA_GOODS,
  NEW_WORLD_GOODS,
  OLD_WORLD_GOODS,
} from './data'

export function getGoodRegion(good: string): string | null {
  if (isOldWorldGood(good)) {
    return 'Old World'
  } else if (isNewWorldGood(good)) {
    return 'New World'
  } else if (isArcticGood(good)) {
    return 'Arctic'
  } else if (isEnbesaGood(good)) {
    return 'Enbesa'
  } else {
    return 'Unknown'
  }
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
