import Link from 'next/link';

export default function PrivacyPolicy() {
    return (
        <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Privacy Policy
                </h1>
                <p className="mt-6 text-xl leading-8">
                    Last updated: July 11, 2025
                </p>
                <p className="mt-8">
                    This Privacy Policy describes how AI Earth Zoom Out ("we," "us," or "our") collects, uses, and discloses your information when you use our service.
                </p>

                <div className="mt-10 max-w-2xl">
                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">1. Information We Collect</h2>
                    <p className="mt-6">We collect the following types of information:</p>
                    <ul className="mt-4 list-disc pl-5 space-y-2">
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

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">2. How We Use Your Information</h2>
                    <p className="mt-6">We use your information to:</p>
                    <ul className="mt-4 list-disc pl-5 space-y-2">
                        <li>Provide, maintain, and improve our service.</li>
                        <li>Process your subscription payments through Paddle.</li>
                        <li>Communicate with you about service-related updates.</li>
                        <li>Analyze usage to understand user behavior and enhance our platform.</li>
                    </ul>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">3. Data Sharing and Disclosure</h2>
                    <p className="mt-6">We share your information only in limited circumstances:</p>
                    <ul className="mt-4 list-disc pl-5 space-y-2">
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

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">4. Data Security & Retention</h2>
                    <p className="mt-6">
                        We use commercially reasonable security measures to protect your information. We retain your uploaded images only as long as necessary to provide the service and may delete them after a reasonable period to protect your privacy and manage storage costs.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">5. Contact Us</h2>
                    <p className="mt-6">
                        If you have any questions about this Privacy Policy, please contact us at contact@aiearthzoomout.org.
                    </p>
                </div>
            </div>
        </div>
    );
}