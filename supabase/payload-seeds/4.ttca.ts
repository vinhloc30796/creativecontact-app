import "dotenv/config";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import path from "path";
import { makeEventSeed } from "./0.template";

const seeds: any[] = [
  {
    slug: "trungthu-archive-2024",
    status: "active",
    title: "Trung Thu Creative Archive",
    eventDate: new Date().toISOString(),
    summary:
      "Trung Thu Creative Archive (TTCA) là nơi lưu giữ và lan tỏa các tác phẩm, ý tưởng và câu chuyện về Trung thu do cộng đồng tất cả các ngành sáng tạo cùng đóng góp.",
    location: "Ho Chi Minh City, Vietnam",
    content: [
      {
        blockType: "EventDetails",
        heading: "Giới thiệu",
        richText: {
          root: {
            type: "root",
            format: "",
            indent: 0,
            version: 1,
            children: [
              {
                type: "paragraph",
                format: "",
                indent: 0,
                version: 1,
                children: [
                  {
                    type: "text",
                    detail: 0,
                    format: 0,
                    mode: "normal",
                    style: "",
                    text: "TTCA là nơi cộng đồng cùng đóng góp tác phẩm, ý tưởng và câu chuyện về Trung thu.",
                    version: 1,
                  },
                ],
              },
            ],
            direction: "ltr",
          },
        },
        layout: "default",
      },
    ],
  },
];

export default async () => {
  const payload = await getPayload({ config: configPromise });

  // Reuse a placeholder image if exists; otherwise create a minimal media
  const seedImageRelativePath =
    "../seed-storage/artwork-assets/247dbc2a-3d80-49f6-83db-6a6ae3497b2a/lukewarm._the_starry_night_3f67cc86-d07f-4e37-8f4a-c60b4405832c.png";
  const filename = path.basename(seedImageRelativePath);
  let mediaId: string | number;
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
  });
  if (existing.docs.length > 0) {
    mediaId = existing.docs[0].id;
  } else {
    const created = await payload.create({
      collection: "media",
      data: { alt: filename },
      filePath: path.resolve(__dirname, seedImageRelativePath),
    });
    mediaId = created.id;
  }

  seeds.forEach((seed) => {
    seed.featuredImage = mediaId;
  });

  for (const data of seeds) {
    await makeEventSeed(data)();
  }
};


