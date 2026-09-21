import { pageMetadata } from "@/lib/metadata";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { Eyebrow, Headline } from "@/components/ui/typography";
import { Reveal } from "@/components/motion/reveal";
import { insights, insightArticles } from "@/content/insights";
import { insightBodies } from "@/content/insight-bodies";

export async function generateStaticParams() {
  return insightArticles.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = insights.find((i) => i.slug === slug);
  if (!article) return pageMetadata(`/insights/${slug}/`, { title: "Insight" });
  return pageMetadata(`/insights/${slug}/`, {
    title: article.title,
    description: article.excerpt,
  });
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateFormatter.format(d);
}

/**
 * One article, exactly as the live site prints it (owner, 2026-09-21): its category and date, its
 * title, its image, its body block for block, and its byline. Nothing else is added around the
 * copy — no lead, no decoration, no related reading, no closing call to action — only the site's
 * reveal animation as the page comes in.
 */
export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = insights.find((i) => i.slug === slug);
  if (!article) notFound();

  const body = insightBodies[article.slug];

  return (
    <>
      <BreadcrumbJsonLd path={`/insights/${article.slug}/`} name={article.title} />
      <ArticleJsonLd
        slug={article.slug}
        title={article.title}
        date={article.date}
        excerpt={article.excerpt}
        author={body.author}
      />
      {/* ARTICLE HEADER */}
      <section className="bg-surface-subtle pt-36 pb-16 md:pt-44 md:pb-20">
        <Container>
          <Reveal className="mx-auto flex max-w-3xl flex-col gap-6">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Eyebrow>{article.category}</Eyebrow>
              {article.date ? (
                <time dateTime={article.date} className="text-sm font-medium text-foreground-muted">
                  {formatDate(article.date)}
                </time>
              ) : article.dateLabel ? (
                // The live site prints a day and month and no year for these; showing exactly that
                // is honest, where inventing a year would not be.
                <span className="text-sm font-medium text-foreground-muted">{article.dateLabel}</span>
              ) : null}
            </div>
            <Headline level={1}>{article.title}</Headline>
          </Reveal>
        </Container>
      </section>

      {/* ARTICLE BODY */}
      <Section tone="white">
        <Container>
          <Reveal className="mx-auto max-w-measure">
            {article.image && (
              <figure className="mb-10 overflow-hidden rounded-feature">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.image} alt="" className="w-full object-cover" loading="eager" />
              </figure>
            )}
            <div className="flex flex-col gap-5 text-lg leading-relaxed text-foreground-muted">
              {body.blocks.map((block, index) =>
                block.type === "image" ? (
                  // The live article prints these inline, at this point in the copy.
                  <figure key={index} className="my-2 overflow-hidden rounded-feature">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={block.src}
                      alt={block.alt ?? ""}
                      className="mx-auto max-h-[28rem] w-auto max-w-full"
                      loading="lazy"
                    />
                  </figure>
                ) : block.type === "link" ? (
                  <p key={index}>
                    <Link
                      href={block.href}
                      className="inline-flex min-h-11 items-center rounded-full bg-action px-6 text-sm font-semibold text-on-action"
                    >
                      {block.text}
                    </Link>
                  </p>
                ) : block.type === "heading" ? (
                  <h2 key={index} className="heading-plain mt-4 text-h3 font-semibold text-foreground first:mt-0">
                    {block.text}
                  </h2>
                ) : block.type === "listItem" ? (
                  <p key={index} className="flex gap-3 pl-1">
                    <span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{block.text}</span>
                  </p>
                ) : block.strong ? (
                  <p key={index} className="font-semibold text-foreground">
                    {block.text}
                  </p>
                ) : (
                  <p key={index}>{block.text}</p>
                ),
              )}
            </div>
            {body.author && (
              <p className="mt-10 border-t border-border-subtle pt-6 text-sm leading-relaxed text-foreground-muted">
                <span className="font-semibold text-foreground">{body.author}</span>
                {body.authorRole ? ` — ${body.authorRole}` : ""}
                {body.authorDate ? ` · ${body.authorDate}` : ""}
              </p>
            )}
            <div className="mt-10">
              <Link href="/insights/" className="inline-flex items-center gap-2 text-sm font-semibold text-action">
                ← All insights
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
