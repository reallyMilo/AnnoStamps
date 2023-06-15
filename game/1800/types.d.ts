import { CreateStamp } from 'types'

import { Region1800 } from './enum'
export interface CreateStamp1800 extends CreateStamp {
  game: '1800'
  region: Region1800
}
