import { HeroSection } from '@/components/sections/HeroSection'
import { ComoFuncionaSection } from '@/components/sections/ComoFuncionaSection'
import { VantagensSection } from '@/components/sections/VantagensSection'
import { Footer } from '@/components/sections/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ComoFuncionaSection />
      <VantagensSection />
      <Footer />
    </main>
  )
}
