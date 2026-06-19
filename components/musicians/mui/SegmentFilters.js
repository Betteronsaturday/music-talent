'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import { SEGMENT_ACTIVE_BORDER, SEGMENT_ACTIVE_INNER } from '@/theme/muiTheme'
import TuneIcon from '@mui/icons-material/Tune'

const SEGMENTS = [
  { id: 'all', label: 'All' },
  { id: 'artists', label: 'Artists' },
  { id: 'instruments', label: 'Instruments' },
  { id: 'spaces', label: 'Spaces' },
  { id: 'collaborations', label: 'Collaborations' },
]

/**
 * @param {{ value: string, onChange: (id: string) => void, onFilterClick: () => void }} props
 */
export default function SegmentFilters({ value, onChange, onFilterClick }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        overflowX: 'auto',
        flexWrap: { xs: 'nowrap', md: 'wrap' },
        justifyContent: { md: 'center' },
        mx: { xs: -2, sm: -2, md: 0 },
        px: { xs: 2, sm: 2, md: 0 },
        pb: 0.5,
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {SEGMENTS.map((seg) => {
        const active = value === seg.id
        return (
          <Box
            key={seg.id}
            sx={{
              flexShrink: 0,
              borderRadius: '32px',
              border: active ? `1.5px solid ${SEGMENT_ACTIVE_BORDER}` : '1.5px solid transparent',
              p: active ? '2px' : 0,
            }}
          >
            <Button
              onClick={() => onChange(seg.id)}
              variant="outlined"
              sx={{
                minHeight: 44,
                px: 2,
                whiteSpace: 'nowrap',
                borderRadius: '9999px',
                borderColor: active ? SEGMENT_ACTIVE_INNER : 'grey.200',
                bgcolor: 'background.paper',
                color: 'text.primary',
                fontWeight: 400,
                boxShadow: 'none',
                '&:hover': {
                  borderColor: active ? SEGMENT_ACTIVE_INNER : 'grey.300',
                  bgcolor: 'background.paper',
                },
              }}
            >
              {seg.label}
            </Button>
          </Box>
        )
      })}
      <Box sx={{ display: 'flex', alignItems: 'stretch', px: 0.5, py: 1, flexShrink: 0 }}>
        <Divider orientation="vertical" flexItem />
      </Box>
      <IconButton
        onClick={onFilterClick}
        aria-label="Open filters"
        sx={{
          flexShrink: 0,
          minHeight: 44,
          minWidth: 44,
          border: '1px solid',
          borderColor: 'grey.200',
          bgcolor: 'background.paper',
        }}
      >
        <TuneIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}
