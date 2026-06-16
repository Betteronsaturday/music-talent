import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EXPERIENCE_LABELS, MUSICIAN_CATEGORY_LABELS } from '@/data/musiciansMock'
import { getMusicianSocialEntries } from '@/lib/musicianSocialUi'
import { cn } from '@/lib/utils'

/**
 * LinkedIn-style profile blocks: about, instruments, experience, education, social/streaming.
 * @param {{ musician: Record<string, unknown> }} props
 */
export default function ProfileResume({ musician }) {
  const studies = musician.studies ?? []
  const experiences = musician.experiences ?? []
  const categories = musician.categories ?? []
  const socialEntries = getMusicianSocialEntries(musician)

  return (
    <div className="space-y-8">
      <section aria-labelledby="about-heading" className="space-y-2">
        <h2 id="about-heading" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          About
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{musician.bio}</p>
      </section>

      {categories.length ? (
        <section aria-labelledby="roles-heading" className="space-y-3">
          <h2 id="roles-heading" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Roles
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((k) => (
              <Badge key={k} variant="secondary" className="font-normal">
                {MUSICIAN_CATEGORY_LABELS[k] ?? k}
              </Badge>
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="instruments-heading" className="space-y-3">
        <h2 id="instruments-heading" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Instruments & genres
        </h2>
        <div className="flex flex-wrap gap-2">
          {(musician.instruments ?? []).map((i) => (
            <Badge key={i} variant="secondary" className="font-normal">
              {i}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(musician.genres ?? []).map((g) => (
            <Badge key={g} variant="outline" className="font-normal text-muted-foreground">
              {g}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Level:{' '}
          <span className="font-medium text-foreground">
            {EXPERIENCE_LABELS[musician.experience] ?? musician.experience}
          </span>
        </p>
      </section>

      {experiences.length ? (
        <section aria-labelledby="experience-heading" className="space-y-3">
          <h2 id="experience-heading" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Experience
          </h2>
          <ul className="space-y-4 border-l border-border pl-4">
            {experiences.map((ex, idx) => (
              <li key={idx} className="relative">
                <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full bg-primary/80 ring-4 ring-background" />
                <p className="text-sm font-medium text-foreground">{ex.title}</p>
                {ex.organization ? (
                  <p className="text-xs text-muted-foreground">{ex.organization}</p>
                ) : null}
                {ex.period ? <p className="text-[11px] text-muted-foreground/90">{ex.period}</p> : null}
                {ex.location ? <p className="text-[11px] text-muted-foreground/80">{ex.location}</p> : null}
                {ex.description ? (
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{ex.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {studies.length ? (
        <section aria-labelledby="education-heading" className="space-y-3">
          <h2 id="education-heading" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Education
          </h2>
          <ul className="space-y-4 border-l border-border pl-4">
            {studies.map((st, idx) => (
              <li key={idx} className="relative">
                <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full bg-muted-foreground/50 ring-4 ring-background" />
                <p className="text-sm font-medium text-foreground">{st.school}</p>
                {st.credential ? <p className="text-xs text-muted-foreground">{st.credential}</p> : null}
                {st.field ? <p className="text-xs text-muted-foreground/90">{st.field}</p> : null}
                {st.period ? <p className="text-[11px] text-muted-foreground/80">{st.period}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div id="profile-links" className="scroll-mt-28 space-y-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Social & streaming
        </h2>
        <p className="text-xs text-muted-foreground">
          Link every place you publish or hang out — same idea as contact links on a résumé or LinkedIn.
        </p>
        {socialEntries.length ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {socialEntries.map((s, idx) => {
              const Icon = s.Icon
              return (
                <li key={`${s.key}-${idx}-${s.href}`}>
                  <Button variant="outline" size="sm" className="h-auto w-full justify-start gap-2 py-2" asChild>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex">
                      <Icon className={cn('size-4 shrink-0 text-muted-foreground')} aria-hidden />
                      <span className="truncate text-left">{s.label}</span>
                    </a>
                  </Button>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No social or streaming links on this profile yet.</p>
        )}
      </div>
    </div>
  )
}
