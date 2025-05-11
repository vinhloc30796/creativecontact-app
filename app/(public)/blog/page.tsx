import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCustomPayload } from "@/lib/payload/getCustomPayload";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/payload-types";
import { Staff } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { H1, P, Lead } from "@/components/ui/typography";

async function BlogPostsList() {
  const payload = await getCustomPayload();
  const { docs: posts } = await payload.find({
    collection: "posts",
    depth: 2,
    where: {
      _status: {
        equals: "published",
      },
    },
    sort: "-publishedOn",
  });

  if (!posts.length) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <H1 size="2">No posts found</H1>
        <P className="mb-6">
          It looks like there are no blog posts published yet.
        </P>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post: Post) => (
        <Card key={post.id} className="flex h-full flex-col">
          <CardHeader className="relative aspect-video p-0">
            {post.image && typeof post.image === "object" && post.image.url && (
              <Image
                src={post.image.url}
                alt={post.image.alt || ""}
                fill
                className="rounded-t-lg object-cover"
              />
            )}
          </CardHeader>
          <CardContent className="flex-1 p-6">
            <CardTitle className="mb-4">{post.title}</CardTitle>
            <P className="line-clamp-3 text-muted-foreground">
              {post.excerpt || "No excerpt available"}
            </P>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-6">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {post.authors?.length > 0 ? (
                  post.authors.map((author: number | Staff) => (
                    <Badge
                      key={typeof author === "object" ? author.id : author}
                      variant="secondary"
                    >
                      {typeof author === "object"
                        ? author.name
                        : "Unknown Author"}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary">Unknown Author</Badge>
                )}
              </div>
              <P className="text-xs text-muted-foreground">
                {format(new Date(post.publishedOn), "MMM dd, yyyy")}
              </P>
            </div>
            <Button asChild variant="outline">
              <Link href={`/blog/${post.slug}`}>Read more</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <Skeleton className="aspect-video" />
          <CardContent className="p-6">
            <Skeleton className="mb-4 h-6" />
            <Skeleton className="mb-2 h-4" />
            <Skeleton className="h-4" />
          </CardContent>
          <CardFooter className="p-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="ml-auto h-10 w-24" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function BlogPage() {
  return (
    <BackgroundDiv shouldCenter={false}>
      <div className="container py-12">
        <div className="mb-12 text-center">
          <H1>Blog</H1>
          <Lead>Latest news and updates from our team</Lead>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <BlogPostsList />
        </Suspense>
      </div>
    </BackgroundDiv>
  );
}
