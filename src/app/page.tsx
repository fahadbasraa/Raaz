import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { CollectionGrid } from "@/components/collection-grid";
import { AtelierStory } from "@/components/atelier-story";
import { Newsletter } from "@/components/newsletter";
import { Footer } from "@/components/footer";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <CollectionGrid />
        <AtelierStory />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
