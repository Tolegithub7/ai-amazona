"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const banners = [
  {
    image: "/images/banner1.jpg",
    headline: "Shop the Latest Trends",
    sub: "Discover new arrivals and bestsellers.",
    cta: "Shop Now",
    href: "/products",
  },
  {
    image: "/images/banner2.jpg",
    headline: "Exclusive Deals",
    sub: "Save big on top categories.",
    cta: "View Deals",
    href: "/products?filter=deals",
  },
  {
    image: "/images/banner3.jpg",
    headline: "Fast & Free Delivery",
    sub: "On all orders over $50.",
    cta: "Learn More",
    href: "/about",
  },
];

export default function BannerCarousel() {
  return (
    <Carousel className="w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
      <CarouselContent>
        {banners.map((banner, i) => (
          <CarouselItem key={i} className="relative w-full h-64 md:h-80">
            <Image
              src={banner.image}
              alt={banner.headline}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-start p-8">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">{banner.headline}</h2>
              <p className="text-white text-lg mb-4 drop-shadow">{banner.sub}</p>
              <Button asChild size="lg" className="bg-primary text-white font-semibold">
                <Link href={banner.href}>{banner.cta}</Link>
              </Button>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
} 