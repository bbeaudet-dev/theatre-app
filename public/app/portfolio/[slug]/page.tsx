import { notFound } from 'next/navigation'
import { CustomMDX } from '../../components/MDX'
import { getPortfolioProjects } from '../../portfolio/utils'
import { baseUrl } from '../../sitemap'

export async function generateStaticParams() {
  let projects = getPortfolioProjects()

  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export function generateMetadata({ params }) {
  let project = getPortfolioProjects().find((project) => project.slug === params.slug)
  if (!project) {
    return
  }

  let {
    title,
    completedAt: completedTime,
    summary: description,
    image,
  } = project.metadata
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: completedTime,
      url: `${baseUrl}/portfolio/${project.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default function Portfolio({ params }) {
  let project = getPortfolioProjects().find((project) => project.slug === params.slug)

  if (!project) {
    notFound()
  }

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            headline: project.metadata.title,
            dateCreated: project.metadata.completedAt,
            description: project.metadata.summary,
            image: project.metadata.image
              ? `${baseUrl}${project.metadata.image}`
              : `/og?title=${encodeURIComponent(project.metadata.title)}`,
            url: `${baseUrl}/portfolio/${project.slug}`,
            author: {
              '@type': 'Person',
              name: 'Ben B',
            },
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {project.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Completed: {project.metadata.completedAt}
        </p>
      </div>
      <article className="prose">
        <CustomMDX source={project.content} />
      </article>
      <div className="mt-8 flex justify-left">
        <a href="/portfolio" className="inline-block px-6 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium shadow hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
          ← Back to Portfolio
        </a>
      </div>
    </section>
  )
} 