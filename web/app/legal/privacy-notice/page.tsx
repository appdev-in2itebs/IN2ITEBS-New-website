import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata = pageMetadata("/legal/privacy-notice/", {
  title: "Privacy Notice",
  description: "How In2IT EBS collects, uses, shares and protects your personal data, and the rights available to you.",
});

export default function PrivacyNoticePage() {
  return (
    <>
      <BreadcrumbJsonLd path="/legal/privacy-notice/" />
      <PageHero
        route="/legal/privacy-notice/"
        eyebrow="Legal"
        headline="Privacy"
        accentWord="Notice"
        subhead="At In2IT EBS we respect your privacy and are committed to protecting your personal data. This notice explains how we collect, use and share your personal information."
        cta={false}
      />

      <Section tone="white">
        <Container>
          <Reveal>
            <div className="prose prose-neutral max-w-measure">
              <h2>1. Information we collect</h2>
              <p>We collect the following types of personal data:</p>
              <ul>
                <li>Personal information (for example, name and email address)</li>
                <li>Financial information (for example, payment details)</li>
                <li>Technical data (for example, IP address and browser type)</li>
              </ul>

              <h2>2. Purpose of data processing</h2>
              <p>We use your data for the following purposes:</p>
              <ul>
                <li>To provide our services</li>
                <li>To communicate with you</li>
                <li>For marketing purposes, with your consent</li>
                <li>To comply with legal obligations</li>
              </ul>

              <h2>3. Data sharing</h2>
              <p>We may share your personal data with:</p>
              <ul>
                <li>Service providers</li>
                <li>Business partners</li>
                <li>Regulatory authorities, where required</li>
              </ul>

              <h2>4. Your rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal data</li>
                <li>Request corrections</li>
                <li>Request deletion of your data</li>
                <li>Restrict processing</li>
                <li>Withdraw consent</li>
              </ul>

              <h2>5. Cookies</h2>
              <p>
                We use cookies to enhance your experience. You can manage your cookie preferences through your browser
                settings.
              </p>

              <h2>6. Security measures</h2>
              <p>
                We implement security measures to protect your personal data, including encryption and access controls.
              </p>

              <h2>7. Changes to this notice</h2>
              <p>We may update this privacy notice and will notify you of any changes via our website.</p>

              <h2>8. Contact us</h2>
              <p>
                For questions about this privacy notice or your personal data, please contact us at{" "}
                <a href="mailto:info@in2itebs.com">info@in2itebs.com</a>.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
