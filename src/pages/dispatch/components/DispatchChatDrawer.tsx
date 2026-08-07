import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Input } from '../../../components/ui';
import { FileText, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatRoomRecipient {
  partnerName: string;
  partnerType: 'driver' | 'client';
  phone: string;
  vehicleNo?: string;
}

interface DispatchChatDrawerProps {
  chatRoomRecipient: ChatRoomRecipient | null;
  activeLeftPanel: 'form' | 'chat';
  setActiveLeftPanel: (panel: 'form' | 'chat') => void;
}

const LOCAL_DEFAULT_TEMPLATES = [
  { id: 't1', category: '정산', text: '이번 운행 건 인수증 사진과 함께 세금계산서 청구 부탁드립니다.' },
  { id: 't2', category: '정산', text: '운임 정산 처리가 완료되었습니다. 다음 결제일에 등록하신 계좌로 입금 예정입니다.' },
  { id: 't3', category: '상하차', text: '상차지 주소: [상차지주소] / 하차지 주소: [하차지주소] 운행 스펙 확인하시고 이동 바랍니다.' },
  { id: 't4', category: '상하차', text: '하차 장소가 협소하여 진입 대기가 발생할 수 있으니 도착 10분 전 연락 바랍니다.' },
  { id: 't5', category: '공지', text: '운행 중 특이사항(차량 이상, 상하차 지연 등)이 발생할 경우 즉시 관제 센터로 공유 부탁드립니다.' }
];

export const DispatchChatDrawer: React.FC<DispatchChatDrawerProps> = ({
  chatRoomRecipient,
  activeLeftPanel,
  setActiveLeftPanel
}) => {
  const navigate = useNavigate();
  const [embeddedChatInput, setEmbeddedChatInput] = useState('');
  const [embeddedChatMessages, setEmbeddedChatMessages] = useState<any[]>([]);
  const [showEmbeddedTemplates, setShowEmbeddedTemplates] = useState(false);
  const [embeddedTemplates, setEmbeddedTemplates] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Sync templates dynamically via CustomEvent and localStorage
  useEffect(() => {
    const loadTemps = () => {
      const savedTemplates = localStorage.getItem('chat_templates');
      if (savedTemplates) {
        try {
          setEmbeddedTemplates(JSON.parse(savedTemplates));
        } catch (e) {
          setEmbeddedTemplates(LOCAL_DEFAULT_TEMPLATES);
        }
      } else {
        setEmbeddedTemplates(LOCAL_DEFAULT_TEMPLATES);
        localStorage.setItem('chat_templates', JSON.stringify(LOCAL_DEFAULT_TEMPLATES));
      }
    };
    loadTemps();
    window.addEventListener('chat_templates_updated', loadTemps);
    return () => window.removeEventListener('chat_templates_updated', loadTemps);
  }, []);

  // Load chat messages when recipient changes
  useEffect(() => {
    if (chatRoomRecipient) {
      const saved = localStorage.getItem('chat_logs');
      let rooms = [];
      if (saved) {
        try {
          rooms = JSON.parse(saved);
        } catch (e) {
          rooms = [];
        }
      }
      const room = rooms.find(
        (r: any) =>
          r.partnerName === chatRoomRecipient.partnerName &&
          r.partnerType === chatRoomRecipient.partnerType
      );
      if (room) {
        setEmbeddedChatMessages(room.messages);
      }
    }
  }, [chatRoomRecipient]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [embeddedChatMessages]);

  if (!chatRoomRecipient) return null;

  const handleAddEmbeddedTemplate = () => {
    const category = prompt('카테고리를 입력하세요 (예: 정산, 상하차, 공지 등):');
    if (!category) return;
    const text = prompt('상용구 내용을 입력하세요:');
    if (!text) return;

    const newTemplate = {
      id: 't_' + Date.now(),
      category: category.trim(),
      text: text.trim()
    };
    const updated = [...embeddedTemplates, newTemplate];
    setEmbeddedTemplates(updated);
    localStorage.setItem('chat_templates', JSON.stringify(updated));
    window.dispatchEvent(new Event('chat_templates_updated'));
  };

  const handleDeleteEmbeddedTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('해당 상용구를 삭제하시겠습니까?')) return;
    const updated = embeddedTemplates.filter(t => t.id !== id);
    setEmbeddedTemplates(updated);
    localStorage.setItem('chat_templates', JSON.stringify(updated));
    window.dispatchEvent(new Event('chat_templates_updated'));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!embeddedChatInput.trim()) return;

    const now = new Date();
    const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: 'm_' + Date.now(),
      sender: 'dispatcher',
      text: embeddedChatInput,
      timestamp: timestampStr
    };

    const saved = localStorage.getItem('chat_logs');
    let rooms = [];
    if (saved) {
      try {
        rooms = JSON.parse(saved);
      } catch (err) {
        rooms = [];
      }
    }
    const updatedRooms = rooms.map((r: any) => {
      if (
        r.partnerName === chatRoomRecipient.partnerName &&
        r.partnerType === chatRoomRecipient.partnerType
      ) {
        return {
          ...r,
          lastUpdated: now.toISOString(),
          messages: [...r.messages, newMsg],
          unreadCount: 0
        };
      }
      return r;
    });
    localStorage.setItem('chat_logs', JSON.stringify(updatedRooms));
    setEmbeddedChatMessages(prev => [...prev, newMsg]);
    setEmbeddedChatInput('');

    // Simulated reply after 2.5s
    setTimeout(() => {
      let replyText = '네, 확인했습니다. 운행 내용 및 정산 서류 처리 진행하겠습니다.';
      if (newMsg.text.includes('인수증')) {
        replyText = '인수증 사진 찍어서 올렸습니다. 확인 부탁드립니다.';
      } else if (newMsg.text.includes('계산서')) {
        replyText = '세금계산서 청구 완료했습니다.';
      } else if (newMsg.text.includes('위치')) {
        replyText = '거의 다 왔습니다. 목적지 입구 대기중입니다.';
      }

      const replyMsg = {
        id: 'reply_' + Date.now(),
        sender: 'partner',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const saved2 = localStorage.getItem('chat_logs');
      let rooms2 = [];
      if (saved2) {
        try {
          rooms2 = JSON.parse(saved2);
        } catch (err) {
          rooms2 = [];
        }
      }
      const updatedRooms2 = rooms2.map((r: any) => {
        if (
          r.partnerName === chatRoomRecipient.partnerName &&
          r.partnerType === chatRoomRecipient.partnerType
        ) {
          const isActive = activeLeftPanel === 'chat';
          return {
            ...r,
            lastUpdated: new Date().toISOString(),
            messages: [...r.messages, replyMsg],
            unreadCount: isActive ? 0 : (r.unreadCount || 0) + 1
          };
        }
        return r;
      });
      localStorage.setItem('chat_logs', JSON.stringify(updatedRooms2));

      setEmbeddedChatMessages(prev => [...prev, replyMsg]);

      window.dispatchEvent(
        new CustomEvent('show-toast', {
          detail: { message: `${chatRoomRecipient.partnerName}: "${replyText}"` }
        })
      );
    }, 2500);
  };

  const handleSendFile = () => {
    const now = new Date();
    const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: 'm_' + Date.now(),
      sender: 'dispatcher',
      file: { name: '인수증_배정건.jpg', type: 'receipt', url: '#' },
      timestamp: timestampStr
    };

    const saved = localStorage.getItem('chat_logs');
    let rooms = [];
    if (saved) {
      try {
        rooms = JSON.parse(saved);
      } catch (err) {
        rooms = [];
      }
    }
    const updatedRooms = rooms.map((r: any) => {
      if (
        r.partnerName === chatRoomRecipient.partnerName &&
        r.partnerType === chatRoomRecipient.partnerType
      ) {
        return {
          ...r,
          lastUpdated: now.toISOString(),
          messages: [...r.messages, newMsg],
          unreadCount: 0
        };
      }
      return r;
    });
    localStorage.setItem('chat_logs', JSON.stringify(updatedRooms));
    setEmbeddedChatMessages(prev => [...prev, newMsg]);
  };

  return (
    <div className="animate-fade-slide-up" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Card style={{ flex: 1, padding: '1.25rem', overflowY: 'hidden', display: 'flex', flexDirection: 'column', gap: '1rem', border: 'none' }}>
        <h4 style={{
          fontSize: '0.92rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.5rem',
          margin: '0'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '4px', height: '14px', backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-sm)' }}></span>
            대화방: {chatRoomRecipient.partnerName}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Button
              variant="outline"
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
              onClick={() => {
                const saved = localStorage.getItem('chat_logs');
                let rooms = [];
                if (saved) {
                  try {
                    rooms = JSON.parse(saved);
                  } catch (e) {
                    rooms = [];
                  }
                }
                const room = rooms.find(
                  (r: any) =>
                    r.partnerName === chatRoomRecipient.partnerName &&
                    r.partnerType === chatRoomRecipient.partnerType
                );
                if (room) {
                  localStorage.setItem('selected_chat_room_id', room.id);
                }
                navigate('/chats');
              }}
            >
              전체 화면
            </Button>
            <Button
              variant="secondary"
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
              onClick={() => setActiveLeftPanel('form')}
            >
              운행등록으로 복귀
            </Button>
          </div>
        </h4>

        <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{chatRoomRecipient.partnerName}</span> | {chatRoomRecipient.partnerType === 'driver' ? `차주 (${chatRoomRecipient.vehicleNo || '번호미등록'})` : '거래처'} | {chatRoomRecipient.phone}
        </div>

        <div
          ref={scrollRef}
          style={{
            flex: 1,
            padding: '0.5rem 0.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            backgroundColor: 'rgba(0, 0, 0, 0.01)'
          }}
          className="hide-scrollbar"
        >
          {embeddedChatMessages.map((msg: any, index: number) => {
            const isMyMsg = msg.sender === 'dispatcher';
            return (
              <div
                key={msg.id || index}
                style={{
                  display: 'flex',
                  justifyContent: isMyMsg ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  gap: '0.35rem'
                }}
              >
                {!isMyMsg && (
                  <div style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)' }}>{msg.timestamp}</div>
                )}
                <div style={{
                  maxWidth: '80%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  borderTopRightRadius: isMyMsg ? '2px' : 'var(--radius-md)',
                  borderTopLeftRadius: isMyMsg ? 'var(--radius-md)' : '2px',
                  backgroundColor: isMyMsg ? 'var(--primary)' : 'var(--bg-secondary)',
                  color: isMyMsg ? '#ffffff' : 'var(--text-primary)',
                  fontSize: '0.8rem',
                  lineHeight: '1.4',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {msg.text && <div>{msg.text}</div>}
                  {msg.file && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      backgroundColor: isMyMsg ? 'rgba(255, 255, 255, 0.15)' : 'var(--bg-tertiary)',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      marginTop: msg.text ? '0.35rem' : 0,
                      fontSize: '0.72rem'
                    }}>
                      <FileText size={18} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', fontWeight: 700 }}>
                          {msg.file.name}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {isMyMsg && (
                  <div style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)' }}>{msg.timestamp}</div>
                )}
              </div>
            );
          })}
        </div>

        {showEmbeddedTemplates && (
          <div style={{
            padding: '0.5rem 0.75rem',
            backgroundColor: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            maxHeight: '130px',
            overflowY: 'auto',
            marginBottom: '0.4rem',
            borderRadius: 'var(--radius-sm)'
          }} className="hide-scrollbar">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)' }}>주요 상용구 목록 (클릭 시 자동 입력)</span>
              <button
                type="button"
                onClick={handleAddEmbeddedTemplate}
                style={{
                  padding: '0.1rem 0.35rem',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer'
                }}
              >
                + 추가
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.3rem' }}>
              {embeddedTemplates.map(temp => (
                <div
                  key={temp.id}
                  onClick={() => {
                    setEmbeddedChatInput(temp.text);
                    setShowEmbeddedTemplates(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.35rem 0.5rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    fontSize: '0.74rem',
                    border: '1px solid transparent'
                  }}
                  onMouseEnter={(e: any) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e: any) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '85%', minWidth: 0 }}>
                    <span style={{
                      fontSize: '0.58rem',
                      padding: '0.05rem 0.25rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: temp.category === '정산' ? 'var(--primary-light)' : temp.category === '상하차' ? 'var(--success-light)' : 'var(--warning-light)',
                      color: temp.category === '정산' ? 'var(--primary)' : temp.category === '상하차' ? 'var(--success)' : 'var(--warning-text)',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {temp.category}
                    </span>
                    <span style={{ color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {temp.text}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteEmbeddedTemplate(temp.id, e)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--danger)',
                      fontSize: '0.68rem',
                      cursor: 'pointer',
                      padding: '0.1rem 0.25rem'
                    }}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form
          onSubmit={handleSendMessage}
          style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}
        >
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <button
              type="button"
              onClick={handleSendFile}
              title="인수증 전송"
              style={{
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem',
                cursor: 'pointer',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <FileText size={14} />
            </button>

            <button
              type="button"
              onClick={() => {
                setShowEmbeddedTemplates(!showEmbeddedTemplates);
              }}
              title="상용구 목록"
              style={{
                border: '1px solid var(--border-color)',
                backgroundColor: showEmbeddedTemplates ? 'rgba(234, 179, 8, 0.1)' : 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem',
                cursor: 'pointer',
                color: '#EAB308',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Star size={14} fill={showEmbeddedTemplates ? '#EAB308' : 'none'} style={{ color: '#EAB308' }} />
            </button>
          </div>

          <Input
            placeholder="대화 입력..."
            value={embeddedChatInput}
            onChange={(e: any) => setEmbeddedChatInput(e.target.value)}
            style={{ flex: 1, padding: '0.45rem 0.65rem', fontSize: '0.8rem' }}
          />

          <Button type="submit" variant="primary" style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}>
            전송
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default DispatchChatDrawer;
