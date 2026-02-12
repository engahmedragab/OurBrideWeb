'use client'

import { useState } from 'react'
import { useI18nTranslations } from '@/i18n'
import {
  Accordion,
  ReportProblemForm,
  LiveChatSection,
  StatusModal,
  ChatModal,
} from '@/components/ui'
import type { ChatMessage } from '@/components/ui'

/**
 * FAQ Page - Help Center with FAQ, Report Problem, and Live Chat
 */
export default function HelpCenterPage() {
  const t = useI18nTranslations('helpCenter')
  const tChat = useI18nTranslations('chat.support')
  const tCommon = useI18nTranslations('common')
  
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState(
    t('reportSubmitted')
  )
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

  const handleReportSubmit = (data: {
    problemType: string
    description: string
  }) => {
    const hasProblemType =
      data.problemType && data.problemType.trim().length > 0
    const hasDescription =
      data.description && data.description.trim().length > 0
    const isOther = data.problemType === 'Other'

    if (isOther) {
      if (hasDescription) {
        // Handle form submission - API call would go here
        setSuccessMessage(t('reportSubmitted'))
        setIsSuccessModalOpen(true)
      }
    } else if (hasProblemType || hasDescription) {
      // Handle form submission - API call would go here
      setSuccessMessage(t('reportSubmitted'))
      setIsSuccessModalOpen(true)
    }
  }

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false)
  }

  const handleStartChat = () => {
    setIsChatModalOpen(true)
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          id: '1',
          message: tChat('greeting'),
          sender: 'support',
          timestamp: new Date().toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
          seen: true,
          quickReplies: [
            tChat('quickReplies.bookingIssue'),
            tChat('quickReplies.serviceProviderIssue'),
            tChat('quickReplies.paymentIssue'),
            tChat('quickReplies.technicalProblem'),
            tChat('quickReplies.other'),
          ],
        },
      ])
    }
  }

  const handleSendMessage = async (message?: string, audioBlob?: Blob) => {
    if (audioBlob) {
      const audioFile = new File([audioBlob], 'voice-message.webm', {
        type: 'audio/webm',
      })

      const formData = new FormData()
      formData.append('audio', audioFile)
      formData.append('message', message || '[Voice Message]')
      formData.append('type', 'voice')

      // TODO: Send to backend API
      // Example: await apiClient.post('/chat/send-voice', formData)
    } else if (message) {
      // TODO: Send text message to backend API
      // Example: await apiClient.post('/chat/send', { message })
    }

    let audioDuration = 0
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      await new Promise<void>(resolve => {
        const handleLoadedMetadata = () => {
          audioDuration = Math.floor(audio.duration)
          URL.revokeObjectURL(audioUrl)
          resolve()
        }

        const handleError = () => {
          URL.revokeObjectURL(audioUrl)
          resolve()
        }

        audio.addEventListener('loadedmetadata', handleLoadedMetadata, {
          once: true,
        })
        audio.addEventListener('error', handleError, { once: true })
      })
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message: audioBlob ? '[Voice Message]' : message || '',
      sender: 'user',
      timestamp: new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      seen: false,
      audioBlob: audioBlob,
      audioDuration: audioBlob ? audioDuration : undefined,
    }
    setChatMessages(prev => [...prev, newMessage])

    setTimeout(() => {
      const supportResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: tChat('response'),
        sender: 'support',
        timestamp: new Date().toLocaleString('en-US', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        seen: true,
      }
      setChatMessages(prev => [...prev, supportResponse])
      setChatMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, seen: true } : msg
        )
      )
    }, 1000)
  }

  const handleSelectQuickReply = (reply: string) => {
    handleSendMessage(reply)
  }

  const faqCategories = [
    {
      title: t('categories.accountProfile.title'),
      items: [
        {
          question: t('categories.accountProfile.items.createAccount.question'),
          answer: t('categories.accountProfile.items.createAccount.answer'),
        },
        {
          question: t('categories.accountProfile.items.resetPassword.question'),
          answer: t('categories.accountProfile.items.resetPassword.answer'),
        },
      ],
    },
    {
      title: t('categories.bookingsServices.title'),
      items: [
        {
          question: t('categories.bookingsServices.items.bookService.question'),
          answer: t('categories.bookingsServices.items.bookService.answer'),
        },
        {
          question: t('categories.bookingsServices.items.cancelReschedule.question'),
          answer: t('categories.bookingsServices.items.cancelReschedule.answer'),
        },
        {
          question: t('categories.bookingsServices.items.trackBooking.question'),
          answer: t('categories.bookingsServices.items.trackBooking.answer'),
        },
      ],
    },
    {
      title: t('categories.payments.title'),
      items: [
        {
          question: t('categories.payments.items.paymentMethods.question'),
          answer: t('categories.payments.items.paymentMethods.answer'),
        },
      ],
    },
    {
      title: t('categories.offersCoupons.title'),
      items: [
        {
          question: t('categories.offersCoupons.items.applyCoupon.question'),
          answer: t('categories.offersCoupons.items.applyCoupon.answer'),
        },
        {
          question: t('categories.offersCoupons.items.couponNotWorking.question'),
          answer: t('categories.offersCoupons.items.couponNotWorking.answer'),
        },
      ],
    },
    {
      title: t('categories.trustSafety.title'),
      items: [
        {
          question: t('categories.trustSafety.items.providerVerification.question'),
          answer: t('categories.trustSafety.items.providerVerification.answer'),
        },
        {
          question: t('categories.trustSafety.items.paymentSecurity.question'),
          answer: t('categories.trustSafety.items.paymentSecurity.answer'),
        },
        {
          question: t('categories.trustSafety.items.reportProblem.question'),
          answer: t('categories.trustSafety.items.reportProblem.answer'),
        },
      ],
    },
  ]

  return (
    <>
      {/* Page Title */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-20 lg:text-24 font-normal leading-8 lg:leading-10 text-black">
          {t('title')}
        </h1>
      </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          {/* Left Column - FAQ Accordion */}
          <div className="w-full space-y-4 lg:w-[60%]">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="flex flex-col gap-2">
                <h2 className="text-16 lg:text-20 font-normal leading-8 lg:leading-10 text-black">
                  {category.title}
                </h2>
                <Accordion
                  items={category.items.map(item => ({
                    question: item.question,
                    answer: item.answer,
                    defaultOpen: false,
                    className: 'rounded-2xl',
                  }))}
                  className="space-y-2"
                />
              </div>
            ))}
          </div>

          {/* Right Column - Report Problem & Live Chat */}
          <div className="flex w-full flex-col lg:mt-10 gap-4 lg:w-[40%]">
            <ReportProblemForm onSubmit={handleReportSubmit} />
            <LiveChatSection onStartChat={handleStartChat} />
          </div>
        </div>

      {/* Success Modal */}
      <StatusModal
        open={isSuccessModalOpen}
        title={successMessage}
        description={t('reportSubmittedDescription')}
        confirmLabel={t('confirm')}
        onConfirm={handleCloseSuccessModal}
        onClose={handleCloseSuccessModal}
        containerClassName="max-w-[560px]"
      />

      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        messageHistory={chatMessages}
        onSend={handleSendMessage}
        onSelectQuickReply={handleSelectQuickReply}
        supportName={tChat('name')}
        supportSubtitle={tChat('subtitle')}
        quickReplyChips={[
          {
            text: tChat('quickReplyChips.goodMorning'),
            onClick: () => handleSendMessage(tChat('quickReplyChips.goodMorning')),
          },
          {
            text: tChat('quickReplyChips.discussPrice'),
            onClick: () => handleSendMessage(tChat('quickReplyChips.discussPrice')),
          },
          {
            text: tChat('quickReplyChips.thankYou'),
            onClick: () => handleSendMessage(tChat('quickReplyChips.thankYou')),
          },
        ]}
      />
    </>
  )
}
