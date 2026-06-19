'use client'

import Link from 'next/link'
import Image from 'next/image'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

/**
 * @param {{ title: string, description: string, imageUrl: string, href: string, compact?: boolean }} props
 */
export default function DiscoveryCard({ title, description, imageUrl, href, compact = false }) {
  return (
    <Box
      component="article"
      sx={{
        width: compact
          ? '100%'
          : { xs: '100%', sm: 'calc(50% - 10px)', md: 'calc(50% - 12px)', lg: 'calc(33.333% - 16px)' },
        maxWidth: compact ? 'none' : { lg: 280 },
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: compact ? '20 / 19' : { xs: '20 / 19', sm: '4 / 3' },
          maxHeight: compact ? 320 : { xs: 320, sm: 200 },
          borderRadius: compact ? 2 : { xs: 2, sm: 1 },
          overflow: 'hidden',
          bgcolor: 'grey.200',
        }}
      >
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes={compact ? '100vw' : '(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 280px'}
          style={{ objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 75%, rgba(0,0,0,0.25) 100%)',
            pointerEvents: 'none',
          }}
        />
        <IconButton
          size="small"
          aria-label="Save"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
            bgcolor: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(4px)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' },
          }}
        >
          <FavoriteBorderIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ minWidth: 0, px: compact ? 0.25 : 0 }}>
        <Typography
          variant={compact ? 'subtitle1' : 'subtitle1'}
          fontWeight={600}
          color="text.primary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: compact ? '1rem' : undefined,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mt: 0.25,
            lineHeight: 1.45,
          }}
        >
          {description}
        </Typography>
        <Typography
          component={Link}
          href={href}
          variant="body2"
          fontWeight={500}
          sx={{
            color: 'text.primary',
            textDecoration: 'underline',
            mt: 0.75,
            display: 'inline-block',
          }}
        >
          View more
        </Typography>
      </Box>
    </Box>
  )
}
