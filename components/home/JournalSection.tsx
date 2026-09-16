import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import journalImageOne from "@/asserts/Home-asserts/subsection-image-one.png";
import journalImageTwo from "@/asserts/Home-asserts/subsection-image-two.png";

// Journal posts with their local images. Kept with the component because the
// images are imported through the bundler (`asserts/`, not `public/`).
const journalPosts = [
  {
    title: "Whispering in Your Language",
    excerpt:
      "How Aura AI learned to speak Hindi, Tamil, Malayalam and Kannada — and why your mother tongue makes every conversation feel closer to home.",
    image: journalImageOne,
    alt: "Warm abstract sound wave illustration",
  },
  {
    title: "Designing a Voice You Can Trust",
    excerpt:
      "Inside the soft edges, gentle pacing and honest design choices that make Aura feel less like software and more like a friend.",
    image: journalImageTwo,
    alt: "Calm, softly lit living room scene",
  },
];

/**
 * "Latest Journal" section — two <article> cards. Semantic `<article>`
 * elements plus descriptive headings are good for SEO & screen readers.
 */
export function JournalSection() {
  return (
    <section id="journal" className="mx-auto max-w-7xl px-6 py-20 lg:px-16">
      {/* Section header */}
      <div data-reveal className="mb-10 flex items-end justify-between">
        <h2 className="text-3xl font-bold text-foreground">Latest Journal</h2>
        <Link
          href="/features"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent-mauve transition-colors hover:text-accent-mauve-hover"
        >
          View all
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {/* Post cards */}
      <div data-stagger className="grid gap-8 md:grid-cols-2">
        {journalPosts.map((post) => (
          <article
            key={post.title}
            data-stagger-item
            className="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg"
          >
            <div className="relative aspect-video overflow-hidden rounded-t-2xl">
              <Image
                src={post.image}
                alt={post.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-mauve backdrop-blur">
                Journal
              </span>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-warm-text">
                {post.excerpt}
              </p>
              <Link
                href="/features"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-mauve transition-colors hover:text-accent-mauve-hover"
              >
                Read story
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}