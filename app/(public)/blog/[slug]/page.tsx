import { RichText } from "@/components/payload-cms/RichText";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H1 } from "@/components/ui/typography";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { getCustomPayload } from "@/lib/payload/getCustomPayload";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const payload = await getCustomPayload();
  const { slug } = await params;
  const {
    docs: [post],
  } = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug } },
    depth: 1,
  });

  return {
    title: post?.title,
    openGraph: {
      images:
        post?.image && typeof post.image === "object"
          ? [
              {
                url: post.image.url || "",
                width: 1200,
                height: 630,
                alt: post.title,
              },
            ]
          : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const payload = await getCustomPayload();
  const { slug } = await params;
  const {
    docs: [post],
  } = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug } },
    depth: 2,
  });

  if (!post) notFound();

  return (
    <BackgroundDiv>
      <div className="container max-w-4xl py-12">
        <Card>
          <CardHeader>
            <CardTitle>
              <H1>{post.title}</H1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-none">
              {post.content ? (
                <RichText
                  data={post.content}
                  enableProse
                  enableGutter={false}
                />
              ) : (
                <p className="text-muted-foreground">No content available.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </BackgroundDiv>
  );
}

export async function generateStaticParams() {
  const payload = await getCustomPayload();
  const { docs: posts } = await payload.find({ collection: "posts" });
  return posts.map((post) => ({ slug: post.slug }));
}
