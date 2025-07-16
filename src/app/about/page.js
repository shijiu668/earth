import Header from '../components/Header';
import Footer from '../components/Footer';
import { Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <div className="bg-gray-950 section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="card space-y-8 p-8 md:p-12">
              <div className="text-center">
                <Globe className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                  About AI Earth Zoom Out
                </h1>
                <p className="text-xl text-gray-400 mt-4">
                  Unveiling the technology that connects your photos to the cosmos.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-semibold text-white mb-4">What We Do</h2>
                <p className="text-gray-300 leading-relaxed">
                  AI Earth Zoom Out is a specialized tool designed to transform any image into a spectacular, cinematic video sequence. Starting from your uploaded photo, our AI generates a seamless zoom-out effect that travels from ground level to an awe-inspiring view of our planet from space. It's a journey from the personal to the planetary, made possible for everyone.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-semibold text-white mb-4">Our Technology</h2>
                <p className="text-gray-300 leading-relaxed">
                  Our platform is powered by advanced generative AI models. When you upload an image, the technology analyzes its content to understand the context and environment. It then intelligently constructs the intermediate frames needed for a smooth transition—from a bird's-eye view, through the atmosphere, and into orbit. We focus on creating realistic proportions and fluid camera movements to ensure every video is of professional quality.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-semibold text-white mb-4">Our Mission</h2>
                <p className="text-gray-300 leading-relaxed">
                  Our mission is to make powerful visual storytelling tools accessible and simple. We believe that complex cinematic effects shouldn't be confined to big-budget productions. By automating the earth zoom-out effect, we empower creators, marketers, educators, and anyone with a story to tell to add a touch of cosmic perspective to their vision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}