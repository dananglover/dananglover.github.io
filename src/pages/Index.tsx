
import { FeaturedPlaces } from '@/components/home/FeaturedPlaces';
import { Hero } from '@/components/home/Hero';
import { RecentBlogs } from '@/components/home/RecentBlogs';
import { Navigation } from '@/components/layout/Navigation';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50">
      <Navigation />
      <Hero />
      <div className="container mx-auto px-4 py-12 space-y-16">
        <FeaturedPlaces />
        <RecentBlogs />
      </div>
    </div>
  );
};

export default Index;
