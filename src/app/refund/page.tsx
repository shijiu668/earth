import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RefundPolicy() {
    return (
        <main className="min-h-screen bg-black">
            <Header />
            <div className="bg-gray-950 section-padding">
                <div className="container">
                    <div className="max-w-4xl mx-auto">
                        <div className="card space-y-6">
                            <h1 className="text-3xl md:text-4xl font-bold gradient-text">
                                Refund Policy
                            </h1>
                            <p className="text-sm text-gray-400">
                                Last updated: July 11, 2025
                            </p>

                            <h2 className="text-2xl font-semibold text-white pt-4">1. General Policy</h2>
                            <p className="text-gray-300 leading-relaxed">
                                Due to the high and immediate computational costs associated with AI video generation, <strong>we do not offer refunds for subscription fees or credit purchases.</strong>
                            </p>

                            <h2 className="text-2xl font-semibold text-white pt-4">2. Why No Refunds?</h2>
                            <p className="text-gray-300 leading-relaxed">
                                When you purchase a subscription and receive credits, those credits represent computational resources available to you. Once you use credits to generate a video, we incur irreversible costs from our AI service providers (e.g., Replicate). Because these costs cannot be recovered, we cannot refund the payments made.
                            </p>

                            <h2 className="text-2xl font-semibold text-white pt-4">3. Subscription Cancellation</h2>
                            <p className="text-gray-300 leading-relaxed">
                                You can cancel your subscription at any time. Your cancellation will take effect at the end of the current billing cycle. You will not be charged again, and you can continue to use your remaining credits until your subscription expires.
                            </p>

                            <h2 className="text-2xl font-semibold text-white pt-4">4. Exceptions</h2>
                            <p className="text-gray-300 leading-relaxed">
                                Refunds will only be considered in rare cases of technical failure where:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
                                <li>
                                    Credits were deducted from your account due to a platform error, but no video was produced.
                                </li>
                                <li>
                                    You were billed multiple times for the same subscription period due to a system error.
                                </li>
                            </ul>
                            <p className="text-gray-300 leading-relaxed mt-4">
                                If you believe you are eligible for a refund under these exceptions, please contact our support team at <a href="mailto:contact@aiearthzoomout.org" className="text-blue-400 hover:underline">contact@aiearthzoomout.org</a> within 7 days of the issue occurring.
                            </p>

                            <h2 className="text-2xl font-semibold text-white pt-4">5. Contact Us</h2>
                            <p className="text-gray-300 leading-relaxed">
                                If you have any questions about our Refund Policy, please do not hesitate to contact us.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}