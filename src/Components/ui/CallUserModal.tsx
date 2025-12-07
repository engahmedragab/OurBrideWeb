import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { X, PhoneCall, Volume2, VolumeX, Mic, MicOff } from 'lucide-react'

export interface CallUserModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
  userAvatar?: string
  incoming?: boolean
  onAnswerCall?: () => void
  onEndCall?: () => void
  active?: boolean // new: live call mode, timer, toggles
}

// AVATAR + RIPPLE helper (to ensure DRY):
function AnimatedAvatar({ userAvatar, userName }: { userAvatar?: string, userName: string }) {
  return (
    <div className="relative flex items-center justify-center mt-2">
      <span
        className="absolute rounded-full animate-callRipple bg-brand-50 w-40 h-40"
        style={{ animationDelay: '0s' }}
      />
      <span
        className="absolute rounded-full animate-callRipple bg-brand-100 w-36 h-36"
        style={{ animationDelay: '0.4s' }}
      />
      <span
        className="absolute rounded-full animate-callRipple bg-brand-200 w-32 h-32"
        style={{ animationDelay: '0.8s' }}
      />
      {userAvatar ? (
        <img
          src={userAvatar}
          alt={userName}
          className="w-24 h-24 rounded-full object-cover relative z-10"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-32 font-normal text-gray-500 relative z-10">
          {userName?.charAt(0)}
        </div>
      )}
    </div>
  )
}

