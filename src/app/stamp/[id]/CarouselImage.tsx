'use client'

import 'swiper/css'
import 'swiper/css/navigation'

import Image from 'next/image'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import type { StampWithRelations } from '@/lib/prisma/queries'

type CarouselProps = {
  images: StampWithRelations['images']
}
export const CarouselImage = ({ images }: CarouselProps) => {
  return (
    <Swiper navigation={true} modules={[Navigation]} className="">
      {images.map((image) => (
        <SwiperSlide key={image.id}>
          <Image
            src={image.largeUrl ?? image.originalUrl}
            alt="anno stamp image"
            className="max-h-[768px] w-full object-contain object-center"
            height={768}
            width={1024}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
