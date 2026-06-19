'use client'

import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ThemeProvider, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import Fab from '@mui/material/Fab'
import SearchIcon from '@mui/icons-material/Search'
import MicNoneIcon from '@mui/icons-material/MicNone'
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined'
import MapIcon from '@mui/icons-material/Map'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import { toast } from 'sonner'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { muiBrowseTheme } from '@/theme/muiTheme'
import { useDiscoverBrowseState } from '@/hooks/useDiscoverBrowseState'
import { readUserCollabs } from '@/data/collabsMock'
import { mergeMeFromStorage, MOCK_MUSICIANS } from '@/data/musiciansMock'
import { buildDiscoveryItems, discoveryMapMarkers } from '@/lib/discoveryItems'
import dynamic from 'next/dynamic'
import SegmentFilters from './SegmentFilters'
import DiscoveryCard from './DiscoveryCard'

const BrowseMapColored = dynamic(() => import('./BrowseMapColored'), { ssr: false })

function applyDiscoveryFilters(items, { city, instrument, genre }) {
  return items.filter((item) => {
    if (city && item.city && item.city !== city) return false
    if (instrument) {
      if (item.kind === 'artist' && !item.description.toLowerCase().includes(instrument.toLowerCase())) {
        const titleMatch = item.title.toLowerCase().includes(instrument.toLowerCase())
        if (!titleMatch) return false
      }
      if (item.kind === 'instrument' && !item.title.toLowerCase().includes(instrument.toLowerCase())) return false
    }
    if (genre && item.kind === 'artist' && !item.description.toLowerCase().includes(genre.toLowerCase())) {
      return false
    }
    return true
  })
}

