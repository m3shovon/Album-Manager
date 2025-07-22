"use client"

import Image from "next/image"
import { Book, Camera } from "lucide-react"

interface AlbumCoverProps {
  album: {
    title: string
    coverImage: string
  }
  onOpen: () => void
}

export default function AlbumCover({ album, onOpen }: AlbumCoverProps) {
  return (
    <div className="perspective-1000">
      <div
        className="relative cursor-pointer transform-gpu transition-all duration-500 hover:scale-105 hover:rotate-y-12 group"
        onClick={onOpen}
      >
        {/* Book spine shadow */}
        <div className="absolute -right-2 top-2 w-full h-full bg-gradient-to-r from-amber-800 to-amber-900 rounded-r-lg transform skew-y-1 opacity-60" />

        {/* Main book cover */}
        <div className="relative w-80 h-96 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-2xl border-4 border-amber-800 overflow-hidden">
          {/* Cover image */}
          <div className="absolute inset-4 rounded-md overflow-hidden">
            <Image src={album.coverImage || "/placeholder.svg"} alt={album.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Title */}
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-white text-2xl font-bold text-center drop-shadow-lg">{album.title}</h1>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 left-4">
            <Camera className="w-6 h-6 text-amber-800" />
          </div>

          <div className="absolute top-4 right-4">
            <Book className="w-6 h-6 text-amber-800" />
          </div>

          {/* Leather texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-200/20 to-amber-800/20 pointer-events-none" />

          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Click instruction */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-amber-800 text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
          Click to open album
        </div>
      </div>
    </div>
  )
}
