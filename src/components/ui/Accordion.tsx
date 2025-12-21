'use client'

import { useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface AccordionItemProps {
  question: string
  answer: string | ReactNode
  defaultOpen?: boolean
  className?: string
}

export interface AccordionProps {
  items: AccordionItemProps[]
  className?: string
}

export const Accordion = ({ items, className }: AccordionProps) => {
  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, index) => (
        <AccordionItem key={index} {...item} />
      ))}
    </div>
  )
}

const AccordionItem = ({
  question,
  answer,
  defaultOpen = false,
  className,
}: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div
      className={cn('rounded-md border border-gray-200 bg-white', className)}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-16  text-gray-900">{question}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-gray-500 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="border-t border-gray-200 px-4 py-3">
          <p className="text-14 text-gray-500">{answer}</p>
        </div>
      )}
    </div>
  )
}
