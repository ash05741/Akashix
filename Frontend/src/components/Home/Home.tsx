import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import WorkspacePreview from './WorkspacePreview';
import CommunityStats from './CommunityStats';
//import Testimonials from './Testimonials';
//import CTABanner from './Homepage/CTABanner';
//import Footer from './Homepage/Footer';

export default function Home() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <Hero />
            <Features />
            <WorkspacePreview />
            <CommunityStats />
            {/*<Testimonials />
            <CTABanner />
            <Footer />*/}
        </div>
    );
}