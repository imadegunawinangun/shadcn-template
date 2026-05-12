import { 
  Geist, Geist_Mono, Roboto, Inter, DM_Sans, Outfit, Space_Grotesk, IBM_Plex_Sans,
  Playfair_Display, Montserrat, Poppins, Raleway, Lato, Open_Sans, Oswald, 
  Sora, Syne, Urbanist, Lexend, Manrope, Nunito, Ubuntu, Work_Sans, Quicksand,
  PT_Sans, Cabin, Noto_Sans, Merriweather, Source_Sans_3
} from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-roboto' })
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })
const ibmPlexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-ibm-plex-sans' })

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-poppins' })
const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway' })
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-lato' })
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-open-sans' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })
const syne = Syne({ subsets: ['latin'], variable: '--font-syne' })
const urbanist = Urbanist({ subsets: ['latin'], variable: '--font-urbanist' })
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })
const ubuntu = Ubuntu({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-ubuntu' })
const workSans = Work_Sans({ subsets: ['latin'], variable: '--font-work-sans' })
const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand' })
const ptSans = PT_Sans({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-pt-sans' })
const cabin = Cabin({ subsets: ['latin'], variable: '--font-cabin' })
const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-noto-sans' })
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-merriweather' })
const sourceSans = Source_Sans_3({ subsets: ['latin'], variable: '--font-source-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

import { ClerkProvider } from "@clerk/nextjs"

import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={cn(
          "antialiased",
          inter.variable,
          roboto.variable,
          geist.variable,
          dmSans.variable,
          outfit.variable,
          spaceGrotesk.variable,
          ibmPlexSans.variable,
          playfair.variable,
          montserrat.variable,
          poppins.variable,
          raleway.variable,
          lato.variable,
          openSans.variable,
          oswald.variable,
          sora.variable,
          syne.variable,
          urbanist.variable,
          lexend.variable,
          manrope.variable,
          nunito.variable,
          ubuntu.variable,
          workSans.variable,
          quicksand.variable,
          ptSans.variable,
          cabin.variable,
          notoSans.variable,
          merriweather.variable,
          sourceSans.variable,
          fontMono.variable
        )}
      >
        <body>
          <ThemeProvider>
            <TooltipProvider delayDuration={0}>
              {children}
              <Toaster position="top-right" expand={true} richColors />
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>

    </ClerkProvider>
  )
}

