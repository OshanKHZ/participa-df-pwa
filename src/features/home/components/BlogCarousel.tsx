'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'

export interface BlogPost {
  id: string
  title: string
  image: string
  publishedAt: Date
  slug: string
}

interface BlogCarouselProps {
  posts: BlogPost[]
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'agora'
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h`
  }
  const days = Math.floor(diffInSeconds / 86400)
  return `${days}d`
}

const CARD_WIDTH = 180 // px
const GAP = 8 // px

export function BlogCarousel({ posts }: BlogCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)

  // Create infinite loop: [last, ...posts, first]
  const infinitePosts = posts.length > 0
    ? [posts[posts.length - 1], ...posts, posts[0]]
    : []

  const totalItems = posts.length

  const updatePosition = useCallback((index: number, animate = true) => {
    const el = trackRef.current
    if (!el) return

    setIsAnimating(animate)

    const cardWidthWithGap = CARD_WIDTH + GAP
    // Calculate scroll to center the card
    const scrollPos = index * cardWidthWithGap - CARD_WIDTH / 2

    el.style.transition = animate ? 'transform 0.4s ease-out' : 'none'
    el.style.transform = `translateX(${-scrollPos}px)`

    setCurrentIndex(index)
  }, [])

  // Initial position
  useEffect(() => {
    if (posts.length > 0 && containerRef.current) {
      updatePosition(1, false)
    }
  }, [posts.length, updatePosition])

  // Handle infinite loop reset after animation
  useEffect(() => {
    const handleTransitionEnd = () => {
      if (currentIndex === infinitePosts.length - 1) {
        // At end clone, jump to real first
        updatePosition(1, false)
      } else if (currentIndex === 0) {
        // At start clone, jump to real last
        updatePosition(totalItems, false)
      }
      setIsAnimating(false)
    }

    const el = trackRef.current
    el?.addEventListener('transitionend', handleTransitionEnd)
    return () => el?.removeEventListener('transitionend', handleTransitionEnd)
  }, [currentIndex, infinitePosts.length, totalItems, updatePosition])

  const nextPage = useCallback(() => {
    if (isAnimating) return
    const nextIndex = currentIndex + 1
    updatePosition(nextIndex, true)
  }, [currentIndex, isAnimating, updatePosition])

  const prevPage = useCallback(() => {
    if (isAnimating) return
    const prevIndex = currentIndex - 1
    updatePosition(prevIndex, true)
  }, [currentIndex, isAnimating, updatePosition])

  // Get real index for dots (0 to totalItems-1)
  const getRealIndex = useCallback(() => {
    if (currentIndex === 0) return totalItems - 1
    if (currentIndex === infinitePosts.length - 1) return 0
    return currentIndex - 1
  }, [currentIndex, infinitePosts.length, totalItems])

  const activeDotIndex = getRealIndex()

  if (posts.length === 0) return null

  return (
    <div className="lg:hidden bg-card px-3 py-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold text-foreground">Blog</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            className="w-6 h-6 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-sm border border-border transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
            aria-label="Anterior"
          >
            <RiArrowLeftSLine className="size-3 text-foreground" />
          </button>

          <button
            onClick={nextPage}
            className="w-6 h-6 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-sm border border-border transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
            aria-label="Próximo"
          >
            <RiArrowRightSLine className="size-3 text-foreground" />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="relative overflow-hidden">
        <div ref={trackRef} className="flex gap-2">
          {infinitePosts.map((post, index) => {
            if (!post) return null
            return (
              <div
                key={`${post.id}-${index}`}
                className="flex-shrink-0"
                style={{ width: CARD_WIDTH }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="block group focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 rounded"
                >
                  <div className="relative aspect-[16/9] rounded-md overflow-hidden bg-muted mb-1.5">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="180px"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-0.5">
                    {formatTimeAgo(post.publishedAt)}
                  </p>
                  <h4 className="text-xs font-medium text-foreground line-clamp-2 leading-tight">
                    {post.title}
                  </h4>
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Page Counter - Oval Dots */}
      <div className="flex justify-center gap-1.5 mt-2">
        {Array.from({ length: totalItems }).map((_, index) => (
          <button
            key={index}
            onClick={() => !isAnimating && updatePosition(index + 1, true)}
            className={`h-1.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 ${
              index === activeDotIndex ? 'w-6 bg-secondary' : 'w-1.5 bg-muted'
            }`}
            aria-label={`Ir para página ${index + 1}`}
            aria-current={index === activeDotIndex ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  )
}
