import Image from "next/image";
import { Baloo_2 } from "next/font/google";
import fs from "fs";
import path from "path";
import ArtSection from "./components/ArtSection";
import RexyChatbot from "./components/RexyChatbot";
import Navbar from "./components/Navbar";
import DrawSection from "./components/DrawSection"; // 🆕 draw/paint section

// Cartoon heading font for logo/titles
const baloo = Baloo_2({ subsets: ["latin"] });

// 📌 Read all images from public/art (server-side)
function getGalleryImages() {
  const artDir = path.join(process.cwd(), "public", "art");

  if (!fs.existsSync(artDir)) {
    return [];
  }

  const files = fs.readdirSync(artDir);

  const imageFiles = files
    .filter((file) => /\.(png|jpe?g|gif|webp)$/i.test(file)) // only image files
    .map((file) => ({
      name: file,
      time: fs.statSync(path.join(artDir, file)).mtime.getTime(), // modified time
    }))
    .sort((a, b) => a.time - b.time) // oldest → newest
    .map((file) => `/art/${file.name}`); // convert to public URLs

  return imageFiles;
}

// 📌 Read all images from public/comics (server-side)
function getComicsImages() {
  const comicsDir = path.join(process.cwd(), "public", "comics");

  if (!fs.existsSync(comicsDir)) {
    return [];
  }

  const files = fs.readdirSync(comicsDir);

  const imageFiles = files
    .filter((file) => /\.(png|jpe?g|gif|webp)$/i.test(file)) // only image files
    .map((file) => ({
      name: file,
      time: fs.statSync(path.join(comicsDir, file)).mtime.getTime(),
    }))
    .sort((a, b) => a.time - b.time)
    .map((file) => `/comics/${file.name}`);

  return imageFiles;
}

