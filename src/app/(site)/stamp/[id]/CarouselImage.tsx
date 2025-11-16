'use client'

import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'

import type { StampWithRelations } from '@/lib/prisma/models'

export const CarouselImage = ({
  images,
  title,
}: Pick<StampWithRelations, 'images' | 'title'>) => {
  return (
    <Swiper className="z-auto" modules={[Navigation]} navigation>
      {images.map((image, idx) => (
        <SwiperSlide className="z-auto" key={image.id}>
          <img
            alt={`${title} - User uploaded image ${idx + 1}`}
            className="z-auto max-h-[768px] w-full object-contain object-center"
            height={768}
            src={image.largeUrl ?? image.originalUrl}
            width={1024}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
