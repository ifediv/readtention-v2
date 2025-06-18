import TopHeader from '@/components/TopHeader';
import HeroSection from '@/components/HeroSection';
import FeaturedStats from '@/components/FeaturedStats';
import MindMapCards from '@/components/MindMapCards';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';

export default function Home() {
  return (
    <>
      <TopHeader />
      <HeroSection />
      <FeaturedStats />
      <MindMapCards />
      <HowItWorks />
      <Testimonials />
    </>
  );
}
