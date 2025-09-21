'use client'

import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import type { StampWithRelations } from '@/lib/prisma/models'

export const CarouselImage = ({
  images,
  title,
}: Pick<StampWithRelations, 'images' | 'title'>) => {
  return (
    <Swiper className="z-0" modules={[Navigation]} navigation>
      {images.map((image, idx) => (
        <SwiperSlide className="z-0" key={image.id}>
          <img
            alt={`${title} - User uploaded image ${idx + 1}`}
            className="z-0 max-h-[768px] w-full object-contain object-center"
            height={768}
            src={image.largeUrl ?? image.originalUrl}
            width={1024}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
