"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import BookCover from "@/components/book-cover"
import BookPage from "@/components/book-page"
import BackCover from "@/components/back-cover"

interface AlbumItem {
  type: "image" | "video"
  src: string
  caption: string
  duration?: string
}

interface AlbumPage {
  id: string
  title: string
  page_number: number
  items: AlbumItem[]
}

interface Album {
  id: string
  title: string
  subtitle: string
  cover_image_url: string
  pages: AlbumPage[]
}

interface RealisticAlbumBookProps {
  album: Album
  onClose?: () => void
}

type BookState = "closed" | "opening" | "open" | "closing"

export default function RealisticAlbumBook({ album, onClose }: RealisticAlbumBookProps) {
  const [bookState, setBookState] = useState<BookState>("closed")
  const [currentPage, setCurrentPage] = useState(-1)
  const [isPageTurning, setIsPageTurning] = useState(false)
  const [pageDirection, setPageDirection] = useState<"next" | "prev">("next")

  const totalPages = album.pages.length
  const isOnBackCover = currentPage === totalPages

  const openBook = () => {
    setBookState("opening")
    setTimeout(() => {
      setBookState("open")
      setCurrentPage(0)
    }, 800)
  }

  const closeBook = () => {
    setBookState("closing")
    setCurrentPage(-1)
    setTimeout(() => {
      setBookState("closed")
      onClose?.()
    }, 800)
  }

  const nextPage = () => {
    if (isPageTurning) return

    if (currentPage < totalPages) {
      setIsPageTurning(true)
      setPageDirection("next")
      setTimeout(() => {
        setCurrentPage(currentPage + 1)
        setIsPageTurning(false)
      }, 600)
    }
  }

  const prevPage = () => {
    if (isPageTurning) return

    if (currentPage > 0) {
      setIsPageTurning(true)
      setPageDirection("prev")
      setTimeout(() => {
        setCurrentPage(currentPage - 1)
        setIsPageTurning(false)
      }, 600)
    } else if (currentPage === 0) {
      closeBook()
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (bookState === "open") {
        if (e.key === "ArrowRight" || e.key === " ") {
          e.preventDefault()
          nextPage()
        } else if (e.key === "ArrowLeft") {
          e.preventDefault()
          prevPage()
        } else if (e.key === "Escape") {
          closeBook()
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [bookState, currentPage])

  if (bookState === "closed") {
    return <BookCover album={album} onOpen={openBook} />
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-900/20 via-orange-900/20 to-red-900/20 flex items-center justify-center z-50">
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 text-amber-800 hover:bg-amber-100/50 backdrop-blur-sm"
          onClick={closeBook}
        >
          <X className="w-6 h-6" />
        </Button>
      )}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-amber-800/80 text-amber-100 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
          {isOnBackCover ? "Back Cover" : `Page ${currentPage + 1} of ${totalPages}`}
        </div>
      </div>

      {currentPage > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-amber-800 hover:bg-amber-100/50 backdrop-blur-sm"
          onClick={prevPage}
          disabled={isPageTurning}
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>
      )}

      {!isOnBackCover && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-amber-800 hover:bg-amber-100/50 backdrop-blur-sm"
          onClick={nextPage}
          disabled={isPageTurning}
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      )}

      <div className="relative w-full max-w-6xl h-full max-h-[85vh] mx-4">
        <div
          className={`relative w-full h-full transition-all duration-800 ease-in-out transform-gpu ${
            bookState === "opening" ? "scale-110" : bookState === "closing" ? "scale-95" : "scale-100"
          }`}
        >
          <div className="absolute left-1/2 top-0 w-4 h-full bg-gradient-to-r from-amber-900 to-amber-800 transform -translate-x-1/2 rounded-sm shadow-2xl z-0" />

          <div
            className={`absolute left-0 top-0 w-1/2 h-full transition-all duration-600 transform-gpu ${
              isPageTurning && pageDirection === "next" ? "rotate-y-180" : ""
            } ${isPageTurning && pageDirection === "prev" ? "rotate-y-0" : ""}`}
            style={{ transformOrigin: "right center", perspective: "1000px" }}
          >
            {isOnBackCover ? (
              <div className="w-full h-full" />
            ) : currentPage >= 0 && album.pages[currentPage] ? (
              <BookPage
                page={album.pages[currentPage]}
                isLeft={true}
                onClick={prevPage}
                isClickable={currentPage > 0}
              />
            ) : (
              <div className="w-full h-full bg-cream-50 rounded-l-lg" />
            )}
          </div>

          <div
            className={`absolute right-0 top-0 w-1/2 h-full transition-all duration-600 transform-gpu ${
              isPageTurning && pageDirection === "next" ? "rotate-y-0" : ""
            } ${isPageTurning && pageDirection === "prev" ? "rotate-y-180" : ""}`}
            style={{ transformOrigin: "left center", perspective: "1000px" }}
          >
            {isOnBackCover ? (
              <BackCover album={album} onClick={closeBook} />
            ) : currentPage >= 0 && album.pages[currentPage] ? (
              <BookPage page={album.pages[currentPage]} isLeft={false} onClick={nextPage} isClickable={true} />
            ) : (
              <div className="w-full h-full bg-cream-50 rounded-r-lg" />
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-amber-800/70 text-sm">Click pages to turn • Use arrow keys • Press ESC to close</p>
      </div>
    </div>
  )
}
