import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { SeenIndicator } from './SeenIndicator'
import { AudioMessage } from './AudioMessage'

const messageBubbleVariants = cva('flex flex-col gap-1 rounded-3xl p-3', {
  variants: {
    sender: {
      user: 'bg-brand-500 text-white items-end',
      support: 'bg-white border border-gray-100 text-gray-500 items-start',
    },
  },
  defaultVariants: {
    sender: 'user',
  },
})

export interface MessageBubbleProps extends VariantProps<
  typeof messageBubbleVariants
> {
  message: string
  timestamp?: string
  seen?: boolean
  sender: 'user' | 'support'
  audioBlob?: Blob
  audioDuration?: number
  className?: string
}

/**
 * MessageBubble - Component to display chat messages
 */
export const MessageBubble = ({
  message,
  timestamp,
  seen = false,
  sender,
  audioBlob,
  audioDuration,
  className,
}: MessageBubbleProps) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-1',
        sender === 'user' ? 'items-end' : 'items-start',
        className
      )}
    >
      {audioBlob ? (
        <AudioMessage
          audioBlob={audioBlob}
          duration={audioDuration}
          sender={sender}
        />
      ) : (
        <div className={cn(messageBubbleVariants({ sender }))}>
          <p className="text-12 sm:text-14 md:text-16 font-normal leading-4 sm:leading-5 md:leading-6 whitespace-pre-wrap">
            {message}
          </p>
        </div>
      )}
      <div
        className={cn(
          'flex items-center gap-1',
          sender === 'user' ? 'justify-end' : 'justify-start'
        )}
      >
        {timestamp && (
          <span className="text-10 sm:text-11 md:text-12 font-normal leading-3 sm:leading-3.5 md:leading-4 text-gray-500">
            {timestamp}
          </span>
        )}
        {sender === 'user' && (
          <SeenIndicator seen={seen} status={seen ? 'read' : 'sent'} />
        )}
      </div>
    </div>
  )
}
