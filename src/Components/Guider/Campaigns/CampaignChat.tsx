import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import guiderService from '../../../services/guiderService';
import SEOHead from '../../SEO/SEOHead';
import { useAuth } from '../../../Hooks/useAuth';
import { requireAuth } from '../../../utils/authUtils';

export default function CampaignChat() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { campaignId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to view chat');
      navigate('/');
      return;
    }
    loadMessages();
    // Set up polling or WebSocket for real-time updates
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [campaignId, isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getGuideProfileId = () => {
    if (user?.guideProfileId) return parseInt(user.guideProfileId);
    const stored = localStorage.getItem('guideProfileId');
    return stored ? parseInt(stored) : null;
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      let guideProfileId = getGuideProfileId();
      
      if (!guideProfileId) {
        const status = await guiderService.status.get();
        if (status?.guideProfileId) {
          guideProfileId = status.guideProfileId;
          localStorage.setItem('guideProfileId', guideProfileId.toString());
        } else {
          throw new Error('No guide profile found.');
        }
      }
      
      const data = await guiderService.campaigns.getChatMessages(guideProfileId, parseInt(campaignId));
      setMessages(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error loading messages:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load messages.';
      toast.error(errorMessage);
      
      if (error?.response?.status === 401) {
        requireAuth('login', 'Please login to continue');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      requireAuth('login', 'Please login to send messages');
      return;
    }
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      const guideProfileId = getGuideProfileId();
      if (!guideProfileId) {
        throw new Error('No guide profile found.');
      }
      await guiderService.campaigns.sendChatMessage(guideProfileId, parseInt(campaignId), {
        message: newMessage,
      });
      setNewMessage('');
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <SEOHead
        title="Campaign Chat"
        description="Chat with campaign team"
        url={`${window.location.origin}/campaigns/${campaignId}/chat`}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Campaign Chat</h1>
        <Link to={`/campaigns/${campaignId}`} className="btn btn-outline-secondary">
          Back to Campaign
        </Link>
      </div>

      <div className="card" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
        <div className="card-body" style={{ flex: 1, overflowY: 'auto' }}>
          {messages.length === 0 ? (
            <div className="text-center text-muted mt-5">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="mb-3">
                <div className="d-flex justify-content-between">
                  <strong>{message.senderName || 'User'}</strong>
                  <small className="text-muted">
                    {message.createdAt ? new Date(message.createdAt).toLocaleString() : ''}
                  </small>
                </div>
                <p className="mb-0">{message.content || message.message}</p>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="card-footer">
          <form onSubmit={handleSendMessage}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={sending}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={sending || !newMessage.trim()}
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
