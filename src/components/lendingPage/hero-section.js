'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

export function HeroSection({
  badge,
  title,
  description,
  primaryButtonText = 'Mulai Gratis Sekarang',
  secondaryButtonText = 'Kembali ke Beranda',
  primaryButtonHref,
  secondaryButtonHref = '/',
  onPrimaryClick,
  onSecondaryClick,
  backgroundColor = 'bg-[#25294a]'
}) {
  return (
    <section className={`relative py-20 lg:py-32 ${backgroundColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {badge && (
            <Badge
              variant="secondary"
              className="bg-[#4b6fd7]/20 text-[#4b6fd7] border-[#4b6fd7]/30"
            >
              {badge}
            </Badge>
          )}
          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
            {title}
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#4b6fd7] hover:bg-[#4b6fd7]/90 text-primary-foreground text-lg px-8"
              onClick={onPrimaryClick}
            >
              {primaryButtonHref ? (
                <a href={primaryButtonHref} className="flex items-center">
                  {primaryButtonText}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              ) : (
                <>
                  {primaryButtonText}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 border-[#3d4166] text-white hover:bg-muted bg-transparent"
              onClick={onSecondaryClick}
            >
              {secondaryButtonHref ? (
                <a href={secondaryButtonHref}>{secondaryButtonText}</a>
              ) : (
                secondaryButtonText
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
