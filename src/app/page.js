import Header from './components/Header';
import VideoGenerator from './components/VideoGenerator';
import VideoShowcase from './components/VideoShowcase';
import SEOSection from './components/SEOSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text animate-fade-in">
            Earth Zoom Out
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 animate-slide-up">
            Transform any image into a breathtaking earth zoom out video with AI.
            Watch your photos become epic cinematic sequences that reveal the beauty of our planet from space.
          </p>
        </div>
      </section>

      {/* Video Generation Section */}
      <VideoGenerator />

      {/* Video Showcase Section */}
      <VideoShowcase />

      {/* SEO Content Section */}
      <SEOSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}