'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Mail, Linkedin, Github } from 'lucide-react'

export function TeamMemberCard({
  name,
  role,
  description,
  icon: Icon,
  socialLinks = []
}) {
  const getSocialIcon = type => {
    switch (type) {
      case 'email':
        return Mail
      case 'linkedin':
        return Linkedin
      case 'github':
        return Github
      default:
        return Mail
    }
  }

  return (
    <Card className="border border-[#3d4166] bg-[#2d3154] hover:border-[#4b6fd7]/50 transition-colors">
      <CardHeader className="text-center">
        <div className="w-24 h-24 bg-[#4b6fd7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-12 h-12 text-[#4b6fd7]" />
        </div>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{role}</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-300 text-sm">{description}</p>
        {socialLinks.length > 0 && (
          <div className="flex justify-center space-x-3">
            {socialLinks.map((link, index) => {
              const SocialIcon = getSocialIcon(link.type)
              return (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  className="border-[#4b6fd7] text-white hover:bg-[#4b6fd7] bg-transparent"
                  onClick={() => window.open(link.url, '_blank')}
                >
                  <SocialIcon className="w-4 h-4" />
                </Button>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
