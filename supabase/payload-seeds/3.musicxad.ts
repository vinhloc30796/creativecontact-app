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
    slug: "musicxad",
    status: "past",
    title: "Music x Ad: Nhạc quảng cáo làm quảng cáo không nhạt",
    eventDate: new Date().toISOString(),
    summary:
      "Xuân đến, hè về, thu qua, đông dừng chân - Mỗi mùa trong năm, mùa nào sao cũng cần đến nhạc quảng cáo? Làm nhạc quảng cáo giữa agency và music house diễn ra như thế nào? Đó là chủ đề của workshop bạn đang xem: Music x Ad. Cùng Creative Contact khám phá xem cách các nhà làm nhạc quảng cáo 'hook' người nghe như nào nha.",
    location:
      "Workshop được tổ chức tại 2 agency là Dinosaur và Vero với sự dàn dựng và chia sẻ của Mõ Music House: Phương Anh, mess., Pixel Neko",
    content: [
      {
        blockType: "EventDetails",
        heading:
          "Nhạc quảng cáo nghe thì quảng cáo thiệt nhưng sao độ reply lúc nào cũng cao?",
        richText: createRichText(
          "Xuân đến, hè về, thu qua, đông dừng chân - Mỗi mùa trong năm, mùa nào sao cũng cần đến nhạc quảng cáo? Làm nhạc quảng cáo giữa agency và music house diễn ra như thế nào? Đó là chủ đề của workshop bạn đang xem: Music x Ad. Cùng Creative Contact khám phá xem cách các nhà làm nhạc quảng cáo “hook” người nghe như nào nha.\n\nWorkshop được tổ chức tại 2 agency là Dinosaur và Vero với sự dàn dựng và chia sẻ của Mõ Music House: Phương Anh, mess., Pixel Neko.",
        ),
        layout: "default",
      },
      {
        blockType: "EventSpeaker",
        name: "Pixel Neko",
        role: "Host",
        image: "",
        description: createRichText(
          "Pixel Neko là thành viên của Mõ Music House, phụ trách sản xuất âm nhạc cho nhiều chiến dịch quảng cáo. Anh mang đến góc nhìn sáng tạo và chuyên môn sâu về cách xây dựng 'hook' âm nhạc trong các sản phẩm truyền thông.",
        ),
        socialLinks: [],
        layout: "standard",
      },
      {
        blockType: "EventDetails",
        heading: "Sau đây là những chia sẻ từ Mõ Music House",
        richText: createRichText(
          "Là một buổi chia sẻ kinh nghiệm về cách làm nhạc quảng cáo - điều mà cả agency và music house đều cần nắm rõ để tạo ra những sản phẩm âm nhạc hiệu quả. Một vài tips được Mõ Music House chia sẻ tại workshop:",
        ),
        layout: "default",
      },
      {
        blockType: "EventDetails",
        heading: "Định dạng nhạc quảng cáo phổ biến",
        richText: createRichText(
          "• Jingle: Được tạo bởi nhà sản xuất âm nhạc, không có lời hoặc có 1 đoạn lời rất ngắn, sử dụng âm thanh của các loại nhạc cụ khác nhau làm chất liệu chính.\n• Song: Được hoà âm phối khí bởi nhà sản xuất âm nhạc, nhạc sĩ, ca sĩ…, bao gồm tiết tấu, giai điệu và lời hát, có tính chất phức tạp hơn.\n\nCùng xem tiếp cách các nhà làm nhạc “lấy lòng” nhãn hàng quảng cáo ở phần tiếp theo nào.",
        ),
        layout: "default",
      },
      {
        blockType: "EventDetails",
        heading: "Sở hữu cấu trúc “bài hát quảng cáo”",
        richText: createRichText(
          "Cấu trúc chung 1 bài hát:\n• Intro – Phần dạo đầu cho bài hát, gợi lên sự tò mò cho người nghe hoặc mở đầu câu hát.\n• Verse – Phần nhạc chính để đưa thông điệp vào chi tiết. Qua đó dẫn dắt người nghe đi vào mạch cảm xúc của bài hát.\n• Pre-chorus – Phần nhạc tăng tiến để dẫn người nghe đến với phần “hook”.\n• Chorus/Drop – Phần climax chính của bài nhạc, nơi thông điệp được truyền tải chính kèm với mạch cảm xúc được đẩy lên đỉnh lần 1.\n• Bridge – Phần giãn nhịp bài nhạc để đẩy đến đoạn cao trào cuối.\n• Climax – Đưa cảm xúc lên cao nhất, một lần nữa nhấn mạnh thông điệp bài hát.\n• Outro – Đây là phần kết và thả cảm xúc ở cuối cùng.\n\n*Lưu ý: cấu trúc có thể và nên thay đổi tùy theo tính chất sáng tạo của dự án.*",
        ),
        layout: "default",
      },
      {
        blockType: "EventDetails",
        heading: "Các thành phần trong âm nhạc để agency dễ feedback với music house",
        richText: createRichText(
          "• Drums – Gồm các nhạc cụ trống kick, snare, hat, percussions… để tạo groove cho bài.\n• Lead – Gồm các nhạc cụ key lead, guitar lead, synth lead… để tạo melody chính cho bài nhạc.\n• Bass – Gồm các nhạc cụ guitar bass, synth bass, sub bass… để tạo không gian trầm cho bài.\n• Main vocal – Giọng chính của bài nhạc.\n• Back vocal – Nhóm các giọng nền để tạo không gian cho vocal.\n• Pad – Gồm các nhạc cụ synth pad, strings… để tạo rhythm và không gian cho bài.\n• SFX – Sound Effect: các tiếng động effect để tạo ấn tượng cho các đoạn khác nhau trên nền nhạc chính.\n• Voice over – Tiếng thoại bổ trợ theo nội dung bài nhạc hoặc các media liên quan.",
        ),
        layout: "default",
      },
      {
        blockType: "EventDetails",
        heading: "Feedback chi tiết & ví dụ thực tế",
        richText: createRichText(
          "Trong kinh nghiệm làm việc, music house sẽ rất cần ví dụ cụ thể, feedback chi tiết về tinh thần, tông điệu, thậm chí cảm nhận của khách hàng và agency, từ đó dễ điều chỉnh sản phẩm phù hợp nhất.\n\nĐặc biệt, trong danh sách các chiến dịch đạt giải MMA Smarties Awards 2022, có đến hơn 10 chiến dịch sử dụng âm nhạc làm chất liệu truyền thông. Điều này phản ánh sự kết hợp ngày càng phổ biến giữa các nhà làm nhạc và các nhà sáng tạo quảng cáo.\n\nWorkshop lần này, Creative Contact đã may mắn kết nối với Vero Agency, Dinosaur Agency và nhà làm nhạc Mõ Music House. Đây là cơ hội để các nhà quảng cáo và các nhà làm nhạc gặp gỡ, kết nối và tìm hiểu những giai điệu thú vị cho các thước phim quảng cáo.",
        ),
        layout: "default",
      },
      {
        blockType: "EventGallery",
        heading: "Workshop Highlights",
        description:
          "Cùng ngắm lại những khoảnh khắc tại workshop và follow Mõ Music House trên Creative Contact nhé.",
        images: [
          { image: "", caption: "Love & Peace", altText: "Love & Peace" },
        ],
        layout: "grid",
        columns: "2",
      },
      {
        blockType: "EventCredits",
        heading: "Credit",
        credits: [
          { name: "Dinosaur Agency", roles: [{ role: "Venue sponsor" }] },
          { name: "Vero Agency", roles: [{ role: "Venue sponsor" }] },
          { name: "Mõ Music House", roles: [{ role: "Host" }] },
          { name: "Anh", roles: [{ role: "Host" }] },
          { name: "mess.", roles: [{ role: "Host" }] },
          { name: "Pixel Neko", roles: [{ role: "Host" }] },
          { name: "Khải Hoàn", roles: [{ role: "Organizer" }] },
          {
            name: "Minh Châu",
            roles: [
              { role: "Designer" },
              { role: "Organizer" },
            ],
          },
          { name: "Annie", roles: [{ role: "Content writer" }] },
        ],
        layout: "standard",
      },
    ],
  },
];

export default async () => {
  const payload = await getPayload({ config: configPromise });

  // Define image paths for different purposes
  const imageFiles = [
    "lukewarm._illustrative_images_for_a_workshop_event_that_teaches_54bb1f85-46e9-4fe9-9d7d-6da19ebc6ef7.png",
    "lukewarm._illustrative_images_for_a_workshop_event_that_teaches_603c18c9-46cb-4361-a5bc-62e88f84948e.png",
    "lukewarm._illustrative_images_for_a_workshop_event_that_teaches_98ee7f6a-475a-4cd6-8568-1884169a9251.png",
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
      const seedImageRelativePath = `../seed-storage/payload-cms/music-x-ad/${filename}`;
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
