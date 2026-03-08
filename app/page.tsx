import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/shared/Hero";
import { Footer } from "@/components/layout/Footer";
import { VisualizerPanel } from "@/features/visualizer/components/VisualizerPanel";
import { ComplexityOverview } from "@/features/algorithms/components/ComplexityOverview";
import { ComparisonGrid } from "@/features/comparison/components/ComparisonGrid";
import { PerformanceChart } from "@/features/stats/components/PerformanceChart";
import { EducationalGuide } from "@/features/education/components/EducationalGuide";
import { FAQ } from "@/features/education/components/FAQ";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-24">
        <VisualizerPanel />
        <ComplexityOverview />
        <ComparisonGrid />
        <PerformanceChart />
        <EducationalGuide />
        <FAQ />
      </div>
      <Footer />
    </main>
  );
}
