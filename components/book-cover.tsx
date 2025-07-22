"use client"

import Image from "next/image"
import { BookOpen, Camera } from "lucide-react"

interface Album {
  title: string
  subtitle: string
  coverImage: string
}

interface BookCoverProps {
  album: Album
  onOpen: () => void
}

export default function BookCover({ album, onOpen }: BookCoverProps) {
  return (
    <div className="perspective-1000 cursor-pointer" onClick={onOpen}>
      <div className="relative transform-gpu transition-all duration-700 hover:scale-105 hover:rotate-y-6 group">
        {/* Book spine and depth */}
        <div className="absolute -right-3 top-3 w-full h-full bg-gradient-to-r from-amber-900 via-amber-800 to-amber-700 rounded-r-xl transform skew-y-1 opacity-80 shadow-2xl" />
        <div className="absolute -right-2 top-2 w-full h-full bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 rounded-r-lg transform skew-y-0.5 opacity-60" />

        {/* Main book cover */}
        <div className="relative w-80 h-[480px] bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 rounded-xl shadow-2xl border-4 border-amber-800 overflow-hidden">
          {/* Leather texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-200/30 via-transparent to-amber-800/20" />

          {/* Decorative corner elements */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-amber-800 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-amber-800 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-amber-800 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-amber-800 rounded-br-lg" />

          {/* Cover photo frame */}
          <div className="absolute top-16 left-8 right-8 h-48 bg-white rounded-lg shadow-inner border-2 border-amber-700 overflow-hidden">
            <Image src={album.coverImage || "/placeholder.svg"} alt={album.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Title section */}
          <div className="absolute bottom-20 left-8 right-8 text-center">
            <h1 className="text-amber-900 text-2xl font-bold mb-2 drop-shadow-sm">{album.title}</h1>
            <p className="text-amber-800 text-lg font-medium">{album.subtitle}</p>
          </div>

          {/* Decorative icons */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
            <Camera className="w-6 h-6 text-amber-800" />
          </div>

          {/* Book binding details */}
          <div className="absolute left-2 top-8 bottom-8 w-1 bg-amber-800 rounded-full" />
          <div className="absolute left-4 top-12 bottom-12 w-0.5 bg-amber-700 rounded-full" />

          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
        </div>

        {/* Open book icon */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex items-center space-x-2 bg-amber-800 text-amber-100 px-4 py-2 rounded-full text-sm font-medium">
            <BookOpen className="w-4 h-4" />
            <span>Click to open</span>
          </div>
        </div>
      </div>
    </div>
  )
}
