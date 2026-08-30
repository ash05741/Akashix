import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import WorkspacePreview from './WorkspacePreview';
import CommunityStats from './CommunityStats';
import Testimonials from './Testimonials';
import CTABanner from './CTABanner';
import Footer from './Footer';

export default function Home() {
    return (
        // TODO: ADD ANIMATED BACKGROUND LIKE THE HOME PAGE IN THE IMAGE
        <div className="min-h-screen">
            <Navbar />
            <Hero />
            <Features />
            <WorkspacePreview />
            <CommunityStats />
            <Testimonials />
            <CTABanner />
            <Footer />
        </div>
    );
}