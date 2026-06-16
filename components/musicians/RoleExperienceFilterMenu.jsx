'use client'

import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  EXPERIENCE_LABELS,
  EXPERIENCE_ORDER,
  MUSICIAN_CATEGORY_LABELS,
  MUSICIAN_CATEGORY_ORDER,
  formatRoleExperienceFilterSummary,
} from '@/data/musiciansMock'

function MenuItemRow({ selected, children }) {
  return (
    <span className="flex w-full min-w-0 items-center gap-2">
      <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground">
        {selected ? <CheckIcon className="size-3.5 text-foreground" aria-hidden /> : null}
      </span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </span>
  )
}

/**
 * Hierarchical role → experience filter (grouped parent → child menus), shadcn + Radix styling.
 * @param {{ label: string, value: string, onChange: (next: string) => void }} props
 */
export default function RoleExperienceFilterMenu({ label, value, onChange }) {
  const summary = formatRoleExperienceFilterSummary(value)

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs font-normal text-muted-foreground">{label}</Label>
      <DropdownMenu>
        <DropdownMenuTrigger
          type="button"
          className={cn(
            'flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none',
            'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
            'hover:bg-muted/50 dark:bg-input/30 dark:hover:bg-input/50'
          )}
        >
          <span className="min-w-0 flex-1 truncate text-left font-normal text-foreground">{summary}</span>
          <ChevronDownIcon className="pointer-events-none size-4 shrink-0 text-muted-foreground" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={4}
          className="max-h-[min(70vh,420px)] w-(--radix-dropdown-menu-trigger-width) min-w-56 overflow-y-auto"
        >
          <DropdownMenuLabel className="px-2 py-1.5 text-[11px] font-normal leading-snug text-muted-foreground">
            Open a role to refine by experience, or pick a level that applies to every role — nested like a grouped
            menu.
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-sm" onSelect={() => onChange('')}>
            <MenuItemRow selected={!value}>Any</MenuItemRow>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Roles
          </DropdownMenuLabel>
          {MUSICIAN_CATEGORY_ORDER.map((role) => (
            <DropdownMenuSub key={role}>
              <DropdownMenuSubTrigger className="text-sm">
                {MUSICIAN_CATEGORY_LABELS[role]}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="min-w-[11rem] p-1" sideOffset={6} alignOffset={-4}>
                <DropdownMenuLabel className="px-2 py-1 text-[10px] font-normal text-muted-foreground">
                  Experience for {MUSICIAN_CATEGORY_LABELS[role]}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-sm" onSelect={() => onChange(`r:${role}`)}>
                  <MenuItemRow selected={value === `r:${role}`}>Any level</MenuItemRow>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {EXPERIENCE_ORDER.map((exp) => {
                  const token = `r:${role}|x:${exp}`
                  return (
                    <DropdownMenuItem key={token} className="text-sm" onSelect={() => onChange(token)}>
                      <MenuItemRow selected={value === token}>{EXPERIENCE_LABELS[exp]}</MenuItemRow>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Experience · any role
          </DropdownMenuLabel>
          {EXPERIENCE_ORDER.map((exp) => {
            const token = `x:${exp}`
            return (
              <DropdownMenuItem key={token} className="text-sm" onSelect={() => onChange(token)}>
                <MenuItemRow selected={value === token}>{EXPERIENCE_LABELS[exp]} · any role</MenuItemRow>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
