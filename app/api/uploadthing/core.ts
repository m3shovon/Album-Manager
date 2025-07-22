import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      console.log("Image upload middleware")
      return { userId: "anonymous" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId)
      console.log("file url", file.url)

      // Return data to send to client
      return {
        url: file.url,
        key: file.key,
        name: file.name,
        size: file.size,
        type: file.type,
      }
    }),

  videoUploader: f({
    video: {
      maxFileSize: "16MB",
      maxFileCount: 5,
    },
  })
    .middleware(async ({ req }) => {
      console.log("Video upload middleware")
      return { userId: "anonymous" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      console.log("file url", file.url)

      return {
        url: file.url,
        key: file.key,
        name: file.name,
        size: file.size,
        type: file.type,
      }
    }),

  mediaUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
    video: {
      maxFileSize: "16MB",
      maxFileCount: 5,
    },
  })
    .middleware(async ({ req }) => {
      console.log("Media upload middleware")
      return { userId: "anonymous" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      console.log("file url", file.url)

      return {
        url: file.url,
        key: file.key,
        name: file.name,
        size: file.size,
        type: file.type,
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
