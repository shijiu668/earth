import { Globe, Mail, Twitter, Github, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container section-padding">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Globe className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold gradient-text">
                AI Earth Zoom Out
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Create stunning earth zoom out videos with artificial intelligence. 
              Transform any image into a breathtaking cinematic sequence that reveals 
              the beauty of our planet from space.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-6 w-6" />
              </a>
              <a href="mailto:contact@aiearthzoomout.com" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#generator" className="text-gray-400 hover:text-white transition-colors">
                  Video Generator
                </a>
              </li>
              <li>
                <a href="#showcase" className="text-gray-400 hover:text-white transition-colors">
                  Video Showcase
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                  About Earth Zoom Out
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Help Center3
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
            © 2025 AI Earth Zoom Out. All rights reserved. Create stunning earth zoom out videos with AI.
          </p>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span>Powered by Advanced AI</span>
            <span>•</span>
            <span>Professional Quality</span>
            <span>•</span>
            <span>Instant Generation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}