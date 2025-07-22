"use client"

import Image from "next/image"
import { Play } from "lucide-react"

interface AlbumItem {
  type: "image" | "video"
  src: string
  caption: string
  duration?: string
}

interface AlbumPageProps {
  page: {
    id: number
    items: AlbumItem[]
  }
}

export default function AlbumPage({ page }: AlbumPageProps) {
  const getGridClass = (itemCount: number) => {
    switch (itemCount) {
      case 1:
        return "grid-cols-1"
      case 2:
        return "grid-cols-1 md:grid-cols-2"
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      default:
        return "grid-cols-2 md:grid-cols-2"
    }
  }

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-2xl p-6 overflow-hidden">
      <div className={`grid gap-4 h-full ${getGridClass(page.items.length)}`}>
        {page.items.map((item, index) => (
          <div key={index} className="relative group">
            <div className="relative w-full h-full min-h-[200px] rounded-lg overflow-hidden bg-gray-100">
              {item.type === "image" ? (
                <Image
                  src={item.src || "/placeholder.svg"}
                  alt={item.caption}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="relative w-full h-full">
                  <Image src={item.src || "/placeholder.svg"} alt={item.caption} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-3">
                      <Play className="w-8 h-8 text-gray-800 ml-1" />
                    </div>
                  </div>
                  {item.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {item.duration}
                    </div>
                  )}
                </div>
              )}

              {/* Caption overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm font-medium">{item.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
