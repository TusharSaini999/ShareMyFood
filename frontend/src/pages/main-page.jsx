import { HeroSection } from "../components/hero-section"
import { FeaturesSection } from "../components/features-section"
import { TestimonialsSection } from "../components/testimonials-section"
import { CTASection } from "../components/cta-section"
import React from "react"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  )
}