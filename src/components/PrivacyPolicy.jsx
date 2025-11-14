import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">
        <strong>Last updated:</strong> [DATE]
      </p>

      <div className="space-y-10 leading-relaxed">
        <section>
          <p>
            This Privacy Policy describes Our policies and procedures on the
            collection, use and disclosure of Your information when You use the
            Service and tells You about Your privacy rights and how the law
            protects You.
          </p>
          <p>
            We use Your Personal data to provide and improve the Service. By
            using the Service, You agree to the collection and use of
            information in accordance with this Privacy Policy.
          </p>
        </section>

        {/* Interpretation and Definitions */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Interpretation and Definitions
          </h2>

          <h3 className="text-xl font-semibold mt-4 mb-2">Interpretation</h3>
          <p>
            The words of which the initial letter is capitalized have meanings
            defined under the following conditions…
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">Definitions</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>
              <strong>Account:</strong> A unique account created to access parts
              of our Service.
            </li>
            <li>
              <strong>Company:</strong> Refers to [COMPANY INFORMATION].
            </li>
            <li>
              <strong>Country:</strong> Refers to [COMPANY_COUNTRY].
            </li>
            <li>
              <strong>Cookies:</strong> Small files placed on your device.
            </li>
            <li>
              <strong>Device:</strong> Any device that can access the Service.
            </li>
            <li>
              <strong>Personal Data:</strong> Information that identifies an
              individual.
            </li>
            <li>
              <strong>Service:</strong> Refers to the Website.
            </li>
            <li>
              <strong>Service Provider:</strong> Third-party processors acting
              on our behalf.
            </li>
            <li>
              <strong>Usage Data:</strong> Data collected automatically.
            </li>
            <li>
              <strong>Website:</strong> Refers to [WEBSITE_NAME], accessible
              from [WEBSITE_URL].
            </li>
            <li>
              <strong>You:</strong> The individual using the Service.
            </li>
          </ul>
        </section>

        {/* Personal Data */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Collecting and Using Your Personal Data
          </h2>

          <h3 className="text-xl font-semibold mt-4 mb-2">Personal Data</h3>
          <p>We may collect the following information:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Email address</li>
            <li>First and last name</li>
            <li>Phone number</li>
            <li>Address</li>
            <li>Usage Data</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2">Usage Data</h3>
          <p>
            Usage Data is collected automatically and may include IP address,
            browser type, visited pages, time spent, and other diagnostic
            details.
          </p>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Tracking Technologies and Cookies
          </h2>
          <p>
            We use Cookies and similar technologies to track activity and store
            information.
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">Types of Cookies</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>Essential Cookies</li>
            <li>Acceptance Cookies</li>
            <li>Functionality Cookies</li>
            <li>Tracking & Performance Cookies</li>
          </ul>
        </section>

        {/* Data Usage */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Use of Your Personal Data
          </h2>
          <p>The Company may use Personal Data for purposes such as:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Providing and maintaining the Service</li>
            <li>Managing user accounts</li>
            <li>Contract performance</li>
            <li>Communication</li>
            <li>Marketing & updates</li>
            <li>Business transfers</li>
            <li>Analytics & improvements</li>
          </ul>
        </section>

        {/* Retention */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">Retention of Data</h2>
          <p>
            We retain Personal Data only as long as necessary for the purposes
            described in this policy.
          </p>
        </section>

        {/* Transfers */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">Transfer of Your Data</h2>
          <p>
            Your data may be processed in other countries. We ensure appropriate
            security and compliance.
          </p>
        </section>

        {/* Disclosure */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Disclosure of Your Data
          </h2>
          <p>Your information may be disclosed for:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Business transactions</li>
            <li>Law enforcement</li>
            <li>Legal compliance</li>
          </ul>
        </section>

        {/* Security */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">Security of Your Data</h2>
          <p>
            No method of transmission over the Internet is 100% secure, but we
            use reasonable safeguards.
          </p>
        </section>

        {/* Payments */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">Payments</h2>
          <p>
            We use third-party payment processors and do not store card
            information. These providers follow PCI-DSS standards.
          </p>
        </section>

        {/* Children */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">Children’s Privacy</h2>
          <p>We do not knowingly collect data from children under 13.</p>
        </section>

        {/* External Links */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Links to Other Websites
          </h2>
          <p>
            We are not responsible for the privacy practices of third-party
            websites.
          </p>
        </section>

        {/* Changes */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy. Changes will be posted on this
            page with a revised date.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
          <p>If you have questions:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Contact page: [WEBSITE_CONTACT_PAGE_URL]</li>
            <li>Email: [WEBSITE_CONTACT_EMAIL]</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
