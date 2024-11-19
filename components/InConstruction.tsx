import { JSX, SVGProps } from "react"
import { Card, CardContent, CardHeader } from "./ui/card"
import { useTranslation } from "@/lib/i18n/init-server"
import Image from "next/image";

export default async function InConstruction({ lang }: { lang: string }) {
  const { t } = await useTranslation(lang, 'inConstruction');
  return (
    <Card className="max-w-3xl min-w-xl mx-auto mt-10">
      <CardHeader
        className="border-b relative aspect-video bg-accent-foreground text-accent-foreground"
      >
        <Image src='/banner.jpg' alt="Creative Contact - Banner" fill className="object-cover" />
      </CardHeader>
      <CardContent className="p-6 flex flex-col gap-2 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-2 text-3xl justify-center">
          <ConstructionIcon className="h-10 w-10" />
          <span className="mt-2 sm:mt-0 font-bold">{t("inConstruction.title")}</span>
        </div>
        <p className="mt-4 max-w-md text-sm sm:text-base text-muted-foreground">
          {t("inConstruction.description")}
        </p>
      </CardContent>
    </Card>
  )
}

function ConstructionIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="6" width="20" height="8" rx="1" />
      <path d="M17 14v7" />
      <path d="M7 14v7" />
      <path d="M17 3v3" />
      <path d="M7 3v3" />
      <path d="M10 14 2.3 6.3" />
      <path d="m14 6 7.7 7.7" />
      <path d="m8 6 8 8" />
    </svg>
  )
}