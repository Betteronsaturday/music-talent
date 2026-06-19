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
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import Fab from '@mui/material/Fab'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import SearchIcon from '@mui/icons-material/Search'
import MicNoneIcon from '@mui/icons-material/MicNone'
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined'
import MapIcon from '@mui/icons-material/Map'
import TravelExploreIcon from '@mui/icons-material/TravelExplore'
import HandshakeIcon from '@mui/icons-material/Handshake'
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
import DiscoverProtoPanel from './DiscoverProtoPanel'
import CollabsProtoPanel from './CollabsProtoPanel'

const BrowseMapColored = dynamic(() => import('./BrowseMapColored'), { ssr: false })

const VIEW_TABS = [
  { id: 'map', label: 'Map', Icon: MapIcon },
  { id: 'discover', label: 'Discover', Icon: TravelExploreIcon },
  { id: 'collabs', label: 'Collabs', Icon: HandshakeIcon },
]

const BOTTOM_NAV_H = 64
const MOBILE_MAP_FAB_OFFSET = BOTTOM_NAV_H + 16

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
  const isDesktopSplit = useMediaQuery(theme.breakpoints.up('lg'))

  const router = useRouter()
  const browse = useDiscoverBrowseState()
  const { filtered, city, instrument, genre, userLocationForMap } = browse

  const [segment, setSegment] = useState('all')
  const [userCollabs, setUserCollabs] = useState([])
  const [me, setMe] = useState(() => MOCK_MUSICIANS.find((m) => m.id === 'you'))
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMapOpen, setMobileMapOpen] = useState(false)

  const viewTab = useMemo(() => {
    const raw = router.query.tab
    const t = Array.isArray(raw) ? raw[0] : raw
    return t === 'discover' || t === 'collabs' ? t : 'map'
  }, [router.query.tab])

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
  }, [viewTab, segment])

  useEffect(() => {
    if (!isPhone || viewTab !== 'map') return
    const prev = document.body.style.overflow
    document.body.style.overflow = mobileMapOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileMapOpen, isPhone, viewTab])

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

  const setViewTab = (tab) => {
    const next = tab || 'map'
    router.replace({ pathname: '/musicians/map', query: next === 'map' ? {} : { tab: next } }, undefined, {
      shallow: true,
    })
  }

  const matchLabel =
    viewTab === 'map'
      ? `${discoveryItems.length} result${discoveryItems.length === 1 ? '' : 's'} in Province of Lecce`
      : viewTab === 'discover'
        ? `${browse.displayed.length} musicians match this view`
        : `${userCollabs.length + 3} collab posts (mock)`

  const showMapFab = isPhone && viewTab === 'map' && !mobileMapOpen
  const showListFab = isPhone && viewTab === 'map' && mobileMapOpen

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: isPhone ? `${BOTTOM_NAV_H + 8}px` : 4 }}>
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

          {!isPhone ? (
            <Stack spacing={2}>
              <ToggleButtonGroup
                exclusive
                value={viewTab}
                onChange={(_, v) => v && setViewTab(v)}
                size="small"
                sx={{
                  alignSelf: 'flex-start',
                  bgcolor: 'background.paper',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  p: 0.5,
                  width: { sm: '100%', md: 'auto' },
                  display: 'flex',
                  '& .MuiToggleButton-root': {
                    border: 0,
                    borderRadius: '9999px !important',
                    px: 2,
                    flex: { sm: 1, md: '0 1 auto' },
                    textTransform: 'none',
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': { bgcolor: 'primary.dark' },
                    },
                  },
                }}
              >
                {VIEW_TABS.map(({ id, label, Icon }) => (
                  <ToggleButton key={id} value={id}>
                    <Icon sx={{ fontSize: 18, mr: 0.75 }} />
                    {label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              {viewTab === 'map' ? (
                <SegmentFilters
                  value={segment}
                  onChange={setSegment}
                  onFilterClick={() => toast.message('Advanced filters — Province of Lecce (coming soon).')}
                />
              ) : null}
            </Stack>
          ) : (
            <>
              <Typography variant="caption" color="text.secondary" sx={{ pl: 0.5 }}>
                Province of Lecce · Salento
              </Typography>
              {viewTab === 'map' ? (
                <SegmentFilters
                  value={segment}
                  onChange={setSegment}
                  onFilterClick={() => toast.message('Advanced filters — Province of Lecce (coming soon).')}
                />
              ) : null}
            </>
          )}
        </Stack>
      </Box>

      <Box
        sx={{
          px: { xs: 2, sm: 3, md: 8 },
          pt: { xs: 2, md: 3 },
          pb: { xs: 2, md: 4 },
          display: mobileMapOpen && isPhone && viewTab === 'map' ? 'none' : 'block',
        }}
      >
        {viewTab === 'map' ? (
          <Stack spacing={{ xs: 2, md: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {matchLabel}.
            </Typography>
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems="flex-start">
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  width: '100%',
                  minWidth: 0,
                  flexDirection: isPhone ? 'column' : isDesktopSplit ? 'row' : 'row',
                  flexWrap: isDesktopSplit || isPhone ? 'nowrap' : 'wrap',
                  gap: { xs: 3, sm: 2.5, md: 3 },
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
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                    No results match this view. Try another segment or clear filters.
                  </Typography>
                )}
              </Box>
              {isDesktopSplit ? (
                <Paper
                  elevation={0}
                  sx={{
                    width: 533,
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
                  }}
                >
                  <BrowseMapColored markers={mapMarkers} userLocation={userLocationForMap} />
                </Paper>
              ) : !isPhone ? (
                <Paper
                  elevation={0}
                  sx={{
                    width: '100%',
                    borderRadius: 1,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    height: { sm: 380, md: 420 },
                  }}
                >
                  <BrowseMapColored markers={mapMarkers} userLocation={userLocationForMap} />
                </Paper>
              ) : null}
            </Stack>
          </Stack>
        ) : null}

        {viewTab === 'discover' ? (
          <Box className="dark rounded-xl border border-border bg-background p-3 sm:p-4 md:p-6">
            <DiscoverProtoPanel browse={browse} />
          </Box>
        ) : null}

        {viewTab === 'collabs' ? (
          <Box className="dark rounded-xl border border-border bg-background p-3 sm:p-4 md:p-6">
            <CollabsProtoPanel />
          </Box>
        ) : null}
      </Box>

      {isPhone && viewTab === 'map' && mobileMapOpen ? (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: BOTTOM_NAV_H,
            zIndex: 1050,
            bgcolor: 'background.paper',
          }}
        >
          <BrowseMapColored markers={mapMarkers} userLocation={userLocationForMap} fullscreen />
        </Box>
      ) : null}

      {showMapFab ? (
        <Fab
          variant="extended"
          color="primary"
          onClick={() => setMobileMapOpen(true)}
          sx={{
            position: 'fixed',
            bottom: MOBILE_MAP_FAB_OFFSET,
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

      {showListFab ? (
        <Fab
          variant="extended"
          color="inherit"
          onClick={() => setMobileMapOpen(false)}
          sx={{
            position: 'fixed',
            bottom: MOBILE_MAP_FAB_OFFSET,
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

      {isPhone ? (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1300,
            borderTop: '1px solid',
            borderColor: 'grey.200',
            pb: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          <BottomNavigation
            showLabels
            value={viewTab}
            onChange={(_, v) => v && setViewTab(v)}
            sx={{
              height: BOTTOM_NAV_H,
              bgcolor: 'background.paper',
              '& .MuiBottomNavigationAction-root': {
                minWidth: 0,
                py: 1,
                '&.Mui-selected': { color: 'primary.main' },
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.7rem',
                '&.Mui-selected': { fontSize: '0.7rem' },
              },
            }}
          >
            {VIEW_TABS.map(({ id, label, Icon }) => (
              <BottomNavigationAction key={id} value={id} label={label} icon={<Icon />} />
            ))}
          </BottomNavigation>
        </Paper>
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
