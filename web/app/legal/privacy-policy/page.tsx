import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata = pageMetadata("/legal/privacy-policy/", {
  title: "Privacy Policy",
  description:
    "In2IT EBS's full privacy statement: how we collect, process, share, retain and protect personal data, and your rights across jurisdictions.",
});

const toc = [
  { href: "#general-information", label: "General information" },
  { href: "#statutory-permission", label: "Processing based on a statutory permission" },
  { href: "#consent", label: "Processing based on consent" },
  { href: "#embedded-content", label: "Embedded content from other websites" },
  { href: "#cookies", label: "Cookies and similar tools" },
  { href: "#country-specific", label: "Additional country-specific provisions" },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/legal/privacy-policy/" />
      <PageHero
        route="/legal/privacy-policy/"
        eyebrow="Legal"
        headline="Privacy"
        accentWord="Policy"
        subhead="In2IT EBS has created this privacy statement to demonstrate our commitment to data protection and privacy rights. It outlines how we handle information that can be used to directly or indirectly identify an individual (Personal Data)."
        cta={false}
      />

      <Section tone="white">
        <Container>
          <Reveal className="mb-12 max-w-measure">
            <p className="label-caps text-gold">On this page</p>
            <ul className="mt-4 space-y-2">
              {toc.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-base font-medium text-foreground underline-offset-4 transition-colors hover:text-action hover:underline"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <div className="prose prose-neutral max-w-measure">
              <p>
                Protecting individual privacy on the internet is crucial to the future of internet-based business and
                the move toward a true internet economy. This privacy statement demonstrates In2IT EBS&rsquo;s
                commitment to data protection and privacy rights, and outlines how the organisation handles Personal
                Data.
              </p>

              <h2 id="general-information">General information</h2>

              <h3>Who is the data controller?</h3>
              <p>
                The data controller of www.in2itebs.com is In2IT EBS. Where a registration form is presented on this
                website, the data controller may vary depending on the actual offering or the purpose of data
                collection; this is displayed on the individual registration form&rsquo;s privacy statement.
              </p>

              <h3>What Personal Data does In2IT EBS collect?</h3>
              <p>
                When you visit In2IT EBS&rsquo;s websites, the organisation stores certain information about your
                browser, operating system and IP address. If you use a registration form, the website collects
                information you provide, which consists of:
              </p>
              <ul>
                <li>First and last name</li>
                <li>Email addresses</li>
                <li>Telephone numbers</li>
                <li>Location (country, state/province, city)</li>
                <li>Company name</li>
                <li>Job title and role</li>
                <li>Department and function</li>
                <li>Current relationship to In2IT EBS</li>
                <li>Company&rsquo;s industry</li>
              </ul>

              <h3>Why does In2IT EBS need your Personal Data?</h3>
              <p>In2IT EBS requires your Personal Data to:</p>
              <ul>
                <li>Provide you with access to the site</li>
                <li>Deliver any ordered goods or services</li>
                <li>Comply with statutory obligations, including checks required by applicable export laws</li>
              </ul>
              <p>
                Providing Personal Data is voluntary, though In2IT EBS may not be able to perform or satisfy your
                request without it. You can order goods or services without consenting to In2IT EBS&rsquo;s further
                marketing operations.
              </p>

              <h3>From what types of third parties does In2IT EBS obtain Personal Data?</h3>
              <p>
                In most cases, In2IT EBS collects Personal Data directly from you. The organisation might also obtain
                Personal Data from third parties where applicable national law allows. These third-party sources
                include:
              </p>
              <ul>
                <li>In2IT EBS and/or the In2IT EBS Group&rsquo;s business dealings with your employer</li>
                <li>Third parties you directed to share your Personal Data with In2IT EBS</li>
              </ul>

              <h3>How long will In2IT EBS store my Personal Data?</h3>
              <p>In2IT EBS will only store your Personal Data for as long as it is required to:</p>
              <ul>
                <li>Make requested goods and services available to you, including use of in2itebs.com</li>
                <li>Comply with statutory obligations resulting from applicable export laws</li>
                <li>
                  Until you object to such use, where In2IT EBS&rsquo;s use of your Personal Data is based on its
                  legitimate business interest
                </li>
                <li>Until you revoke the consent granted in this privacy statement</li>
                <li>
                  Where your Personal Data is required for In2IT EBS to assert or defend against legal claims, until the
                  end of the relevant retention period or until the claims in question have been settled
                </li>
              </ul>

              <h3>Who are the recipients of your Personal Data and where will it be processed?</h3>
              <p>
                Your Personal Data will be passed on to third-party service providers for the provision of the website,
                newsletter dispatch, consulting services and other related services.
              </p>
              <p>
                As a global group of companies operating internationally, In2IT EBS has affiliates and third-party
                service providers outside of the European Economic Area (the &ldquo;EEA&rdquo;) and will transfer your
                Personal Data to countries outside of the EEA. Where these transfers are to a country for which the EU
                Commission has not issued an adequacy decision, In2IT EBS uses EU standard contractual clauses to
                contractually require that your Personal Data receives a level of data protection consistent with the
                EEA.
              </p>

              <h3>What are your data protection rights?</h3>
              <p>You can request from In2IT EBS:</p>
              <ul>
                <li>Access at any time to information about which Personal Data In2IT EBS processes about you</li>
                <li>Correction or deletion of such Personal Data</li>
              </ul>
              <p>
                However, In2IT EBS can or will delete your Personal Data only if there is no statutory obligation or
                prevailing right of In2IT EBS to retain it. If you request that In2IT EBS deletes your Personal Data,
                you will not be able to continue to use any In2IT EBS service that requires the organisation&rsquo;s use
                of your Personal Data.
              </p>
              <p>
                If In2IT EBS uses your Personal Data based on your consent or to perform a contract with you, you can
                further request a copy of the Personal Data you provided. To do so, please contact the email address
                provided and specify the information or processing activities to which your request relates, the format
                in which you would like to receive this information, and whether the Personal Data should be sent to you
                or another recipient.
              </p>
              <p>You can request that In2IT EBS restricts your Personal Data from any further processing where:</p>
              <ul>
                <li>You state that the Personal Data In2IT EBS has about you is incorrect</li>
                <li>There is no legal basis for In2IT EBS processing your Personal Data and you demand restriction</li>
                <li>
                  In2IT EBS no longer requires your Personal Data but you require its retention to claim or exercise
                  legal rights or defend against third-party claims
                </li>
                <li>
                  You object to the processing of your Personal Data by In2IT EBS based on its legitimate interest
                </li>
              </ul>

              <h4>For individuals within India</h4>
              <p>You have the right to:</p>
              <ul>
                <li>
                  Request access to the Personal Data In2IT EBS collects, uses, discloses or sells (if applicable) about
                  you
                </li>
                <li>Request that In2IT EBS delete Personal Data about you</li>
                <li>Receive non-discriminatory treatment for the exercise of any data protection rights</li>
                <li>
                  Request that information be portable in a readily usable format that allows you to transmit it to
                  another recipient without hindrance
                </li>
                <li>Opt out of the sale of Personal Data</li>
              </ul>
              <p>
                In accordance with disclosure requirements, In2IT EBS is exempt from providing a notice to opt out
                because it does not and will not sell your Personal Data.
              </p>

              <h3>How can you exercise your data protection rights?</h3>
              <p>
                Please direct any requests to exercise your rights to{" "}
                <a href="mailto:info@in2itebs.com">info@in2itebs.com</a>. For individuals within India, you can also
                designate an authorised agent to submit requests to exercise your data protection rights to In2IT EBS.
              </p>

              <h3>How will In2IT EBS verify requests to exercise data protection rights?</h3>
              <p>
                In2IT EBS will take steps to verify your identity to a reasonable degree of certainty before processing
                the data protection right you want to exercise. Where feasible, In2IT EBS will match Personal Data you
                provide when submitting a request with information already maintained by the organisation.
              </p>
              <p>
                A more stringent verification process applies for deletion requests or for Personal Data considered
                sensitive or valuable. If In2IT EBS must request additional information from you, it will only use that
                information to verify your identity so you can exercise your rights, or for security and
                fraud-prevention purposes. In2IT EBS will decline to process requests that are manifestly unfounded,
                excessive, fraudulent, or are not otherwise required by local law.
              </p>

              <h3>Right to lodge a complaint</h3>
              <p>
                If you take the view that In2IT EBS is not processing your Personal Data in accordance with this privacy
                statement or under applicable EEA data protection laws, you can at any time lodge a complaint with the
                data protection authority of the EEA country where you live, or with the data protection authority of
                the country or state where In2IT EBS has its registered seat.
              </p>

              <h3>Can I use In2IT EBS&rsquo;s goods and services if I am a minor or child?</h3>
              <p>
                In2IT EBS websites and online services are not directed to users below the age of 16 years, or the
                equivalent minimum age in the relevant jurisdiction. If you are younger than 16, you cannot register
                with and use these websites or online services.
              </p>
              <p>
                In2IT EBS does not knowingly collect the Personal Data of children under the age of 13. If you are a
                parent or guardian and believe In2IT EBS collected information about a child, please contact us as
                described in this privacy statement and In2IT EBS will take steps to delete the information as soon as
                possible. In2IT EBS does not sell the Personal Data of any minors under 16 years of age.
              </p>

              <h2 id="statutory-permission">Processing based on a statutory permission</h2>

              <h3>Processing to fulfil contractual obligations</h3>
              <p>In2IT EBS requires your Personal Data to:</p>
              <ul>
                <li>Deliver goods or services you order under a contract In2IT EBS has with you</li>
                <li>Establish a contract for goods or services between you and In2IT EBS</li>
                <li>Send you invoices for ordered goods or services</li>
              </ul>
              <p>
                In2IT EBS processes Personal Data to fulfil contractual obligations pursuant to Article 6(1) lit. b
                GDPR, or under the equivalent article under other national laws where applicable. This includes
                responding to your inquiries, processing your feedback, providing support, and handling conversation
                data you may initiate or enable through chat functionalities, contact forms, emails or by telephone.
              </p>
              <p>
                In this privacy statement, &ldquo;goods and services&rdquo; includes access to In2IT EBS&rsquo;s web
                services, offerings, contests, sweepstakes, other content, non-marketing newsletters, whitepapers,
                tutorials, trainings and events. In2IT EBS will use your email address to confirm your opening of an
                account, send you notice of payments, send you information about changes to its products and services,
                and send notices and other disclosures as required by law. Generally, users cannot opt out of these
                communications because they are required for the relevant business relationship and are not
                marketing-related in nature.
              </p>
              <p>
                For marketing-related communications such as emails and phone calls, In2IT EBS will only provide such
                information after you have opted in (where legally required), and will provide you the opportunity to
                opt out of further marketing communications at any time by updating that preference.
              </p>

              <h3>Processing to ensure compliance</h3>
              <p>
                In2IT EBS and its products, technologies and services are subject to the export laws of various
                countries, including those of the European Union and its member states, and of the United States of
                America. Pursuant to applicable export laws, trade sanctions and embargoes, In2IT EBS is required to
                take measures to prevent entities, organisations and parties listed on government-issued
                sanctioned-party lists from accessing certain products, technologies and services. This could include
                automated checks of user registration data against applicable sanctioned-party lists, regular repetition
                of such checks, blocking of access in case of a potential match, and contacting a user to confirm their
                identity.
              </p>
              <p>
                Any such use of your Personal Data is based on the permission to process Personal Data in order to
                comply with statutory obligations (Article 6(1) lit. c GDPR) and In2IT EBS&rsquo;s legitimate interest
                (Article 6(1) lit. f GDPR), or under the equivalent articles under other national laws where applicable.
              </p>

              <h3>Processing based on In2IT EBS&rsquo;s legitimate interest</h3>
              <p>
                In2IT EBS can use your Personal Data based on its legitimate interest (Article 6(1) lit. f GDPR), or the
                equivalent article under other national laws where applicable, for purposes including: preventing or
                prosecuting fraud and asserting or defending against legal claims; questionnaires and surveys to improve
                its products and services; contract performance where you are a customer contact; the creation of
                anonymised data sets; delivering personalised content where you have opted in to marketing
                communications; recording telephone calls or chat sessions for quality improvement (after informing
                you); and keeping you up to date or requesting feedback within an existing business relationship.
              </p>
              <p>
                You can object to In2IT EBS&rsquo;s use of your Personal Data as set out in this section at any time by
                updating that preference. In2IT EBS will carefully review your objection and cease further use of the
                relevant information unless it has a compelling legitimate ground for continued use that overrides your
                objection, or unless it requires the information for the establishment, exercise or defence of legal
                claims.
              </p>

              <h2 id="consent">Processing based on consent</h2>
              <p>
                In the following cases, In2IT EBS will process your Personal Data where you have granted prior consent
                to the specific proposed processing (Article 6(1) lit. a GDPR), or the equivalent article under other
                national laws where applicable: to keep you up to date on news about its products and services; to
                create user profiles within its web offerings; to process special categories of Personal Data such as
                health information for events and seminars; for event profiling; to forward your Personal Data to other
                entities in the In2IT EBS Group for the same purposes and under the same conditions; and to forward your
                registration data to other third parties at your request.
              </p>
              <p>
                You may at any time withdraw a consent granted here by unsubscribing. In case of withdrawal, In2IT EBS
                will not process Personal Data subject to that consent any longer unless legally required to do so. Any
                withdrawal has no effect on past processing of Personal Data up to the point in time of your withdrawal.
                If your use of an In2IT EBS offering requires your prior consent, In2IT EBS will no longer be able to
                provide the relevant service, offer or event after your revocation.
              </p>

              <h2 id="embedded-content">Embedded content from other websites</h2>
              <p>
                Articles on this site may include embedded content (for example, videos, images and articles). Embedded
                content from other websites behaves in exactly the same way as if the visitor has visited the other
                website. These websites may collect data about you, use cookies, embed additional third-party tracking
                and monitor your interaction with that embedded content, including tracking your interaction if you have
                an account and are logged in to that website.
              </p>

              <h2 id="cookies">Cookies and similar tools</h2>
              <p>We use the following categories of cookies:</p>
              <ul>
                <li>
                  <strong>Required cookies</strong> &mdash; required to enable core site functionality.
                </li>
                <li>
                  <strong>Functional cookies</strong> &mdash; allow us to analyse site usage so we can measure and
                  improve performance.
                </li>
                <li>
                  <strong>Advertising cookies</strong> &mdash; used by advertising companies to serve ads that are
                  relevant to your interests.
                </li>
              </ul>

              <h2 id="country-specific">Additional country-specific provisions</h2>
              <p>
                Your browser may allow you to set a &ldquo;Do not track&rdquo; preference. Unless otherwise stated, our
                sites do not honour &ldquo;Do not track&rdquo; requests. However, you may elect not to accept cookies by
                changing the designated settings on your web browser. Cookies are small text files placed on your
                computer while visiting certain sites on the internet and used to identify your computer. If you do not
                accept cookies, you may not be able to use certain functions and features of our site. This site does
                not allow third parties to gather information about you over time and across sites.
              </p>

              <p>
                For questions about this privacy policy or your personal data, please contact us at{" "}
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
