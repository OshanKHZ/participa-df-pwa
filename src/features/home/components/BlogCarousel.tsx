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

const SWIPE_THRESHOLD = 50 // px - minimum distance to trigger swipe

interface BlogCarouselProps {
  posts: BlogPost[]
  className?: string
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

export function BlogCarousel({ posts, className }: BlogCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const touchStartRef = useRef<number | null>(null)

  // Infinite loop: [last, ...posts, first]
  const infinitePosts =
    posts.length > 0 ? [posts[posts.length - 1], ...posts, posts[0]] : []

  const totalItems = posts.length

  const updatePosition = useCallback((index: number, animate = true) => {
    const el = trackRef.current
    if (!el) return

    setIsAnimating(animate)

    const cardWidthWithGap = CARD_WIDTH + GAP
    // Calculate scroll to center the card. 
    // Original logic was attempting to center or offset based on fixed width.
    // Let's restore the exact original calculation: index * cardWidthWithGap - CARD_WIDTH / 2
    // Wait, original logic in Step 19 was: index * cardWidthWithGap - CARD_WIDTH / 2
    // Let's stick to that.
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

  // Touch handlers for swipe navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (touch) {
      touchStartRef.current = touch.clientX
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Prevent scrolling while swiping horizontally
    if (touchStartRef.current !== null) {
      const touch = e.touches[0]
      if (!touch) return
      const touchX = touch.clientX
      const diff = touchStartRef.current - touchX
      if (Math.abs(diff) > 10) {
        e.preventDefault()
      }
    }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartRef.current === null || isAnimating) return

    const touch = e.changedTouches[0]
    if (!touch) return
    const touchEndX = touch.clientX
    const diff = touchStartRef.current - touchEndX

    // Reset touch start
    touchStartRef.current = null

    // Check if swipe threshold met
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        // Swiped left - next
        nextPage()
      } else {
        // Swiped right - previous
        prevPage()
      }
    }
  }, [isAnimating, nextPage, prevPage])

  if (posts.length === 0) return null

  return (
    <section className={`bg-card px-3 py-3 ${className || ''}`} aria-label="Blog posts">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-base font-semibold text-foreground">Novidades</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            className="w-8 h-8 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-sm border border-border transition-colors btn-focus"
            aria-label="Anterior"
          >
            <RiArrowLeftSLine className="size-5 text-foreground" />
          </button>

          <button
            onClick={nextPage}
            className="w-8 h-8 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-sm border border-border transition-colors btn-focus"
            aria-label="Próximo"
          >
            <RiArrowRightSLine className="size-5 text-foreground" />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="relative overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-2"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
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
                  className="block group btn-focus rounded"
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
                  <h3 className="text-xs font-medium text-foreground line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Page Counter - Oval Dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {Array.from({ length: totalItems }).map((_, index) => (
          <span
            key={index}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              index === activeDotIndex ? 'w-6 bg-secondary' : 'w-1.5 bg-foreground/20'
            }`}
            aria-current={index === activeDotIndex ? 'true' : undefined}
          />
        ))}
      </div>
    </section>
  )
}
