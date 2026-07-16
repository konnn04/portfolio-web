"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setActiveIndex(carouselApi.selectedScrollSnap());
    carouselApi.on("select", onSelect);
    onSelect();
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  if (images.length === 0) return null;

  return (
    <div>
      <Carousel className="w-full" opts={{ loop: true }} setApi={setCarouselApi}>
        <CarouselContent>
          {images.map((img, idx) => (
            <CarouselItem key={idx}>
              <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border bg-muted">
                <Zoom>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${title} screenshot ${idx + 1}`}
                    className="h-full w-full rounded-2xl object-cover object-center"
                    loading="lazy"
                  />
                </Zoom>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>
      {images.length > 1 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {images.map((img, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => carouselApi?.scrollTo(idx)}
              className={`relative h-10 w-16 overflow-hidden rounded-md border-2 transition-all ${
                activeIndex === idx
                  ? "border-primary opacity-100 ring-2 ring-primary/30"
                  : "border-border opacity-60 hover:border-primary/50 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover object-center" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