export default function Home() {
  const galleryImages = getGalleryImages();
  const comicsImages = getComicsImages();
  const featuredImage =
    galleryImages[galleryImages.length - 1] || "/art/image1.jpg"; // fallback

  return (
    <main className="rex-bg min-h-screen text-slate-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* NAVBAR WITH HAMBURGER MENU */}
        <Navbar brandClassName={baloo.className} />

        {/* HEADER BANNER IMAGE */}
        <section className="mb-14 md:mb-16">
          <div className="relative w-full aspect-[16/7] rounded-3xl overflow-hidden border border-emerald-700/80 shadow-[0_0_45px_rgba(56,189,248,0.6)]">
            <Image
              src="/rextoon-header.jpg" // put the file in public/rextoon-header.jpg
              alt="REXTOON – Daily Comics & Art Gallery"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </section>

        {/* HERO SECTION */}
        <section className="grid md:grid-cols-[1.1fr_1fr] gap-10 items-center mb-16 md:mb-20">
          {/* TEXT SIDE */}
          <div className="space-y-5">
            <p className="pill inline-flex items-center text-[0.65rem] md:text-xs uppercase tracking-[0.35em] text-cyan-50/90 px-4 py-1.5">
              WEB3 CARTOONIST · HANDMADE ART
            </p>

            <div>
              <h1
                className={`${baloo.className} text-4xl md:text-6xl font-black leading-[1.02]`}
              >
                <span className="rex-gradient-text block drop-shadow-[0_0_24px_rgba(56,189,248,0.6)]">
                  T&nbsp;REX
                </span>
              </h1>
              <p className="mt-2 text-lg md:text-2xl font-semibold text-emerald-50/95">
                the cartoon dino of Web3.
              </p>
            </div>

            <p className="text-emerald-100/85 text-sm md:text-base max-w-md">
              I&apos;m a Web3 cartoonist drawing a tiny T-Rex in different moods,
              stories and crypto moments. All pieces start as handmade sketches,
              then I scan and bring them to life digitally.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#gallery"
                className="px-5 py-3 rounded-2xl bg-lime-300 text-slate-900 font-semibold text-xs md:text-sm shadow-[0_0_40px_rgba(190,242,100,0.65)] hover:bg-lime-200 transition-transform hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(190,242,100,0.85)]"
              >
                Explore Gallery
              </a>

              <a
                href="#featured"
                className="px-5 py-3 rounded-2xl border border-cyan-400/80 bg-slate-950/50 text-xs md:text-sm text-cyan-100/90 hover:border-fuchsia-400 hover:text-fuchsia-200 transition-colors"
              >
                View Featured Art
              </a>
            </div>

            <div className="flex flex-wrap gap-2 text-[0.68rem] md:text-[0.72rem] text-emerald-100/80">
              <span className="px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/60">
                ✏️ Handmade sketches
              </span>
              <span className="px-3 py-1 rounded-full bg-sky-900/60 border border-sky-500/60">
                🌐 Web3 culture & memes
              </span>
              <span className="px-3 py-1 rounded-full bg-fuchsia-900/50 border border-fuchsia-500/70">
                🎨 Future NFT collections
              </span>
            </div>
          </div>

          {/* FEATURED GOLD CARD */}
          <div id="featured" className="group relative perspective-[1200px]">
            <div
              className="relative rounded-3xl bg-gradient-to-br from-amber-300/40 via-amber-500/10 to-emerald-500/10 p-[2px] shadow-[0_0_45px_rgba(250,204,21,0.6)] transition-transform duration-300 group-hover:-rotate-2 group-hover:-translate-y-1"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="rounded-3xl bg-slate-950/90 border border-amber-300/60 px-4 py-4 md:px-5 md:py-5 backdrop-blur-xl">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900 via-sky-900 to-fuchsia-900">
                  <Image
                    src={featuredImage}
                    alt="Featured REXTOON artwork"
                    fill
                    sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(252,211,77,0.5),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(251,191,36,0.5),transparent_55%)] mix-blend-screen opacity-80" />
                </div>

                <div className="mt-4 text-[0.7rem] md:text-xs text-amber-50/95 flex items-center justify-between">
                  <div>
                    <div className="font-semibold tracking-wide">
                      Legendary Featured Card
                    </div>
                    <div className="text-amber-200/80">
                      Handmade · Scanned · REXTOON style
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full border border-amber-300/90 bg-amber-300/20 text-[0.65rem] uppercase tracking-[0.18em] text-amber-100 shadow-[0_0_18px_rgba(250,204,21,0.8)]">
                    GOLD
                  </span>
                </div>
              </div>

              {/* subtle glow behind card */}
              <div className="pointer-events-none absolute -inset-4 rounded-[32px] bg-[radial-gradient(circle_at_10%_0%,rgba(250,204,21,0.25),transparent_55%),radial-gradient(circle_at_90%_100%,rgba(59,130,246,0.25),transparent_55%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
          </div>
        </section>

        {/* ART GALLERY WITH RATING */}
        <ArtSection
          id="gallery"
          title="Art Gallery"
          images={galleryImages}
          enableRating
          headingClassName={baloo.className}
        />

        {/* COMICS SECTION */}
        <ArtSection
          id="comics"
          title="Rex Comics"
          images={comicsImages}
          headingClassName={baloo.className}
        />

        {/* DRAW SECTION 🖌️ */}
        <DrawSection headingClassName={baloo.className} />

        {/* ABOUT */}
        <section id="about" className="mb-14">
          <h3
            className={`${baloo.className} text-lg md:text-xl mb-3 text-emerald-50`}
          >
            About REXTOON
          </h3>
          <p className="text-emerald-100/85 text-sm md:text-base max-w-2xl leading-relaxed">
            REXTOON is my cartoon universe about a tiny T-Rex trying to become a
            Web3 legend. I mix handmade sketchbook drawings with digital colour and
            crypto storytelling. This website is the main hub for my T-Rex art,
            experiments and future NFT drops.
          </p>
        </section>

        {/* CONTACT – ICONS ONLY */}
        <section
          id="contact"
          className="border-t border-emerald-800/70 pt-6 pb-8 text-[0.8rem] text-emerald-200/85 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <h4 className={`${baloo.className} text-sm md:text-base`}>
            Connect with me
          </h4>

          <div className="flex items-center gap-6">
            {/* X (Twitter) */}
            <a href="https://x.com/trex_btc" target="_blank" rel="noreferrer">
              <Image
                src="/icons/x.png"
                width={26}
                height={26}
                alt="X"
                className="opacity-80 hover:opacity-100 transition"
              />
            </a>

            {/* Telegram */}
            <a href="https://t.me/trex_btc" target="_blank" rel="noreferrer">
              <Image
                src="/icons/telegram.png"
                width={26}
                height={26}
                alt="Telegram"
                className="opacity-80 hover:opacity-100 transition"
              />
            </a>

            {/* Discord */}
            <a
              href="https://discord.com/users/1041937099496103956"
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src="/icons/discord.png"
                width={26}
                height={26}
                alt="Discord"
                className="opacity-80 hover:opacity-100 transition"
              />
            </a>

            {/* Email */}
            <a href="mailto:trex.btc.eth@gmail.com">
              <Image
                src="/icons/email.png"
                width={26}
                height={26}
                alt="Email"
                className="opacity-80 hover:opacity-100 transition"
              />
            </a>
          </div>
        </section>
      </div>

      {/* Floating Rexy chatbot bubble */}
      <RexyChatbot />
    </main>
  );
}
