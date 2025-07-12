import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="bg-white px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-6 text-xl leading-8">
          This Privacy Policy describes Our policies and procedures on the
          collection, use and disclosure of Your information when You use the
          Service and tells You about Your privacy rights and how the law
          protects You.
        </p>
        <div className="mt-10 max-w-2xl">
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
            1. Information Collection and Use
          </h2>
          <p className="mt-6">
            We collect several different types of information for various
            purposes to provide and improve our Service to you.
          </p>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
            2. Types of Data Collected
          </h2>
          <p className="mt-8 font-bold">Personal Data</p>
          <p className="mt-6">
            While using our Service, we may ask you to provide us with certain
            personally identifiable information that can be used to contact or
            identify you ("Personal Data"). Personally identifiable information
            may include, but is not limited to:
          </p>
          <ul className="list-disc pl-5 mt-4">
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Cookies and Usage Data</li>
          </ul>
          <p className="mt-8 font-bold">Usage Data</p>
          <p className="mt-6">
            We may also collect information how the Service is accessed and
            used ("Usage Data"). This Usage Data may include information such
            as your computer's Internet Protocol address (e.g. IP address),
            browser type, browser version, the pages of our Service that you
            visit, the time and date of your visit, the time spent on those
            pages, unique device identifiers and other diagnostic data.
          </p>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
            3. Use of Data
          </h2>
          <p className="mt-6">
            AI Earth Zoom Out uses the collected data for various purposes:
          </p>
          <ul className="list-disc pl-5 mt-4">
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>
              To allow you to participate in interactive features of our
              Service when you choose to do so
            </li>
            <li>To provide customer support</li>
            <li>
              To gather analysis or valuable information so that we can improve
              our Service
            </li>
            <li>To monitor the usage of our Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
            4. Security of Data
          </h2>
          <p className="mt-6">
            The security of your data is important to us, but remember that no
            method of transmission over the Internet, or method of electronic
            storage is 100% secure. While we strive to use commercially
            acceptable means to protect your Personal Data, we cannot
            guarantee its absolute security.
          </p>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
            5. Changes to This Privacy Policy
          </h2>
          <p className="mt-6">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
          </p>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
            6. Contact Us
          </h2>
          <p className="mt-6">
            If you have any questions about this Privacy Policy, please
            contact us.
          </p>
        </div>
      </div>
    </div>
  );
}