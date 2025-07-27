import "dotenv/config";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { Event } from "@/payload-types";
import path from "path";
import { makeEventSeed } from "./0.template";

// Minimal Lexical serialized state
const createRichText = (text: string) =>
  ({
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
              text,
              version: 1,
            },
          ],
        },
      ],
      direction: "ltr",
    },
  }) as any;

const seeds: any[] = [
  {
    slug: "photox3d",
    status: "past",
    title: "Photo x 3D: cùng hiểu về ánh sáng",
    eventDate: new Date().toISOString(),
    summary:
      "Dù là môi trường thực tế hay môi trường 3D, hiểu về nguồn sáng và cách sử dụng ánh sáng đều rất cần thiết để người thực hành tạo được một tác phẩm giàu nội dung với chính người thực hành và cả người xem. Vậy có những loại nguồn sáng nào? Kỹ thuật đánh sáng trong một tác phẩm bao gồm yếu tố gì? Như thế nào là một tác phẩm đẹp?",
    location:
      "Một căn phòng học của DAS với sự dẫn dắt bởi anh Tùng Chu, 25 người sáng tạo từ các ngành nhiếp ảnh, hậu kỳ, nghệ sĩ 3D",
    content: [
      {
        blockType: "EventDetails",
        heading: "Giới thiệu",
        richText: createRichText(
          "Photographer và 3D artist được cô giáo xếp ngồi cạnh nhau, họ cùng bàn ánh sáng.",
        ),
        layout: "default",
      },
      {
        blockType: "EventSpeaker",
        name: "Tùng Chu",
        role: "Host",
        image: "",
        description: createRichText(
          "Anh Tùng Chu là một nhiếp ảnh gia hơn 12 năm kinh nghiệm (2022), thực hành của anh trải dài từ nhiếp ảnh thời trang, quảng cáo, đến cả 3D và A.I. Với anh, ánh sáng chính là bí quyết của một tấm hình đẹp, workshop Photo x 3D cũng đánh dấu sự bắt đầu “ra khỏi hang” mà anh có chia sẻ, cũng là workshop đầu tiên của Creative Contact để đưa các cộng đồng lại gần nhau hơn qua chia sẻ kinh nghiệm và kiến thức.",
        ),
        socialLinks: [],
        layout: "standard",
      },
      {
        blockType: "EventDetails",
        heading: "Chia sẻ tips",
        richText: createRichText(
          "1. 3 nguồn sáng cơ bản trong 1 bức ảnh gồm: key light, fill light, highlight\n2. 3 góc máy nên cân nhắc khi khai thác chủ thể bộ ảnh: toàn, trung, cận\n3. Trong điều kiện không lý tưởng, bộ hình vẫn có thể tốt nếu có ít nhất 1 trong 4 yếu tố: ý tưởng tốt, tính thời trang tốt, DI tốt, ánh sáng tốt\n4. Kỹ năng DI (digital imaging) rất hữu ích cho 3D artist\n5. Hãy nhớ chọn ánh sáng phù hợp với nội dung\n6. Thử tận dụng những tài nguyên 3D có sẵn, kết hợp kỹ năng Photoshop manipulation để tạo bộ ảnh theo ý mình\n7. Khi làm việc với khách hàng, hãy dùng kinh nghiệm, kỹ năng và tư duy để đưa ra giải pháp. Đó chính là cách dùng cái tôi khi làm nghề.\n8. Bên cạnh chuyên môn, thái độ làm việc và câu chuyện riêng của chính người làm nghề sẽ là yếu tố giúp kết nối tốt hơn với khách hàng.\n9. Cuối cùng: yêu tác phẩm của mình trước!",
        ),
        layout: "default",
      },
      {
        blockType: "EventGallery",
        heading: "Workshop Highlights",
        description:
          "Cùng ngắm lại những bộ hình đã được chia sẻ và follow anh Tùng Chu trên Creative Contact nhé.",
        images: [
          { image: "", caption: "Love & Peace", altText: "Love & Peace" },
          { image: "", caption: "Hình 1", altText: "Hình 1" },
          { image: "", caption: "Hình 2", altText: "Hình 2" },
          { image: "", caption: "Hình 3", altText: "Hình 3" },
        ],
        layout: "grid",
        columns: "3",
      },
      {
        blockType: "EventCredits",
        heading: "Credit",
        credits: [
          { name: "Tùng Chu", roles: [{ role: "Host" }] },
          { name: "Khải Hoàn", roles: [{ role: "Organizer" }] },
          {
            name: "Minh Châu",
            roles: [
              { role: "Organizer" },
              { role: "Designer" },
              { role: "Content Writer" },
            ],
          },
          {
            name: "Thuận Võ",
            roles: [{ role: "Photographer" }, { role: "Support" }],
          },
          { name: "Khoachim", roles: [{ role: "Supporter" }] },
        ],
        layout: "standard",
      },
      {
        blockType: "EventDetails",
        heading: "Thông tin thêm",
        richText: createRichText(
          "Workshop lố giờ 1 tiếng vì mọi người nán lại trao đổi và làm quen lẫn nhau, và cũng vì DAS dung túng cho những hoạt động của cộng đồng sáng tạo.\nSố lượng người tham gia: 25",
        ),
        layout: "default",
      },
    ],
  },
];

export default async () => {
  const payload = await getPayload({ config: configPromise });

  // Define image paths for different purposes
  const imageFiles = [
    "lukewarm._illustrative_images_for_a_workshop_event_that_teaches_3900d05a-bb24-4db3-94d6-467792d5ef57.png",
    "lukewarm._illustrative_images_for_a_workshop_event_that_teaches_6b810443-f8f1-4d1c-a480-a365a1a79626.png",
    "lukewarm._illustrative_images_for_a_workshop_event_that_teaches_79a59da8-b24a-40ee-8fca-0f092018c443.png",
    "lukewarm._illustrative_images_for_a_workshop_event_that_teaches_b9f256c8-39b1-4764-a994-1f0e1bf2104a.png",
    "lukewarm._illustrative_images_for_a_workshop_event_that_teaches_c0f4ca12-7f88-4ed7-8293-4065afa04709.png",
    "lukewarm._illustrative_images_for_a_workshop_event_that_teaches_eb6fa185-ab97-4689-bc94-beee0eb85527.png",
  ];

  // Helper function to create or find media
  const createOrFindMedia = async (filename: string) => {
    const existing = await payload.find({
      collection: "media",
      where: { filename: { equals: filename } },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      return existing.docs[0].id;
    } else {
      const seedImageRelativePath = `../seed-storage/payload-cms/photo-x-3d/${filename}`;
      const created = await payload.create({
        collection: "media",
        data: { alt: filename },
        filePath: path.resolve(__dirname, seedImageRelativePath),
      });
      return created.id;
    }
  };

  // Create media entries for all images
  const mediaIds = await Promise.all(
    imageFiles.map((filename) => createOrFindMedia(filename)),
  );

  // Assign specific images to different purposes
  const [featuredImageId, speakerImageId, ...galleryImageIds] = mediaIds;

  // Set featured image
  seeds.forEach((seed) => {
    seed.featuredImage = featuredImageId;
  });

  // Set speaker image
  seeds[0].content[1].image = speakerImageId;

  // Set gallery images
  seeds[0].content.forEach((block: any) => {
    if (block.blockType === "EventGallery" && Array.isArray(block.images)) {
      block.images.forEach((imageItem: any, index: number) => {
        if (index < galleryImageIds.length) {
          imageItem.image = galleryImageIds[index];
        }
      });
    }
  });

  for (const data of seeds) {
    await makeEventSeed(data)();
  }
};
