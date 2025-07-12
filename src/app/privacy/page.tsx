import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-black">
            <Header />
            <div className="bg-gray-950 section-padding">
                <div className="container">
                    <div className="max-w-4xl mx-auto">
                        <div className="card space-y-6">
                            <h1 className="text-3xl md:text-4xl font-bold gradient-text">
                                Privacy Policy
                            </h1>
                            <p className="text-sm text-gray-400">
                                Last updated: July 11, 2025
                            </p>

                            <p className="text-gray-300 leading-relaxed">
                                This Privacy Policy describes how AI Earth Zoom Out ("we," "us," or "our") collects, uses, and discloses your information when you use our service.
                            </p>

                            <h2 className="text-2xl font-semibold text-white pt-4">1. Information We Collect</h2>
                            <p className="text-gray-300 leading-relaxed">We collect the following types of information:</p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
                                <li>
                                    <strong>Account Information:</strong> When you register, we collect your email address, name, and a unique user ID, managed by our authentication provider, Supabase.
                                </li>
                                <li>
                                    <strong>User Content:</strong> We collect the images you upload to generate videos.
                                </li>
                                <li>
                                    <strong>Payment Information:</strong> All subscription and payment information is collected and processed directly by our payment processor, Paddle. We do not store sensitive financial details like your credit card number.
                                </li>
                                <li>
                                    <strong>Usage Data:</strong> We may automatically collect information about how you access and use the service, such as your IP address and browser type.
                                </li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-white pt-4">2. How We Use Your Information</h2>
                            <p className="text-gray-300 leading-relaxed">We use your information to:</p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
                                <li>Provide, maintain, and improve our service.</li>
                                <li>Process your subscription payments through Paddle.</li>
                                <li>Communicate with you about service-related updates.</li>
                                <li>Analyze usage to understand user behavior and enhance our platform.</li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-white pt-4">3. Data Sharing and Disclosure</h2>
                            <p className="text-gray-300 leading-relaxed">We share your information only in limited circumstances:</p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
                                <li>
                                    <strong>AI Service Providers:</strong> To generate videos, we securely transmit your uploaded images to our third-party AI model providers (e.g., Replicate).
                                </li>
                                <li>
                                    <strong>Service Providers:</strong> We partner with third parties to support our business, including Supabase (database and authentication) and Paddle (payment processing).
                                </li>
                                <li>
                                    <strong>Legal Requirements:</strong> We may disclose your information if required by law or to protect our rights.
                                </li>
                            </ul>

                            <h2 className="text-2xl font-semibold text-white pt-4">4. Data Security & Retention</h2>
                            <p className="text-gray-300 leading-relaxed">
                                We use commercially reasonable security measures to protect your information. We retain your uploaded images only as long as necessary to provide the service and may delete them after a reasonable period to protect your privacy and manage storage costs.
                            </p>

                            <h2 className="text-2xl font-semibold text-white pt-4">5. Contact Us</h2>
                            <p className="text-gray-300 leading-relaxed">
                                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:contact@aiearthzoomout.org" className="text-blue-400 hover:underline">contact@aiearthzoomout.org</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}