function MainBrowseContent() {
  const theme = useTheme()
  const isPhone = useMediaQuery(theme.breakpoints.down('sm'))
  const isSplitLayout = useMediaQuery(theme.breakpoints.up('md'))
  const isWideGrid = useMediaQuery(theme.breakpoints.up('lg'))
  const gridColumns = isPhone ? 1 : isWideGrid ? 3 : isSplitLayout ? 2 : 1
  const router = useRouter()

  const browse = useDiscoverBrowseState()
  const { filtered, city, instrument, genre, userLocationForMap } = browse

  const [segment, setSegment] = useState('all')
  const [userCollabs, setUserCollabs] = useState([])
  const [me, setMe] = useState(() => MOCK_MUSICIANS.find((m) => m.id === 'you'))
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMapOpen, setMobileMapOpen] = useState(false)

  useEffect(() => {
    if (!router.isReady) return
    if (router.query.tab) {
      router.replace('/musicians/map', undefined, { shallow: true })
    }
  }, [router.isReady, router.query.tab, router])

  useEffect(() => {
    setUserCollabs(readUserCollabs())
    const on = () => setUserCollabs(readUserCollabs())
    window.addEventListener('musician-proto-collabs-updated', on)
    return () => window.removeEventListener('musician-proto-collabs-updated', on)
  }, [])

  useEffect(() => {
    const refresh = () => setMe(mergeMeFromStorage(MOCK_MUSICIANS).find((m) => m.id === 'you'))
    refresh()
    window.addEventListener('musician-proto-updated', refresh)
    return () => window.removeEventListener('musician-proto-updated', refresh)
  }, [])

  useEffect(() => {
    setMobileMapOpen(false)
  }, [segment])

  useEffect(() => {
    if (!isPhone) return
    const prev = document.body.style.overflow
    document.body.style.overflow = mobileMapOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileMapOpen, isPhone])

  const discoveryItems = useMemo(() => {
    const base = buildDiscoveryItems({
      segment,
      musicians: filtered,
      userCollabs,
    })
    const filteredItems = applyDiscoveryFilters(base, { city, instrument, genre })
    if (!searchQuery.trim()) return filteredItems
    const q = searchQuery.trim().toLowerCase()
    return filteredItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
    )
  }, [segment, filtered, userCollabs, city, instrument, genre, searchQuery])

  const mapMarkers = useMemo(() => discoveryMapMarkers(discoveryItems), [discoveryItems])

  const matchLabel = `${discoveryItems.length} result${discoveryItems.length === 1 ? '' : 's'} in Province of Lecce`

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 4 }}>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          bgcolor: 'background.default',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
          pt: { xs: 1, md: 1.5 },
          pb: { xs: 1, md: 1.5 },
          px: { xs: 2, sm: 3, md: 8 },
        }}
      >
        <Stack spacing={{ xs: 1.25, md: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              component={Link}
              href="/musicians/you"
              src={me?.photoUrl}
              alt="Your profile"
              sx={{ width: { xs: 36, md: 40 }, height: { xs: 36, md: 40 }, bgcolor: '#d9d9d9' }}
            />
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                border: '1px solid',
                borderColor: 'grey.400',
                borderRadius: '9999px',
                px: 0.5,
                py: 0.25,
                boxShadow: isPhone ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Cerca quello che vuoi"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" aria-label="Voice search" edge="end">
                        <MicNoneIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { fontSize: { xs: 14, md: 13 }, py: 0.25, px: 0.5 },
                }}
              />
            </Paper>
            {!isPhone ? (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
                <Button variant="contained" color="inherit" size="small" sx={{ bgcolor: 'grey.400', color: 'text.primary' }}>
                  Log in
                </Button>
                <Button variant="contained" color="primary" size="small">
                  Sign up
                </Button>
                <IconButton size="small" aria-label="Help" sx={{ border: '1px solid', borderColor: 'primary.main' }}>
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
                <Button component={Link} href="/musicians/you" size="small">
                  Profile
                </Button>
              </Stack>
            ) : (
              <IconButton component={Link} href="/musicians/you" size="small" aria-label="Profile">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>

          {isPhone ? (
            <Typography variant="caption" color="text.secondary" sx={{ pl: 0.5 }}>
              Province of Lecce · Salento
            </Typography>
          ) : null}

          <SegmentFilters
            value={segment}
            onChange={setSegment}
            onFilterClick={() => toast.message('Advanced filters — Province of Lecce (coming soon).')}
          />
        </Stack>
      </Box>

      <Box
        sx={{
          px: { xs: 2, sm: 3, md: 8 },
          pt: { xs: 2, md: 3 },
          pb: { xs: 2, md: 6 },
          display: mobileMapOpen && isPhone ? 'none' : 'block',
        }}
      >
        <Stack spacing={3}>
          <Typography
            variant="body2"
            sx={{ color: '#80838d', lineHeight: 1.43, letterSpacing: '0.17px' }}
          >
            {matchLabel}.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'flex-start',
              gap: 3,
            }}
          >
            <Box
              sx={{
                flex: '1 1 0%',
                minWidth: 0,
                display: 'flex',
                flexWrap: 'wrap',
                alignContent: 'flex-start',
                gap: 3,
              }}
            >
              {discoveryItems.length ? (
                discoveryItems.map((item) => (
                  <DiscoveryCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    imageUrl={item.imageUrl}
                    href={item.href}
                    compact={isPhone}
                    columns={gridColumns}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 4, width: '100%' }}>
                  No results match this view. Try another segment or clear filters.
                </Typography>
              )}
            </Box>

            {isSplitLayout && !isPhone ? (
              <Paper
                elevation={0}
                sx={{
                  width: { md: 360, lg: 533 },
                  flexShrink: 0,
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  minHeight: 420,
                  position: 'sticky',
                  top: 120,
                  alignSelf: 'flex-start',
                  height: 'min(72vh, 640px)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <BrowseMapColored markers={mapMarkers} userLocation={userLocationForMap} />
              </Paper>
            ) : null}
          </Box>
        </Stack>
      </Box>

      {isPhone && mobileMapOpen ? (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1050,
            bgcolor: 'background.paper',
          }}
        >
          <BrowseMapColored markers={mapMarkers} userLocation={userLocationForMap} fullscreen />
        </Box>
      ) : null}

      {isPhone && !mobileMapOpen ? (
        <Fab
          variant="extended"
          color="primary"
          onClick={() => setMobileMapOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1200,
            px: 2.5,
            fontWeight: 600,
            boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
          }}
        >
          <MapIcon sx={{ mr: 1 }} />
          Map
        </Fab>
      ) : null}

      {isPhone && mobileMapOpen ? (
        <Fab
          variant="extended"
          color="inherit"
          onClick={() => setMobileMapOpen(false)}
          sx={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1200,
            px: 2.5,
            fontWeight: 600,
            bgcolor: 'background.paper',
            color: 'text.primary',
            border: '1px solid',
            borderColor: 'grey.300',
            boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
          }}
        >
          <FormatListBulletedIcon sx={{ mr: 1 }} />
          List
        </Fab>
      ) : null}
    </Box>
  )
}

export default function MainBrowsePage() {
  return (
    <ThemeProvider theme={muiBrowseTheme}>
      <CssBaseline />
      <Head>
        <title>Music Talent · Browse</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <MainBrowseContent />
    </ThemeProvider>
  )
}
