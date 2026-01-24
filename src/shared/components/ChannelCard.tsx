'use client'

import type { Channel } from '@/shared/data/channels'

interface ChannelCardProps {
  channel: Channel
  compact?: boolean
}

export function ChannelCard({ channel, compact = false }: ChannelCardProps) {
  const Icon = channel.icon

  if (compact) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 hover:border-secondary transition-all">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon className="size-5 text-secondary" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">
            {channel.title}
          </h3>
        </div>
        <div className="space-y-1">
          {channel.items.slice(0, 2).map((item, idx) => (
            <div key={idx}>
              {'link' in item && item.link ? (
                <a
                  href={item.link}
                  target={item.link.startsWith('http') ? '_blank' : undefined}
                  rel={
                    item.link.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className="text-xs text-secondary hover:underline block"
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-xs text-muted-foreground">{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Channel Header */}
      <div className="bg-primary-light p-3 border-b border-border">
        <div className="flex items-center gap-3">
          <Icon className="size-5 text-white" />
          <h2 className="font-semibold text-white text-sm">{channel.title}</h2>
        </div>
      </div>

      {/* Channel Details */}
      <div className="p-4 space-y-3">
        {channel.items.map((item, idx) => (
          <div key={idx}>
            <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
            {'link' in item && item.link ? (
              <a
                href={item.link}
                target={item.link.startsWith('http') ? '_blank' : undefined}
                rel={
                  item.link.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                className="text-sm font-medium text-secondary hover:underline block"
              >
                {item.value}
              </a>
            ) : (
              <p className="text-sm font-medium text-foreground">
                {item.value}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
