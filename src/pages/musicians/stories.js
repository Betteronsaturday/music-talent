import MusicianShell from '../../../components/musicians/MusicianShell'
import { MOCK_STORIES } from '@/data/storiesMock'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function StoriesPage() {
  return (
    <MusicianShell title="Stories · Musicians">
      <section className="space-y-4" aria-labelledby="stories-heading">
        <div>
          <h2 id="stories-heading" className="text-sm font-medium text-foreground">
            Where connections turn into music
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Mock vignettes — not real users. Mirrors a “social proof / outcomes” surface like many networks
            use on marketing pages.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {MOCK_STORIES.map((s) => (
            <li key={s.id}>
              <Card className="h-full bg-gradient-to-b from-card to-background">
                <CardHeader>
                  <CardDescription className="text-[11px] font-medium uppercase tracking-wider text-amber-500/90">
                    {s.city}
                  </CardDescription>
                  <CardTitle className="text-lg">{s.headline}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{s.detail}</p>
                  <p className="text-xs text-muted-foreground/80">{s.names}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </MusicianShell>
  )
}
