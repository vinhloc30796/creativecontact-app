import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getCustomPayload } from "@/lib/payload"
import { format } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv"
import { Badge } from "@/components/ui/badge"
import { Post } from "@/payload-types"
import { Staff } from "@/payload-types"

async function BlogPostsList() {
  const payload = await getCustomPayload()
  const { docs: posts } = await payload.find({
    collection: 'posts',
    depth: 2,
    where: {
      _status: {
        equals: 'published'
      }
    },
    sort: '-publishedOn'
  })

  if (!posts.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4">No posts found</h2>
        <p className="text-muted-foreground mb-6">
          It looks like there are no blog posts published yet.
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post: Post
      ) => (
        <Card key={post.id} className="flex flex-col h-full">
          <CardHeader className="p-0 relative aspect-video">
            {post.image && typeof post.image === 'object' && post.image.url && (
              <Image
                src={post.image.url}
                alt={post.image.alt || ''}
                fill
                className="rounded-t-lg object-cover"
              />
            )}
          </CardHeader>
          <CardContent className="flex-1 p-6">
            <CardTitle className="mb-4">{post.title}</CardTitle>
            <p className="text-muted-foreground line-clamp-3">
              {post.excerpt || 'No excerpt available'}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between items-center p-6">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {post.authors?.length > 0 ? (
                  post.authors.map((author: number | Staff) => (
                    <Badge key={typeof author === 'object' ? author.id : author} variant="secondary">
                      {typeof author === 'object' ? author.name : 'Unknown Author'}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary">Unknown Author</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {format(new Date(post.publishedOn), 'MMM dd, yyyy')}
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href={`/blog/${post.slug}`}>Read more</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <Skeleton className="aspect-video" />
          <CardContent className="p-6">
            <Skeleton className="h-6 mb-4" />
            <Skeleton className="h-4 mb-2" />
            <Skeleton className="h-4" />
          </CardContent>
          <CardFooter className="p-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-24 ml-auto" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default function BlogPage() {
  return (
    <BackgroundDiv eventSlug="hoantat-2024" shouldCenter={false}>
      <div className="container py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground">
            Latest news and updates from our team
          </p>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <BlogPostsList />
        </Suspense>
      </div>
    </BackgroundDiv>
  )
}

