import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata = pageMetadata("/legal/disclaimer/", {
  title: "Disclaimer",
  description:
    "The terms governing use of the In2IT EBS website, including copyright, trademarks, warranties, liability and governing law.",
});

export default function DisclaimerPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/legal/disclaimer/" />
      <PageHero
        route="/legal/disclaimer/"
        eyebrow="Legal"
        headline="Website"
        accentWord="Disclaimer"
        subhead="In2IT EBS makes information and materials available on www.in2itebs.com subject to the terms of use and this disclaimer. By accessing this website, you agree to these terms and conditions."
        cta={false}
      />

      <Section tone="white">
        <Container>
          <Reveal>
            <div className="prose prose-neutral max-w-measure">
              <p>
                This disclaimer governs the use of our website. By accessing this website, you agree to the terms and
                conditions outlined in the terms of use and this disclaimer. If you disagree, please do not access this
                website. We reserve the right to modify the terms of use and/or this disclaimer from time to time
                without notice and at our sole discretion by posting amended terms on this website. By using this
                website after changes have been posted, you agree to accept those changes, whether or not you have
                reviewed them.
              </p>

              <h2>Copyright</h2>
              <p>In2IT EBS &copy; 2026. All rights reserved.</p>
              <p>
                Except as specifically permitted herein, no portion of the information on this website may be reproduced
                in any form or by any means without the prior written permission of In2IT EBS.
              </p>

              <h2>Trademarks</h2>
              <p>
                In2IT EBS, and other In2IT EBS graphics, logos and service names including &ldquo;in2itebs.com&rdquo;
                are trademarks of In2IT EBS. Except as specifically permitted herein, these trademarks may not be used
                without the prior written permission of In2IT EBS. All other trademarks not owned by In2IT EBS that
                appear on this website are the property of their respective owners, who may or may not be affiliated
                with, connected to, or sponsored by In2IT EBS.
              </p>

              <h2>Use of website information</h2>
              <p>
                Subject to the terms and conditions set forth in the terms of use and this disclaimer, In2IT EBS grants
                you a non-transferable, non-exclusive, restricted and limited right to access, use and display this
                website along with its contents. You agree that you will not interrupt or attempt to interrupt the
                functioning of this website in any manner whatsoever, and shall use and access this website in
                accordance with the terms and conditions stated in the terms of use and this disclaimer.
              </p>
              <p>
                Except as otherwise indicated elsewhere on this website, you may view, copy, print and download the
                information available on this website subject to the following conditions:
              </p>
              <ul>
                <li>The information may be used solely for personal and informational purposes.</li>
                <li>The information may not be modified or altered in any way.</li>
                <li>
                  Any copy of the information or portion thereof must include the copyright notice above and this
                  permission notice.
                </li>
                <li>
                  The information shall not be disclosed to any other person(s) or entity(ies) unless they are given
                  notice of, and agree to accept, the obligations arising under the terms of use.
                </li>
                <li>
                  You agree to abide by all additional restrictions displayed on this website, as may be updated from
                  time to time.
                </li>
                <li>
                  In2IT EBS reserves the right to revoke such authorisation at any time, and any such use shall be
                  discontinued immediately upon written notice from In2IT EBS.
                </li>
                <li>
                  The information specified above does not include the design or layout of this website. You agree to
                  comply with all copyright and other intellectual property laws worldwide in your use of this website,
                  and to prevent any unauthorised copying of the information.
                </li>
              </ul>

              <h2>Links to third-party websites</h2>
              <p>
                This website may contain links to third-party websites, which are not under the control of In2IT EBS.
                In2IT EBS has no responsibility or liability for, and makes no representations whatsoever about, any
                other website that you may access through this website. These linked sites are provided only for your
                convenience, and you access them at your own risk. The inclusion of such links does not imply that In2IT
                EBS endorses or accepts any responsibility for the content or uses of such websites.
              </p>

              <h2>Indemnification</h2>
              <p>
                By accepting this disclaimer, you agree to indemnify, defend and hold harmless In2IT EBS, its officers,
                employees, agents, subsidiaries, affiliates and other partners from any direct, indirect, incidental,
                special, consequential or exemplary damages resulting from your use of this website, your breach of the
                terms of use, disclaimer and policies (or documents they incorporate by reference), or your violation of
                any law, rule or regulation. Any business transactions which may arise between users from their use of
                this website are the sole responsibility of the users involved.
              </p>

              <h2>Warranties and disclaimers</h2>
              <p>
                In2IT EBS does not warrant the information on this website, which is provided &ldquo;as is&rdquo;
                without warranty of any kind, including, without limitation, any warranty of design, merchantability or
                fitness for a particular purpose, and without warranty as to non-infringement or the performance or
                results you may obtain by using the information. The entire risk as to the results and performance
                obtained from using the information on this website is assumed by you. In2IT EBS does not assume
                responsibility for any errors or omissions in the information or documents referenced by or linked to
                this website.
              </p>
              <p>In2IT EBS makes no warranty that:</p>
              <ul>
                <li>This website will meet your requirements</li>
                <li>The content on this website will be uninterrupted, timely, secure or error free</li>
                <li>The results obtained from use of this website will be accurate or reliable</li>
                <li>
                  The quality of any content or other information obtained through this website will meet your
                  expectations, and that any errors in the software will be corrected
                </li>
                <li>
                  Any material downloaded or otherwise obtained through the use of this website is done at your own
                  discretion and risk; you will be solely responsible for any damage to your computer system or loss of
                  data that results from such downloads
                </li>
                <li>
                  No advice or information, whether oral or written, obtained from In2IT EBS or through this website
                  shall create any warranty not expressly stated in this disclaimer
                </li>
              </ul>
              <p>
                In no event shall In2IT EBS be liable to you or any third party for any incidental, consequential,
                indirect, special or exemplary damages, including, without limitation, loss of business, lost profits,
                business interruption, loss of business information or any pecuniary loss, arising out of, in connection
                with, or relating to the use or performance of the information referenced by or linked to this website,
                even if In2IT EBS has been advised of the possibility of such damages. Because some jurisdictions do not
                allow the exclusion or limitation of liability for consequential or incidental damages, the above
                limitation may not apply to you.
              </p>
              <p>
                This website and the information contained therein could include technical or other inaccuracies or
                typographical errors. In2IT EBS periodically changes the information herein, which will be incorporated
                into new editions of the website. In2IT EBS may make improvements and/or changes to the information
                described in this website at any time and without prior notice.
              </p>

              <h2>Governing law</h2>
              <p>
                By accessing this website, you agree that the foregoing, as well as any dispute raised regarding this
                website or In2IT EBS (in relation to this website), is subject to the laws of the Republic of India, and
                the High Court of Delhi at New Delhi, India shall have exclusive jurisdiction over any dispute that may
                arise out of the use of this website.
              </p>

              <h2>General</h2>
              <p>
                In2IT EBS, its mark and logo and other logos and names are trademarks of In2IT EBS. You understand and
                agree not to display or use these trademarks in any manner without In2IT EBS&rsquo;s prior written
                permission. The section titles of this disclaimer are displayed for convenience only and have no legal
                effect.
              </p>
              <p>
                Please send any questions or comments, or report violations with regard to this website, to{" "}
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
