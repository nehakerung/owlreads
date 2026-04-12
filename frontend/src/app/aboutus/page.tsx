import React from 'react';
import Link from 'next/link';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <section className="main-max-width mx-auto padding-x py-10 md:py-14 lg:py-16">
        <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-card px-6 py-10 shadow-lg md:px-10 md:py-12 lg:px-14 lg:py-14">
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-40 blur-3xl secondary-bg md:h-56 md:w-56" />
          <div className="pointer-events-none absolute -bottom-10 left-1/4 h-32 w-32 rounded-full opacity-20 blur-2xl primary-bg" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-2xl space-y-5 text-left">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm secondary-bg primary-text">
                <span aria-hidden>📚</span>
                Read · Share · Discover
              </p>
              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
                About <span className="secondary-link">OwlReads</span>
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed">
                Reading should feel like an adventure, not homework you are
                dragging through. We built OwlReads so students can geek out
                over stories, track wins, and let teachers cheer from the
                sidelines.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3 lg:max-w-md lg:flex-col lg:items-end">
              <div className="secondary-bg secondary-text flex rotate-1 items-center gap-3 rounded-2xl border-2 border-border p-5 shadow-md transition hover:-rotate-1 hover:shadow-lg">
                <span className="text-3xl" aria-hidden>
                  🎯
                </span>
                <div>
                  <p className="font-bold text-foreground">
                    Goals &amp; streaks
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Progress you can actually see
                  </p>
                </div>
              </div>
              <div className="primary-bg primary-fg -rotate-1 flex items-center gap-3 rounded-2xl border-2 border-primary/30 p-5 shadow-md transition hover:rotate-0 hover:shadow-lg">
                <span className="text-3xl" aria-hidden>
                  🦉
                </span>
                <div>
                  <p className="font-bold">Wise picks</p>
                  <p className="text-sm opacity-90">Curated, not chaotic</p>
                </div>
              </div>
              <div className="secondary-bg secondary-text flex rotate-2 items-center gap-3 rounded-2xl border-2 border-secondary/40 p-5 shadow-md transition hover:rotate-1 hover:shadow-lg">
                <span className="text-3xl" aria-hidden>
                  🎉
                </span>
                <div>
                  <p className="font-bold">Challenges</p>
                  <p className="text-sm opacity-90">
                    Read together, celebrate loud
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="book-item mb-0 mt-10 rounded-2xl p-6 shadow-sm md:p-8 lg:mt-12">
          <h2 className="primary-text mb-4 flex items-center gap-2 text-2xl font-bold md:text-3xl">
            <span aria-hidden>✨</span>
            Why we exist
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            OwlReads started from a simple idea: make it easier to find books
            you actually want to read, and easier to see how far you have come.
            Whether you are exploring genres for fun or grinding toward a
            reading goal, we want the vibe to stay encouraging.
          </p>
        </div>

        <div className="mt-5 grid gap-5 md:mt-6 md:grid-cols-2 md:gap-6">
          <div className="book-item mb-0 rounded-2xl border-primary/20 from-card to-accent p-6 shadow-sm md:p-7">
            <h2 className="primary-text mb-4 text-xl font-bold md:text-2xl">
              For students <span aria-hidden>🎒</span>
            </h2>
            <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              <li className="flex gap-3">
                <span className="text-lg" aria-hidden>
                  📖
                </span>
                <span>
                  Hop genres, chase recommendations, and land your next
                  can&apos;t-put-it-down read.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-lg" aria-hidden>
                  📈
                </span>
                <span>
                  Track progress and milestones so every chapter feels like a
                  win.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-lg" aria-hidden>
                  💬
                </span>
                <span>
                  Post updates, join challenges, and vibe with other readers.
                </span>
              </li>
            </ul>
          </div>

          <div className="book-item mb-0 rounded-2xl border-secondary/30 from-secondary/20 to-card p-6 shadow-sm md:p-7">
            <h2 className="primary-text mb-4 text-xl font-bold md:text-2xl">
              For educators <span aria-hidden>🍎</span>
            </h2>
            <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              <li className="flex gap-3">
                <span className="text-lg" aria-hidden>
                  👀
                </span>
                <span>
                  Glance at how students are engaging, without digging through
                  spreadsheets.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-lg" aria-hidden>
                  🌱
                </span>
                <span>
                  Pair insights with your classroom goals and nurture growth.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-lg" aria-hidden>
                  ☕
                </span>
                <span>Less guesswork, more great book conversations.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 lg:mt-12">
          <h2 className="primary-text mb-6 text-center text-2xl font-bold md:text-3xl">
            What we care about
          </h2>
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            <div className="book-item mb-0 text-center transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="mb-2 text-3xl" aria-hidden>
                🌈
              </p>
              <p className="font-bold text-foreground">Joy first</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Curiosity and pleasure beat pressure every time.
              </p>
            </div>
            <div className="book-item mb-0 text-center transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="mb-2 text-3xl" aria-hidden>
                🧩
              </p>
              <p className="font-bold text-foreground">Kind design</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Simple, friendly, and easy at every age.
              </p>
            </div>
            <div className="book-item mb-0 text-center transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="mb-2 text-3xl" aria-hidden>
                🤝
              </p>
              <p className="font-bold text-foreground">Trust</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Built for real students and teachers.
              </p>
            </div>
          </div>
        </div>

        <div className="update-card mt-10 flex flex-col items-center gap-6 rounded-3xl border-2 border-dashed border-primary/25 px-6 py-10 text-center md:mt-12 md:flex-row md:justify-between md:text-left lg:px-10">
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            <span className="primary-text font-semibold">
              We are still growing!
            </span>{' '}
            Got a wild idea, a bug, or a feature wish? We would love to hear it.
          </p>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end md:w-auto">
            <Link href="/#product_section" className="btnprimary text-center">
              Browse books
            </Link>
            <Link href="/contactus" className="btnsecondary text-center">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
