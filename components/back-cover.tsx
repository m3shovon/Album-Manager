"use client"

import { Heart, Calendar, MapPin } from "lucide-react"

interface Album {
  title: string
  subtitle: string
}

interface BackCoverProps {
  album: Album
  onClick: () => void
}

export default function BackCover({ album, onClick }: BackCoverProps) {
  return (
    <div
      className="w-full h-full bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 rounded-r-lg shadow-2xl cursor-pointer relative overflow-hidden"
      onClick={onClick}
    >
      {/* Page texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-amber-50/30" />

      {/* Binding shadow */}
      <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-amber-200/40 to-transparent" />

      {/* Decorative corner elements */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-amber-800 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-amber-800 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-amber-800 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-amber-800 rounded-br-lg" />

      {/* Content */}
      <div className="relative p-8 h-full flex flex-col items-center justify-center text-center">
        {/* Heart decoration */}
        <div className="mb-8">
          <Heart className="w-16 h-16 text-amber-700 fill-amber-200" />
        </div>

        {/* Album info */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-amber-900 mb-2">{album.title}</h2>
          <p className="text-xl text-amber-800 mb-6">{album.subtitle}</p>
        </div>

        {/* Album details */}
        <div className="space-y-4 text-amber-800">
          <div className="flex items-center justify-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Summer 2024</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">California Adventures</span>
          </div>
        </div>

        {/* Decorative text */}
        <div className="mt-12 text-amber-700 italic">
          <p className="text-lg">"Memories are the treasures"</p>
          <p className="text-lg">"that we keep locked deep"</p>
          <p className="text-lg">"within the storehouse of our souls."</p>
        </div>

        {/* Close instruction */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="bg-amber-800/80 text-white px-4 py-2 rounded-full text-sm font-medium">
            Click to close album
          </div>
        </div>
      </div>

      {/* Book binding details */}
      <div className="absolute left-2 top-8 bottom-8 w-1 bg-amber-800 rounded-full" />
      <div className="absolute left-4 top-12 bottom-12 w-0.5 bg-amber-700 rounded-full" />

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/30 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </div>
  )
}
