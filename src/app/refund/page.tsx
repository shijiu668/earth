import Link from 'next/link';

export default function RefundPolicy() {
    return (
        <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Refund Policy
                </h1>
                <p className="mt-6 text-xl leading-8">
                    Last updated: July 11, 2025
                </p>

                <div className="mt-10 max-w-2xl">
                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">1. General Policy</h2>
                    <p className="mt-6">
                        Due to the high and immediate computational costs associated with AI video generation, **we do not offer refunds for subscription fees or credit purchases.**
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">2. Why No Refunds?</h2>
                    <p className="mt-6">
                        When you purchase a subscription and receive credits, those credits represent computational resources available to you. Once you use credits to generate a video, we incur irreversible costs from our AI service providers (e.g., Replicate). Because these costs cannot be recovered, we cannot refund the payments made.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">3. Subscription Cancellation</h2>
                    <p className="mt-6">
                        You can cancel your subscription at any time. Your cancellation will take effect at the end of the current billing cycle. You will not be charged again, and you can continue to use your remaining credits until your subscription expires.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">4. Exceptions</h2>
                    <p className="mt-6">
                        Refunds will only be considered in rare cases of technical failure where:
                    </p>
                    <ul className="mt-4 list-disc pl-5 space-y-2">
                        <li>
                            Credits were deducted from your account due to a platform error, but no video was produced.
                        </li>
                        <li>
                            You were billed multiple times for the same subscription period due to a system error.
                        </li>
                    </ul>
                    <p className="mt-8">
                        If you believe you are eligible for a refund under these exceptions, please contact our support team at contact@aiearthzoomout.org within 7 days of the issue occurring.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">5. Contact Us</h2>
                    <p className="mt-6">
                        If you have any questions about our Refund Policy, please do not hesitate to contact us.
                    </p>
                </div>
            </div>
        </div>
    );
}