export const CallUserModal = ({
  isOpen,
  onClose,
  userName,
  userAvatar,
  incoming = false,
  onAnswerCall,
  onEndCall,
  active = false,
}: CallUserModalProps) => {
  // State for outgoing call
  const [mode, setMode] = useState<'idle' | 'calling'>('idle')
  // Live call state
  const [elapsed, setElapsed] = useState(0)
  const [speakerOn, setSpeakerOn] = useState(false)
  const [micOn, setMicOn] = useState(true)

  // Reset timer when call starts or modal opens
  useEffect(() => {
    if (active && isOpen) setElapsed(0)
  }, [active, isOpen])

  useEffect(() => {
    if (!active || !isOpen) return
    const interval = setInterval(() => setElapsed((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [active, isOpen])

  // Format timer as MM : SS
  const timerText = `${String(Math.floor(elapsed / 60)).padStart(2, '0')} : ${String(elapsed % 60).padStart(2, '0')}`

  // --- LIVE CALL/ACTIVE MODE ---
  if (active) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Calling"
        maxWidth="sm"
        showCloseButton
        containerClassName="w-full max-w-[380px]"
        contentClassName="px-6 pb-6 pt-0"
      >
        <div className="flex flex-col items-center gap-6">
          <AnimatedAvatar userAvatar={userAvatar} userName={userName} />
          {/* Name */}
          <h3 className="text-18 font-normal text-gray-900 mt-2">{userName}</h3>
          {/* Timer */}
          <div className="text-24 font-semibold text-gray-900 select-none" style={{letterSpacing: 2}}>{timerText}</div>
          {/* Controls Row -- Speaker & Mic */}
          <div className="flex items-center justify-center gap-12 mt-3 mb-2">
            <button
              type="button"
              onClick={() => setSpeakerOn(v => !v)}
              aria-label="Toggle speaker"
              className="flex flex-col items-center gap-1.5 focus:outline-none"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                speakerOn ? 'bg-brand-500' : 'bg-gray-100'
              }`}>
                {speakerOn
                  ? <Volume2 className="w-6 h-6 text-white" />
                  : <VolumeX className="w-6 h-6 text-gray-400" />}
              </div>
              <span className={`text-11 font-normal ${speakerOn ? 'text-brand-500' : 'text-gray-400'}`}>
                {speakerOn ? 'Speakers On' : 'Speakers Off'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMicOn(v => !v)}
              aria-label="Toggle mic"
              className="flex flex-col items-center gap-1.5 focus:outline-none"
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                micOn ? 'bg-brand-500' : 'bg-gray-100'
              }`}>
                {micOn
                  ? <Mic className="w-6 h-6 text-white" />
                  : <MicOff className="w-6 h-6 text-gray-400" />}
              </div>
              <span className={`text-11 font-normal ${micOn ? 'text-brand-500' : 'text-gray-400'}`}>
                {micOn ? 'Mic On' : 'Mic Off'}
              </span>
            </button>
          </div>
          {/* End Call Button */}
          <Button
            variant="destructive"
            size="lg"
            onClick={onEndCall || onClose}
            className="w-1/2 rounded-full flex items-center gap-2 justify-center py-3 text-white"
          >
            <X className="w-6 h-6 mr-1" />
            End Call
          </Button>
        </div>
        <style>{`
  .animate-callRipple {
    animation: callRipple 1.8s cubic-bezier(0.21, 0.78, 0.37, 0.89) infinite;
  }
  @keyframes callRipple {
    0% {
      opacity: 0.7;
      transform: scale(0.8);
    }
    70% {
      opacity: 0.24;
      transform: scale(1.12);
    }
    100% {
      opacity: 0;
      transform: scale(1.28);
    }
  }
`}</style>
      </Modal>
    )
  }

  // --- INCOMING MODE ---
  if (incoming) {
    // Incoming call modal (remote side sees this and can answer/decline)
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Calling"
        maxWidth="sm"
        showCloseButton
        containerClassName="w-full max-w-[380px]"
        contentClassName="px-6 pb-6 pt-0"
      >
        <div className="flex flex-col items-center gap-6">
          <AnimatedAvatar userAvatar={userAvatar} userName={userName} />
          {/* User Name */}
          <h3 className="text-18 font-normal text-gray-900 mt-2">{userName}</h3>
          <div className="text-16 font-normal mb-2">Is Calling</div>
          <div className="flex w-full gap-4 mt-1">
            <Button
              variant="success"
              size="lg"
              onClick={onAnswerCall}
              className="w-1/2 rounded-full flex items-center gap-2 justify-center py-3 text-white"
            >
              <PhoneCall className="w-6 h-6 mr-1" />
              Answer
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={onEndCall || onClose}
              className="w-1/2 rounded-full flex items-center gap-2 justify-center py-3 text-white"
            >
              <X className="w-6 h-6 mr-1" />
              End Call
            </Button>
          </div>
        </div>
        <style>{`
  .animate-callRipple {
    animation: callRipple 1.8s cubic-bezier(0.21, 0.78, 0.37, 0.89) infinite;
  }
  @keyframes callRipple {
    0% {
      opacity: 0.7;
      transform: scale(0.8);
    }
    70% {
      opacity: 0.24;
      transform: scale(1.12);
    }
    100% {
      opacity: 0;
      transform: scale(1.28);
    }
  }
`}</style>
      </Modal>
    )
  }

  // --- OUTGOING (DEFAULT) ---
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Calling"
      maxWidth="sm"
      showCloseButton
      containerClassName="w-full max-w-[380px]"
      contentClassName="px-6 pb-6 pt-0"
    >
      {mode === 'idle' ? (
        <div className="flex flex-col items-center gap-6">
          {/* Avatar */}
          <AnimatedAvatar userAvatar={userAvatar} userName={userName} />
          {/* Title and note */}
          <h3 className="text-16 font-normal text-gray-900 mt-4">Call {userName} ?</h3>
          <p className="text-14 text-center text-gray-400 leading-relaxed max-w-xs">
            Please note that all calls made through OurBride are recorded to
            ensure your safety, security, and protection of your rights.
          </p>
          {/* Start Call Button */}
          <Button
            variant="brand"
            size="lg"
            onClick={() => setMode('calling')}
            className="w-full text-white rounded-full py-3 text-white"
          >
            Start Call
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          {/* Animated Avatar with Ripple */}
          <AnimatedAvatar userAvatar={userAvatar} userName={userName} />
          {/* User Name */}
          <h3 className="text-18 font-normal text-gray-900 mt-2">{userName}</h3>
          <div className="text-16 font-normal mb-2">Calling...</div>
          <Button
            variant="destructive"
            size="lg"
            onClick={() => { setMode('idle'); onClose(); }}
            className=" rounded-full text-white font-normal flex items-center justify-center gap-2 py-3 text-white"
          >
            <X className="w-6 h-6 mr-2" />
            End Call
          </Button>
        </div>
      )}
      <style>{`
  .animate-callRipple {
    animation: callRipple 1.8s cubic-bezier(0.21, 0.78, 0.37, 0.89) infinite;
  }
  @keyframes callRipple {
    0% {
      opacity: 0.7;
      transform: scale(0.8);
    }
    70% {
      opacity: 0.24;
      transform: scale(1.12);
    }
    100% {
      opacity: 0;
      transform: scale(1.28);
    }
  }
`}</style>
    </Modal>
  )
}
