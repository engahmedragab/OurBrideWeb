'use client'

import { useState } from 'react'
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
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState(
    'Report Submitted Successfully'
  )
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

  const handleReportSubmit = (data: {
    problemType: string
    description: string
  }) => {
    // Check if problemType or description has text
    // If problemType is 'Other', description is required
    const hasProblemType =
      data.problemType && data.problemType.trim().length > 0
    const hasDescription =
      data.description && data.description.trim().length > 0
    const isOther = data.problemType === 'Other'

    if (isOther) {
      // If 'Other' is selected, description is required
      if (hasDescription) {
        // Handle form submission
        console.log('Report submitted:', data)
        // Show success modal
        setSuccessMessage('Report Submitted Successfully')
        setIsSuccessModalOpen(true)
      }
    } else if (hasProblemType || hasDescription) {
      // For other problem types, either problemType or description is enough
      // Handle form submission
      console.log('Report submitted:', data)
      // Show success modal
      setSuccessMessage('Report Submitted Successfully')
      setIsSuccessModalOpen(true)
    }
  }

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false)
  }

  const handleStartChat = () => {
    setIsChatModalOpen(true)
    // Initialize with first support message if no messages exist
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          id: '1',
          message: 'Hello,\nhow can We help you today ?',
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
            'Booking issue',
            'Service provider issue',
            'Payment issue',
            'Technical problem',
            'Other',
          ],
        },
      ])
    }
  }

  const handleSendMessage = async (message?: string, audioBlob?: Blob) => {
    // If it's a voice message, handle the audio blob
    if (audioBlob) {
      // Convert blob to File for backend
      const audioFile = new File([audioBlob], 'voice-message.webm', {
        type: 'audio/webm',
      })

      // Create FormData to send to backend
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

    // Calculate audio duration if it's a voice message
    let audioDuration = 0
    if (audioBlob) {
      // Create a temporary audio element to get duration
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      // Wait for metadata to load
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

    // Simulate support response after a delay
    setTimeout(() => {
      const supportResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message:
          'Your request has been submitted. A customer support representative will contact you within a few minutes.\nPlease do not close this window.\n\nClient Number: 50\nPeople Ahead of You: 2',
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
      // Mark user message as seen
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

  // FAQ Data organized by categories
  const faqCategories = [
    {
      title: 'Account & Profile',
      items: [
        {
          question: 'How do I create an account?',
          answer:
            'Download the OurBride app, click Sign Up, and fill in your details. You can also register using Google, Facebook, or Apple.',
        },
        {
          question: 'How do I reset my password?',
          answer:
            'Go to Settings → Security → Change Password. Enter your old password, then create and confirm your new one.',
        },
      ],
    },
    {
      title: 'Bookings & Services',
      items: [
        {
          question: 'How do I book a service?',
          answer:
            "Browse services, choose a provider, select a date, and click Book Now. You'll receive confirmation once the provider accepts.",
        },
        {
          question: 'Can I cancel or reschedule a booking?',
          answer:
            "Yes, go to My Bookings, select the booking, and choose Cancel or Reschedule. Please check the provider's cancellation policy first.",
        },
        {
          question: 'How do I track my booking request?',
          answer:
            "Open My Bookings → select your request. You'll see the status: Submitted → Under Review → Confirmed → Payment Due.",
        },
      ],
    },
    {
      title: 'Payments',
      items: [
        {
          question: 'What payment methods are accepted?',
          answer:
            'We support credit/debit cards, mobile wallets, and bank transfers depending on your region.',
        },
      ],
    },
    {
      title: 'Offers & Coupons',
      items: [
        {
          question: 'How do I apply a coupon?',
          answer:
            'At checkout, enter your coupon code in the Apply Coupon field. The discount will be applied automatically.',
        },
        {
          question: 'Why is my coupon not working?',
          answer:
            "Make sure the coupon hasn't expired, applies to the selected service, and meets the minimum order amount.",
        },
      ],
    },
    {
      title: 'Trust & Safety',
      items: [
        {
          question: 'How are service providers verified?',
          answer:
            'Every provider must upload valid ID and service documents. Verified providers have a ✅ badge next to their name.',
        },
        {
          question: 'Are my payments secure?',
          answer:
            'Yes, all transactions are processed through encrypted payment gateways to protect your data.',
        },
        {
          question: 'Can I report a problem with a provider?',
          answer:
            "Yes, go to the provider's profile or your booking details, click Report a Problem, and describe the issue.",
        },
      ],
    },
  ]

  return (
    <>
      <div className=" mx-auto  py-8 ">
        {/* Page Title */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-20 lg:text-24 font-normal leading-8 lg:leading-10 text-black">
            Frequently Asked Questions ( FAQ )
          </h1>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          {/* Left Column - FAQ Accordion - 3/4 width */}
          <div className="w-full space-y-4 lg:w-[60%] ">
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

          {/* Right Column - Report Problem & Live Chat - 1/4 width */}
          <div className="flex w-full flex-col lg:mt-10 gap-4 lg:w-[40%] ">
            {/* Report Problem Form */}
            <ReportProblemForm onSubmit={handleReportSubmit} />

            {/* Live Chat Section */}
            <LiveChatSection onStartChat={handleStartChat} />
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <StatusModal
        open={isSuccessModalOpen}
        title={successMessage}
        description="Thank you! Your report has been submitted and our team will review it shortly"
        confirmLabel="Confirm"
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
        supportName="Our Bride Help Center"
        supportSubtitle="We usually respond within a few minutes."
        quickReplyChips={[
          {
            text: 'Good Morning',
            onClick: () => handleSendMessage('Good Morning'),
          },
          {
            text: 'Can we discuss the price?',
            onClick: () => handleSendMessage('Can we discuss the price?'),
          },
          { text: 'Thank you', onClick: () => handleSendMessage('Thank you') },
        ]}
      />
    </>
  )
}

