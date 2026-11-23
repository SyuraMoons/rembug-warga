import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticipantProvider } from "@/components/ParticipantProvider";
import { A11Y_INIT_SCRIPT } from "@/components/A11yControls";
import { getParticipant } from "@/lib/participant";
import { SITE } from "@/content/site";

// Lato: tipografi yang sama dengan deck referensi. Bukan variable font, jadi bobot wajib disebut.
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: { default: `${SITE.name} | ${SITE.slogan}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
};

export const viewport: Viewport = {
  themeColor: "#2554eb",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const participant = await getParticipant();

  return (
    <html lang="id" className={`${lato.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: A11Y_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <a href="#konten" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-white focus:p-3 focus:font-bold">
          Langsung ke konten
        </a>
        <ParticipantProvider participant={participant ? { name: participant.name, group: participant.group } : null}>
          <Navbar />
          <main id="konten" className="flex-1">
            {children}
          </main>
          <Footer />
        </ParticipantProvider>
      </body>
    </html>
  );
}
