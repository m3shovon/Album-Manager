"use client"

import Image from "next/image"
import { Play } from "lucide-react"

interface AlbumItem {
  type: "image" | "video"
  src: string
  caption: string
  duration?: string
}

interface AlbumPage {
  id: number
  title: string
  items: AlbumItem[]
}

interface BookPageProps {
  page: AlbumPage
  isLeft: boolean
  onClick: () => void
  isClickable: boolean
}

export default function BookPage({ page, isLeft, onClick, isClickable }: BookPageProps) {
  // Add safety check for page data
  if (!page || !page.items) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br from-cream-50 to-cream-100 shadow-2xl ${
          isLeft ? "rounded-l-lg" : "rounded-r-lg"
        } flex items-center justify-center`}
      >
        <p className="text-amber-600">Loading page...</p>
      </div>
    )
  }

  const getLayoutClass = (itemCount: number) => {
    switch (itemCount) {
      case 1:
        return "grid-cols-1"
      case 2:
        return "grid-cols-1 gap-4"
      case 3:
        return "grid-cols-2 gap-3"
      case 4:
        return "grid-cols-2 gap-3"
      default:
        return "grid-cols-2 gap-2"
    }
  }

  const getItemClass = (index: number, total: number) => {
    if (total === 3 && index === 0) return "col-span-2"
    if (total === 1) return "col-span-1"
    return ""
  }

  return (
    <div
      className={`w-full h-full bg-gradient-to-br from-cream-50 to-cream-100 shadow-2xl ${
        isLeft ? "rounded-l-lg" : "rounded-r-lg"
      } ${isClickable ? "cursor-pointer" : ""} relative overflow-hidden`}
      onClick={isClickable ? onClick : undefined}
    >
      {/* Page texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-amber-50/30" />

      {/* Binding shadow */}
      {isLeft ? (
        <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-amber-200/40 to-transparent" />
      ) : (
        <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-amber-200/40 to-transparent" />
      )}

      {/* Page content */}
      <div className="relative p-8 h-full flex flex-col">
        {/* Page title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-amber-900 text-center border-b-2 border-amber-200 pb-2">
            {page.title || "Untitled"}
          </h2>
        </div>

        {/* Photo grid */}
        <div className={`grid ${getLayoutClass(page.items?.length || 0)} flex-1 content-start`}>
          {page.items?.map((item, index) => (
            <div key={index} className={`relative group ${getItemClass(index, page.items?.length || 0)}`}>
              {/* Photo frame */}
              <div className="relative bg-white p-2 shadow-lg transform rotate-0 hover:rotate-1 transition-transform duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {item.type === "image" ? (
                    <Image
                      src={item.src || "/placeholder.svg"}
                      alt={item.caption || ""}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={item.src || "/placeholder.svg"}
                        alt={item.caption || ""}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-2">
                          <Play className="w-6 h-6 text-gray-800 ml-0.5" />
                        </div>
                      </div>
                      {item.duration && (
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                          {item.duration}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Photo caption */}
                <div className="mt-2 text-center">
                  <p className="text-xs text-amber-800 font-medium leading-tight">{item.caption || ""}</p>
                </div>

                {/* Photo corners (realistic photo effect) */}
                <div className="absolute top-1 left-1 w-3 h-3 bg-black/10 transform rotate-45" />
                <div className="absolute top-1 right-1 w-3 h-3 bg-black/10 transform rotate-45" />
                <div className="absolute bottom-1 left-1 w-3 h-3 bg-black/10 transform rotate-45" />
                <div className="absolute bottom-1 right-1 w-3 h-3 bg-black/10 transform rotate-45" />
              </div>
            </div>
          )) || []}
        </div>

        {/* Page number */}
        <div className="mt-4 text-center">
          <span className="text-sm text-amber-600 font-medium">{page.id || 1}</span>
        </div>
      </div>

      {/* Click hint */}
      {isClickable && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-amber-100/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-amber-800/80 text-white px-3 py-1 rounded-full text-sm font-medium">
            Click to turn page
          </div>
        </div>
      )}
    </div>
  )
}
