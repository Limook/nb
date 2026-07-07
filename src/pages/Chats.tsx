import { useState, useEffect, useRef } from 'react'
import { Input, Button } from '../components/ui'
import { Send, Paperclip, FileText, Image, Search, ChevronLeft, Phone, MessageSquare, Star } from 'lucide-react'

interface Message {
  id: string
  sender: 'dispatcher' | 'partner'
  text?: string
  file?: {
    name: string
    type: 'receipt' | 'invoice' | 'photo'
    url: string
  }
  timestamp: string
}

interface ChatRoom {
  id: string
  partnerName: string
  partnerType: 'driver' | 'client'
  vehicleNo?: string
  phone: string
  messages: Message[]
  unreadCount: number
  lastUpdated: string
}

const INITIAL_CHATS: ChatRoom[] = [
  {
    id: 'room_driver_1',
    partnerName: '김차주',
    partnerType: 'driver',
    vehicleNo: '경기 80아 1234',
    phone: '010-1234-5678',
    unreadCount: 2,
    lastUpdated: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    messages: [
      { id: 'm1', sender: 'dispatcher', text: '기사님, 오늘 남양주 하차 건 도착 시간 어떻게 되실까요?', timestamp: new Date(Date.now() - 30 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { id: 'm2', sender: 'partner', text: '현재 정체 구간 지나고 있어서 14시 30분 전후로 도착 예정입니다.', timestamp: new Date(Date.now() - 25 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { id: 'm3', sender: 'partner', text: '도착하면 인수증 서명받고 연락드릴게요.', timestamp: new Date(Date.now() - 24 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]
  },
  {
    id: 'room_client_1',
    partnerName: '가온물류',
    partnerType: 'client',
    phone: '02-555-9988',
    unreadCount: 0,
    lastUpdated: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    messages: [
      { id: 'c1', sender: 'partner', text: '대리님, 5톤 윙바디 차량 수배 완료되었을까요?', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { id: 'c2', sender: 'dispatcher', text: '네, 고양행 차량 배정 완료되었습니다. 운행 시작했습니다.', timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { id: 'c3', sender: 'partner', text: '감사합니다. 전자세금계산서 청구 건도 같이 확인 부탁드릴게요.', timestamp: new Date(Date.now() - 30 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]
  },
  {
    id: 'room_driver_2',
    partnerName: '박차주',
    partnerType: 'driver',
    vehicleNo: '서울 81바 1001',
    phone: '010-8811-0022',
    unreadCount: 0,
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    messages: [
      { id: 'p1', sender: 'dispatcher', text: '인수증 등록 지연건이 있어서 연락드렸습니다.', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      { id: 'p2', sender: 'partner', text: '아 네, 지금 첨부해서 보내드립니다!', timestamp: new Date(Date.now() - 4.5 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      {
        id: 'p3',
        sender: 'partner',
        file: { name: '인수증_수원영통.jpg', type: 'receipt', url: '#' },
        timestamp: new Date(Date.now() - 4.4 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      { id: 'p4', sender: 'dispatcher', text: '정상 확인되었습니다. 감사합니다.', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]
  }
]

const DEFAULT_TEMPLATES = [
  { id: 't1', category: '정산', text: '이번 운행 건 인수증 사진과 함께 세금계산서 청구 부탁드립니다.' },
  { id: 't2', category: '정산', text: '운임 정산 처리가 완료되었습니다. 다음 결제일에 등록하신 계좌로 입금 예정입니다.' },
  { id: 't3', category: '상하차', text: '상차지 주소: [상차지주소] / 하차지 주소: [하차지주소] 운행 스펙 확인하시고 이동 바랍니다.' },
  { id: 't4', category: '상하차', text: '하차 장소가 협소하여 진입 대기가 발생할 수 있으니 도착 10분 전 연락 바랍니다.' },
  { id: 't5', category: '공지', text: '운행 중 특이사항(차량 이상, 상하차 지연 등)이 발생할 경우 즉시 관제 센터로 공유 부탁드립니다.' }
]

export default function Chats() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [showFileMenu, setShowFileMenu] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [templates, setTemplates] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load chat rooms and templates from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('chat_logs')
    if (saved) {
      try {
        setChatRooms(JSON.parse(saved))
      } catch (e) {
        setChatRooms(INITIAL_CHATS)
      }
    } else {
      setChatRooms(INITIAL_CHATS)
      localStorage.setItem('chat_logs', JSON.stringify(INITIAL_CHATS))
    }

    const savedTemplates = localStorage.getItem('chat_templates')
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates))
      } catch (e) {
        setTemplates(DEFAULT_TEMPLATES)
      }
    } else {
      setTemplates(DEFAULT_TEMPLATES)
      localStorage.setItem('chat_templates', JSON.stringify(DEFAULT_TEMPLATES))
    }

    const activeId = localStorage.getItem('selected_chat_room_id')
    if (activeId) {
      setSelectedRoomId(activeId)
      localStorage.removeItem('selected_chat_room_id')
    }
  }, [])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedRoomId, chatRooms])

  // Select active room
  const activeRoom = chatRooms.find(r => r.id === selectedRoomId) || null

  // Clear unread badge on open
  useEffect(() => {
    if (selectedRoomId) {
      localStorage.setItem('active_chat_room_id', selectedRoomId)
      setChatRooms(prev => {
        const updated = prev.map(r => r.id === selectedRoomId ? { ...r, unreadCount: 0 } : r)
        localStorage.setItem('chat_logs', JSON.stringify(updated))
        return updated
      })
    } else {
      localStorage.removeItem('active_chat_room_id')
    }
  }, [selectedRoomId])

  // Cleanup active room ID tracking on unmount
  useEffect(() => {
    return () => {
      localStorage.removeItem('active_chat_room_id')
    }
  }, [])

  // Filtered and sorted rooms (Unread first, then newest first)
  const filteredRooms = chatRooms
    .filter(r => 
      r.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.vehicleNo && r.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      const unreadA = a.unreadCount > 0 ? 1 : 0
      const unreadB = b.unreadCount > 0 ? 1 : 0
      if (unreadA !== unreadB) {
        return unreadB - unreadA
      }
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    })

  const saveRooms = (updated: ChatRoom[]) => {
    setChatRooms(updated)
    localStorage.setItem('chat_logs', JSON.stringify(updated))
  }

  // Trigger global incoming message notification
  const triggerGlobalNotification = (partnerName: string, text: string) => {
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: { message: `${partnerName}: "${text}"` }
    }))
  }

  // Send text message
  const handleSendMessage = (text?: string, file?: Message['file']) => {
    if (!selectedRoomId) return
    if (!text && !file) return

    const roomIdWhenSent = selectedRoomId
    const now = new Date()
    const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const newMsg: Message = {
      id: 'm_' + Date.now(),
      sender: 'dispatcher',
      text,
      file,
      timestamp: timestampStr
    }

    const updated = chatRooms.map(room => {
      if (room.id === roomIdWhenSent) {
        return {
          ...room,
          lastUpdated: now.toISOString(),
          messages: [...room.messages, newMsg]
        }
      }
      return room
    })
    saveRooms(updated)
    setMessageInput('')
    setShowFileMenu(false)

    // Simulate reply after 2.5 seconds
    setTimeout(() => {
      const room = updated.find(r => r.id === roomIdWhenSent)
      if (!room) return

      let replyText = '내용 확인했습니다. 안전하게 배송하겠습니다!'
      let replyFile: Message['file'] | undefined = undefined

      if (file) {
        if (file.type === 'receipt') {
          replyText = '인수증 사진 정상 등록되었습니다. 운임 정산 요청 진행하겠습니다.'
        } else if (file.type === 'invoice') {
          replyText = '발행하신 세금계산서 접수 완료되었습니다. 정해진 결제일에 입금 예정입니다.'
        } else {
          replyText = '보내주신 현장 사진 확인했습니다. 신속히 하차 지원하겠습니다.'
        }
      } else if (text && text.includes('인수증')) {
        replyText = '인수증 사진 보냅니다.'
        replyFile = { name: '인수증_배송완료.jpg', type: 'receipt', url: '#' }
      } else if (text && text.includes('계산서')) {
        replyText = '세금계산서 첨부 파일 확인 부탁드립니다.'
        replyFile = { name: '세금계산서_가온.pdf', type: 'invoice', url: '#' }
      } else if (text && (text.includes('어디') || text.includes('위치'))) {
        replyText = '현재 경부고속도로 안성IC 부근 지나고 있습니다. 30분 내 도착합니다.'
      }

      const replyMsg: Message = {
        id: 'reply_' + Date.now(),
        sender: 'partner',
        text: replyFile ? undefined : replyText,
        file: replyFile,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      // Read current state values inside timeout to handle dynamic room switches correctly
      setChatRooms(prevRooms => {
        const withReply = prevRooms.map(r => {
          if (r.id === roomIdWhenSent) {
            // Read active selection ref at timeout execution time
            const isActive = window.location.pathname.includes('/chats') && (localStorage.getItem('active_chat_room_id') === roomIdWhenSent)
            // Wait, we can just use the state variable selectedRoomId if we reference it correctly, 
            // but react closures capture the initial selectedRoomId value!
            // To bypass closures, we can store selectedRoomId in a global ref or read from active state updater function:
            // Yes, standard React way is using functional state updater:
            return {
              ...r,
              lastUpdated: new Date().toISOString(),
              messages: [...r.messages, replyMsg],
              unreadCount: isActive ? 0 : (r.unreadCount + 1)
            }
          }
          return r
        })
        localStorage.setItem('chat_logs', JSON.stringify(withReply))
        return withReply
      })
      triggerGlobalNotification(room.partnerName, replyFile ? `${replyFile.name} 첨부파일` : replyText)
    }, 2500)
  }

  // Handle mock file uploads
  const handleAttachMockFile = (type: 'receipt' | 'invoice' | 'photo') => {
    let name = '인수증_영수.jpg'
    if (type === 'invoice') name = '세금계산서_청구.pdf'
    if (type === 'photo') name = '적재함_현장사진.jpg'

    handleSendMessage(undefined, {
      name,
      type,
      url: '#'
    })
  }

  const handleAddTemplate = () => {
    const category = prompt('카테고리를 입력하세요 (예: 정산, 상하차, 공지 등):')
    if (!category) return
    const text = prompt('상용구 내용을 입력하세요:')
    if (!text) return

    const newTemplate = {
      id: 't_' + Date.now(),
      category: category.trim(),
      text: text.trim()
    }
    const updated = [...templates, newTemplate]
    setTemplates(updated)
    localStorage.setItem('chat_templates', JSON.stringify(updated))
  }

  const handleDeleteTemplate = (id: string, e: any) => {
    e.stopPropagation()
    if (!confirm('해당 상용구를 삭제하시겠습니까?')) return
    const updated = templates.filter(t => t.id !== id)
    setTemplates(updated)
    localStorage.setItem('chat_templates', JSON.stringify(updated))
  }

  return (
    <div className="chat-layout-container">
      
      {/* Left Chatroom List */}
      <div className={`chat-left-area ${selectedRoomId ? 'mobile-hidden' : 'mobile-visible'}`}>
        
        {/* Search Header */}
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>대화방</h3>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <Input
              placeholder="대화방 이름, 차량번호 검색"
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2rem', fontSize: '0.8rem' }}
            />
          </div>
        </div>

        {/* Room List Scrollable */}
        <div style={{ flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
          {filteredRooms.map(room => {
            const lastMsg = room.messages[room.messages.length - 1]
            return (
              <div
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  backgroundColor: selectedRoomId === room.id ? 'var(--bg-tertiary)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'background-color var(--transition-fast)'
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: room.partnerType === 'driver' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(49, 130, 246, 0.1)',
                  color: room.partnerType === 'driver' ? 'var(--success)' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  flexShrink: 0
                }}>
                  {room.partnerName.slice(0, 2)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>{room.partnerName}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>
                      {lastMsg ? lastMsg.timestamp : ''}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.15rem' }}>
                    <span style={{
                      fontSize: '0.62rem',
                      padding: '0.05rem 0.3rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: room.partnerType === 'driver' ? 'var(--success-light)' : 'var(--primary-light)',
                      color: room.partnerType === 'driver' ? 'var(--success)' : 'var(--primary)',
                      fontWeight: 700
                    }}>
                      {room.partnerType === 'driver' ? '차주' : '거래처'}
                    </span>
                    {room.vehicleNo && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{room.vehicleNo}</span>
                    )}
                  </div>

                  <p style={{
                    fontSize: '0.76rem',
                    color: 'var(--text-secondary)',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    margin: 0
                  }}>
                    {lastMsg ? (lastMsg.file ? `📎 [파일 첨부] ${lastMsg.file.name}` : lastMsg.text) : '대화 내역이 없습니다.'}
                  </p>
                </div>

                {room.unreadCount > 0 && (
                  <div style={{
                    minWidth: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--danger)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0 0.25rem'
                  }}>
                    {room.unreadCount}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Right Conversation Window */}
      <div className={`chat-right-area ${selectedRoomId ? 'mobile-visible' : 'mobile-hidden'}`}>
        {activeRoom ? (
          <>
            {/* Top Bar Header */}
            <div style={{
              padding: '0.75rem 1.25rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-secondary)',
              zIndex: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Button
                  variant="outline"
                  className="chat-back-button"
                  style={{ padding: '0.35rem 0.5rem' }}
                  onClick={() => setSelectedRoomId(null)}
                >
                  <ChevronLeft size={16} /> 목록
                </Button>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{activeRoom.partnerName}</h4>
                    <span style={{
                      fontSize: '0.62rem',
                      padding: '0.05rem 0.3rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: activeRoom.partnerType === 'driver' ? 'var(--success-light)' : 'var(--primary-light)',
                      color: activeRoom.partnerType === 'driver' ? 'var(--success)' : 'var(--primary)',
                      fontWeight: 700
                    }}>
                      {activeRoom.partnerType === 'driver' ? `차주 (${activeRoom.vehicleNo})` : '거래처'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                    {activeRoom.phone}
                  </div>
                </div>
              </div>
              <div>
                <Button
                  variant="outline"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  onClick={() => window.open(`tel:${activeRoom.phone}`)}
                >
                  <Phone size={14} /> 전화 연결
                </Button>
              </div>
            </div>

            {/* Conversation Feed */}
            <div style={{
              flex: 1,
              padding: '1.25rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              backgroundColor: 'var(--bg-primary)'
            }} className="hide-scrollbar">
              {activeRoom.messages.map((msg, index) => {
                const isMyMsg = msg.sender === 'dispatcher'
                return (
                  <div
                    key={msg.id || index}
                    style={{
                      display: 'flex',
                      justifyContent: isMyMsg ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-end',
                      gap: '0.4rem'
                    }}
                  >
                    {!isMyMsg && (
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginBottom: '0.1rem' }}>
                        {msg.timestamp}
                      </div>
                    )}
                    <div style={{
                      maxWidth: '70%',
                      padding: '0.65rem 0.9rem',
                      borderRadius: 'var(--radius-lg)',
                      borderTopRightRadius: isMyMsg ? '2px' : 'var(--radius-lg)',
                      borderTopLeftRadius: isMyMsg ? 'var(--radius-lg)' : '2px',
                      backgroundColor: isMyMsg ? 'var(--primary)' : 'var(--bg-secondary)',
                      color: isMyMsg ? '#ffffff' : 'var(--text-primary)',
                      fontSize: '0.82rem',
                      lineHeight: '1.45',
                      boxShadow: 'var(--shadow-sm)',
                      border: isMyMsg ? 'none' : '1px solid var(--border-color)'
                    }}>
                      {msg.text && <div>{msg.text}</div>}
                      {msg.file && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          backgroundColor: isMyMsg ? 'rgba(255, 255, 255, 0.15)' : 'var(--bg-tertiary)',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          marginTop: msg.text ? '0.5rem' : 0,
                          fontSize: '0.78rem'
                        }}>
                          <FileText size={20} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', fontWeight: 700 }}>
                              {msg.file.name}
                            </div>
                            <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>
                              {msg.file.type === 'receipt' ? '화물 인수증' : msg.file.type === 'invoice' ? '세금계산서' : '현장 사진'}
                            </span>
                          </div>
                          <Button
                            variant="secondary"
                            style={{
                              padding: '0.15rem 0.45rem',
                              fontSize: '0.68rem',
                              backgroundColor: isMyMsg ? 'rgba(255,255,255,0.2)' : 'var(--bg-secondary)',
                              color: isMyMsg ? '#ffffff' : 'var(--text-primary)',
                              border: 'none'
                            }}
                            onClick={() => alert('문서를 내려받습니다.')}
                          >
                            보기
                          </Button>
                        </div>
                      )}
                    </div>
                    {isMyMsg && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.1rem' }}>
                        <span style={{ fontSize: '0.6rem', color: 'var(--success)', fontWeight: 700 }}>읽음</span>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>
                          {msg.timestamp}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input & Attachments Section */}
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              
              {/* File Attachment Dropup Menu */}
              {showFileMenu && (
                <>
                  <div
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }}
                    onClick={() => setShowFileMenu(false)}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '75px',
                    left: '1.25rem',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0.25rem 0',
                    zIndex: 100
                  }}>
                    <button
                      onClick={() => handleAttachMockFile('receipt')}
                      style={{
                        padding: '0.5rem 1rem',
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'left',
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseEnter={(e: any) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                      onMouseLeave={(e: any) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <FileText size={14} style={{ color: 'var(--success)' }} /> 인수증 전송
                    </button>
                    <button
                      onClick={() => handleAttachMockFile('invoice')}
                      style={{
                        padding: '0.5rem 1rem',
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'left',
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseEnter={(e: any) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                      onMouseLeave={(e: any) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <FileText size={14} style={{ color: 'var(--primary)' }} /> 세금계산서 전송
                    </button>
                    <button
                      onClick={() => handleAttachMockFile('photo')}
                      style={{
                        padding: '0.5rem 1rem',
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'left',
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseEnter={(e: any) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                      onMouseLeave={(e: any) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Image size={14} style={{ color: 'var(--warning)' }} /> 현장사진 전송
                    </button>
                  </div>
                </>
              )}

              {/* Templates Drawer */}
              {showTemplates && (
                <div style={{
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderTop: '1px solid var(--border-color)',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  marginBottom: '0.5rem',
                  borderRadius: 'var(--radius-sm)'
                }} className="hide-scrollbar">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-secondary)' }}>주요 상용구 목록 (클릭 시 자동 입력)</span>
                    <button
                      type="button"
                      onClick={handleAddTemplate}
                      style={{
                        padding: '0.15rem 0.45rem',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      + 신규 추가
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {templates.map(temp => (
                      <div
                        key={temp.id}
                        onClick={() => {
                          setMessageInput(temp.text);
                          setShowTemplates(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.45rem 0.65rem',
                          backgroundColor: 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
                          fontSize: '0.78rem',
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '90%', minWidth: 0 }}>
                          <span style={{
                            fontSize: '0.62rem',
                            padding: '0.05rem 0.3rem',
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
                          onClick={(e: any) => handleDeleteTemplate(temp.id, e)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--danger)',
                            fontSize: '0.74rem',
                            cursor: 'pointer',
                            padding: '0.1rem 0.3rem'
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (messageInput.trim()) {
                    handleSendMessage(messageInput)
                  }
                }}
                style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowFileMenu(!showFileMenu);
                    setShowTemplates(false);
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-color)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e: any) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                  onMouseLeave={(e: any) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Paperclip size={16} />
                </button>

                {/* Canned Templates Trigger (Yellow Star Button) */}
                <button
                  type="button"
                  onClick={() => {
                    setShowTemplates(!showTemplates);
                    setShowFileMenu(false);
                  }}
                  style={{
                    backgroundColor: showTemplates ? 'rgba(234, 179, 8, 0.1)' : 'transparent',
                    border: '1px solid var(--border-color)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: showTemplates ? '#EAB308' : 'var(--text-secondary)',
                    transition: 'all var(--transition-fast)'
                  }}
                  title="상용구 목록"
                >
                  <Star size={16} fill={showTemplates ? '#EAB308' : 'none'} style={{ color: '#EAB308' }} />
                </button>

                <Input
                  placeholder="메시지를 입력하세요 (예: 인수증 발송 요청)"
                  value={messageInput}
                  onChange={(e: any) => setMessageInput(e.target.value)}
                  style={{ flex: 1, padding: '0.55rem 0.75rem', fontSize: '0.82rem' }}
                />

                <Button
                  type="submit"
                  variant="primary"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Send size={15} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
            <MessageSquare size={48} style={{ opacity: 0.25, marginBottom: '0.75rem' }} />
            <p style={{ fontSize: '0.88rem' }}>채팅을 진행할 대화방을 선택해 주세요.</p>
          </div>
        )}
      </div>

    </div>
  )
}
