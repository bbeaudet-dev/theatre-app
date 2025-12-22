import { ForFunOverview } from '../components/ForFunOverview'

export default function ForFunPage() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
        For Fun
      </h1>
      <div className="prose prose-neutral dark:prose-invert">
      </div>
      
      <ForFunOverview />
    </section>
  )
} 