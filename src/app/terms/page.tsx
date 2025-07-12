import Link from 'next/link';

export default function TermsOfService() {
    return (
        <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Terms of Service
                </h1>
                <p className="mt-6 text-xl leading-8">
                    Last updated: July 11, 2025
                </p>

                <div className="mt-10 max-w-2xl">
                    <p>
                        Welcome to AI Earth Zoom Out! These Terms of Service ("Terms") form a legally binding agreement between you and AI Earth Zoom Out ("we," "us," "our"). By accessing or using our service, you agree to be bound by these Terms.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">1. Service Description</h2>
                    <p className="mt-6">
                        AI Earth Zoom Out provides a service that utilizes artificial intelligence to transform images uploaded by users into "earth zoom out" effect videos.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">2. User Accounts</h2>
                    <p className="mt-6">
                        To access the full features of our service, you must register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">3. Credits and Subscriptions</h2>
                    <p className="mt-6">
                        Our service operates on a credit system. Generating a video consumes a specific amount of credits. Credits are obtained by purchasing a subscription plan. All payments are processed through our third-party payment partner, Paddle. Credits have no cash value, are non-transferable, and non-refundable.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">4. User Content</h2>
                    <p className="mt-6">
                        You retain all ownership rights to the images you upload ("User Content"). You grant us a worldwide, non-exclusive, royalty-free license to use, process, and modify your User Content solely for the purpose of providing the service to you, including submitting it to our AI model providers (e.g., Replicate) to generate videos. You warrant that you own or have the necessary rights to your User Content.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">5. Prohibited Conduct</h2>
                    <p className="mt-6">
                        You agree not to use the service to upload illegal, harmful, or infringing content, reverse-engineer our service, or interfere with its operation.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">6. Intellectual Property</h2>
                    <p className="mt-6">
                        Excluding your User Content, the service and all related materials, including the AI Earth Zoom Out name and logo, are the exclusive property of us or our licensors.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">7. Disclaimer of Warranties</h2>
                    <p className="mt-6">
                        The service is provided "as is" and "as available" without warranties of any kind. We do not guarantee that the service will be uninterrupted or error-free.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">8. Limitation of Liability</h2>
                    <p className="mt-6">
                        To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising out of your use of the service.
                    </p>

                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">9. Contact Us</h2>
                    <p className="mt-6">
                        If you have any questions about these Terms, please contact us at contact@aiearthzoomout.org.
                    </p>
                </div>
            </div>
        </div>
    );
}