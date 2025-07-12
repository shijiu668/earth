import Link from 'next/link';

export default function RefundPolicy() {
  return (
    <div className="bg-white px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Refund Policy
        </h1>
        <p className="mt-6 text-xl leading-8">
          Our Refund Policy for AI Earth Zoom Out.
        </p>
        <div className="mt-10 max-w-2xl">
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
            1. General
          </h2>
          <p className="mt-6">
            We offer a refund or credit on a case-by-case basis. We want you
            to be happy with your purchase. If you are not satisfied, please
            contact us.
          </p>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
            2. How to request a refund
          </h2>
          <p className="mt-6">
            To request a refund, please contact us within 14 days of your
            purchase. Please include your order number and a description of
            the issue.
          </p>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
            3. Processing
          </h2>
          <p className="mt-6">
            Refunds are processed within 7 business days. We will credit the
            original method of payment.
          </p>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
            4. Contact Us
          </h2>
          <p className="mt-6">
            If you have any questions about our Refund Policy, please contact
            us.
          </p>
        </div>
      </div>
    </div>
  );
}