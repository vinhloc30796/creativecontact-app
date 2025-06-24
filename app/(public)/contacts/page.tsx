import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { Metadata } from "next";
import { ScrollAnimatedContacts } from "./ScrollAnimatedContacts";

export const metadata: Metadata = {
  title: "Contact Book | Creative Contact",
  description:
    "Connect with Creative Contact's network of artists and creators.",
};

// Contact interface and dummyContacts are no longer needed here or from helper
// getContacts function from helper is no longer needed here

export default function ContactsPage() {
  return (
    <BackgroundDiv shouldCenter={false} className="flex min-h-screen flex-col">
      <ScrollAnimatedContacts />
      
      {/* Footer ticker */}
      <footer className="w-full overflow-hidden bg-sunglow py-3 text-black">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <span
                key={i}
                className="mx-4 text-base font-medium"
              >{`Connect with our creative network • Creative Contact`}</span>
            ))}
        </div>
      </footer>
    </BackgroundDiv>
  );
}
