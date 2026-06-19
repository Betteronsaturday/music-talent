'use client'

import Link from 'next/link'
import Image from 'next/image'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

/**
 * @param {{ title: string, description: string, imageUrl: string, href: string, compact?: boolean, columns?: 1 | 2 | 3 }} props
 */
export default function DiscoveryCard({ title, description, imageUrl, href, compact = false, columns = 3 }) {
  const cardWidth =
    compact || columns === 1
      ? '100%'
      : columns === 2
        ? 'calc((100% - 24px) / 2)'
        : 'calc((100% - 48px) / 3)'

  return (
    <Box
      component="article"
      sx={{
        width: cardWidth,
        maxWidth: compact ? 'none' : columns === 3 ? 236 : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: compact ? 240 : 200,
          minHeight: compact ? 240 : 200,
          flexShrink: 0,
          borderRadius: 1,
          overflow: 'hidden',
          bgcolor: 'grey.200',
        }}
      >
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes={compact ? '100vw' : '(max-width: 900px) 50vw, (max-width: 1200px) 33vw, 236px'}
          style={{ objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.64) 7.69%, rgba(0,0,0,0) 39.9%, rgba(0,0,0,0) 79.8%, rgba(0,0,0,0.5) 100%)',
            pointerEvents: 'none',
          }}
        />
        <IconButton
          size="small"
          aria-label="Save"
          sx={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            color: 'white',
            p: 0.5,
            '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
          }}
        >
          <FavoriteBorderIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
      <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        <Typography
          variant="subtitle1"
          fontWeight={500}
          color="text.primary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: 16,
            lineHeight: 1.75,
            letterSpacing: '0.15px',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#80838d',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            maxHeight: 40,
            lineHeight: 1.43,
            letterSpacing: '0.17px',
          }}
        >
          {description}
        </Typography>
        <Typography
          component={Link}
          href={href}
          variant="subtitle2"
          fontWeight={500}
          sx={{
            color: 'text.primary',
            textDecoration: 'underline',
            fontSize: 14,
            lineHeight: 1.57,
            letterSpacing: '0.1px',
            display: 'inline-block',
          }}
        >
          View more
        </Typography>
      </Box>
    </Box>
  )
}
