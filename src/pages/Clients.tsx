import React, { useState } from 'react'
import { Card, Button, Input, Badge } from '../components/ui'
import { Plus, Search, MoreVertical, Check, Trash2, Edit, X, MapPin } from 'lucide-react'

interface Client {
  id: number
  name: string
  phone: string
  address: string
  businessNo: string
  ceoName: string
  ceoPhone: string
  contactName: string
  contactPhone: string
  origins: string[]
  destinations: string[]
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('clients')
    return saved ? JSON.parse(saved) : [
  {
    "id": 1,
    "name": "가온물류",
    "phone": "02-345-6789",
    "address": "서울 마포구 테헤란로 12",
    "businessNo": "101-81-23456",
    "ceoName": "김가온",
    "ceoPhone": "010-1234-1001",
    "contactName": "박대리",
    "contactPhone": "010-1234-2001",
    "origins": [
      "서울 마포구 독막로",
      "경기 김포시 고촌읍",
      "인천 중구 서해대로"
    ],
    "destinations": [
      "부산 해운대구 우동",
      "경북 구미시 3공단로",
      "전남 여수시 여수산단로"
    ]
  },
  {
    "id": 2,
    "name": "나래물산",
    "phone": "031-701-2345",
    "address": "경기 성남시 분당구 판교로 242",
    "businessNo": "202-82-34567",
    "ceoName": "이나래",
    "ceoPhone": "010-2345-1002",
    "contactName": "최과장",
    "contactPhone": "010-2345-2002",
    "origins": [
      "경기 성남시 분당구",
      "경기 화성시 동탄산단로",
      "경기 평택시 포승읍"
    ],
    "destinations": [
      "울산 남구 산단로",
      "충남 천안시 서북구",
      "대구 달서구 성서공단로"
    ]
  },
  {
    "id": 3,
    "name": "다솜유통",
    "phone": "032-811-0987",
    "address": "인천 연수구 송도문화로 119",
    "businessNo": "303-83-45678",
    "ceoName": "박다솜",
    "ceoPhone": "010-3456-1003",
    "contactName": "정주임",
    "contactPhone": "010-3456-2003",
    "origins": [
      "인천 연수구 송도과학로",
      "인천 중구 아암대로",
      "경기 안산시 단원구"
    ],
    "destinations": [
      "경남 창원시 성산구",
      "경기 파주시 문산읍",
      "충북 청주시 흥덕구"
    ]
  },
  {
    "id": 4,
    "name": "라온제나",
    "phone": "02-789-0123",
    "address": "서울 영등포구 여의대로 108",
    "businessNo": "404-84-56789",
    "ceoName": "최라온",
    "ceoPhone": "010-4567-1004",
    "contactName": "이대리",
    "contactPhone": "010-4567-2004",
    "origins": [
      "서울 영등포구 여의나루로",
      "서울 성동구 아차산로",
      "경기 김포시 대곶면"
    ],
    "destinations": [
      "광주 광산구 하남산단로",
      "부산 강서구 녹산산단로",
      "충남 아산시 배방읍"
    ]
  },
  {
    "id": 5,
    "name": "마루아라",
    "phone": "051-505-1122",
    "address": "부산 중구 중앙대로 55",
    "businessNo": "505-85-67890",
    "ceoName": "정마루",
    "ceoPhone": "010-5678-1005",
    "contactName": "조과장",
    "contactPhone": "010-5678-2005",
    "origins": [
      "부산 사하구 신평로",
      "부산 강서구 과학산단로",
      "경남 양산시 어곡산단로"
    ],
    "destinations": [
      "서울 영등포구 경인로",
      "경기 평택시 경기대로",
      "경북 포항시 남구 괴동로"
    ]
  },
  {
    "id": 6,
    "name": "바른로지스",
    "phone": "042-482-1234",
    "address": "대전 서구 대덕대로 189",
    "businessNo": "606-86-78901",
    "ceoName": "강바른",
    "ceoPhone": "010-6789-1006",
    "contactName": "윤주임",
    "contactPhone": "010-6789-2006",
    "origins": [
      "대전 대덕구 대화로",
      "충북 청주시 청원구",
      "세종 연서면 공단로"
    ],
    "destinations": [
      "서울 금천구 가산디지털로",
      "경기 이천시 대장로",
      "경남 창원시 진해구"
    ]
  },
  {
    "id": 7,
    "name": "새솔산업",
    "phone": "052-251-5678",
    "address": "울산 남구 돋질로 97",
    "businessNo": "707-87-89012",
    "ceoName": "조새솔",
    "ceoPhone": "010-7890-1007",
    "contactName": "임대리",
    "contactPhone": "010-7890-2007",
    "origins": [
      "울산 남구 장생포로",
      "울산 북구 효자로",
      "경남 양산시 웅상대로"
    ],
    "destinations": [
      "경기 시흥시 공단대로",
      "충남 서산시 대산읍",
      "전북 군산시 외항로"
    ]
  },
  {
    "id": 8,
    "name": "아라글로벌",
    "phone": "062-360-1212",
    "address": "광주 서구 상무중앙로 80",
    "businessNo": "808-88-90123",
    "ceoName": "한아라",
    "ceoPhone": "010-8901-1008",
    "contactName": "송과장",
    "contactPhone": "010-8901-2008",
    "origins": [
      "광주 광산구 사암로",
      "전남 장성군 물류로",
      "전북 전주시 덕진구"
    ],
    "destinations": [
      "인천 중구 서해대로",
      "경기 용인시 처인구",
      "경북 경산시 진량읍"
    ]
  },
  {
    "id": 9,
    "name": "자람무역",
    "phone": "053-421-4321",
    "address": "대구 중구 국채보상로 600",
    "businessNo": "909-89-01234",
    "ceoName": "서자람",
    "ceoPhone": "010-9012-1009",
    "contactName": "서대리",
    "contactPhone": "010-9012-2009",
    "origins": [
      "대구 서구 와룡로",
      "경북 칠곡군 왜관읍",
      "경북 구미시 수출대로"
    ],
    "destinations": [
      "서울 강남구 학동로",
      "경기 파주시 탄현면",
      "전남 목포시 삼학로"
    ]
  },
  {
    "id": 10,
    "name": "하랑로지스",
    "phone": "02-2233-4455",
    "address": "서울 송파구 송파대로 201",
    "businessNo": "110-90-12345",
    "ceoName": "신하랑",
    "ceoPhone": "010-9988-1010",
    "contactName": "홍주임",
    "contactPhone": "010-9988-2010",
    "origins": [
      "서울 송파구 양재대로",
      "경기 광주시 초월읍",
      "경기 용인시 백암면"
    ],
    "destinations": [
      "부산 사상구 백양대로",
      "충남 당진시 송악읍",
      "경남 김해시 골든루트로"
    ]
  }
]
  })

  React.useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients))
  }, [clients])

  const [searchTerm, setSearchTerm] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  
  // Embedded Postcode dropdown state
  const [activePostcodeField, setActivePostcodeField] = useState<string | null>(null)
  const [modalTab, setModalTab] = useState<'basic' | 'origins' | 'destinations'>('basic')
  const [locationInput, setLocationInput] = useState('')
  
  const [modalData, setModalData] = useState<Omit<Client, 'id'>>({
    name: '',
    phone: '',
    address: '',
    businessNo: '',
    ceoName: '',
    ceoPhone: '',
    contactName: '',
    contactPhone: '',
    origins: [],
    destinations: []
  })

  const [notification, setNotification] = useState<string | null>(null)
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const triggerNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (digits.startsWith('02')) {
      if (digits.length <= 2) return digits;
      if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
      if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
      return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
    } else {
      if (digits.length <= 3) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      if (digits.length <= 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    }
  }

  const formatBusinessNo = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 10)}`;
  }



  const handleOpenAddModal = () => {
    setEditingClient(null)
    setModalTab('basic')
    setLocationInput('')
    setModalData({
      name: '',
      phone: '',
      address: '',
      businessNo: '',
      ceoName: '',
      ceoPhone: '',
      contactName: '',
      contactPhone: '',
      origins: [],
      destinations: []
    })
    setShowModal(true)
  }

  const handleOpenEditModal = (client: Client) => {
    setEditingClient(client)
    setModalTab('basic')
    setLocationInput('')
    setModalData({
      name: client.name,
      phone: client.phone === '미기재' ? '' : client.phone,
      address: client.address || '',
      businessNo: client.businessNo === '미기재' ? '' : client.businessNo,
      ceoName: client.ceoName === '미기재' ? '' : client.ceoName,
      ceoPhone: client.ceoPhone === '미기재' ? '' : client.ceoPhone,
      contactName: client.contactName === '미기재' ? '' : client.contactName,
      contactPhone: client.contactPhone === '미기재' ? '' : client.contactPhone,
      origins: [...client.origins],
      destinations: [...client.destinations]
    })
    setShowModal(true)
    setActiveDropdownId(null)
  }

  const handleDeleteClient = (id: number, name: string) => {
    if (window.confirm(`정말로 [${name}] 거래처를 삭제하시겠습니까?`)) {
      setClients(prev => prev.filter(c => c.id !== id))
      triggerNotification(`거래처 [${name}]이(가) 삭제되었습니다.`)
      setActiveDropdownId(null)
      if (expandedId === id) setExpandedId(null)
    }
  }

  const handleAddLocation = (type: 'origins' | 'destinations') => {
    const val = locationInput.trim()
    if (!val) return
    if (modalData[type].length >= 20) {
      alert(`주요 ${type === 'origins' ? '상차지' : '하차지'}는 최대 20개까지만 등록할 수 있습니다.`)
      return
    }
    if (modalData[type].includes(val)) {
      alert('이미 등록된 주소입니다.')
      return
    }
    setModalData(prev => ({
      ...prev,
      [type]: [...prev[type], val]
    }))
    setLocationInput('')
  }

  const handleRemoveLocation = (type: 'origins' | 'destinations', idx: number) => {
    setModalData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== idx)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!modalData.name.trim()) return

    const sanitizedData = {
      name: modalData.name.trim(),
      phone: modalData.phone.trim() || '미기재',
      address: modalData.address.trim() || '미기재',
      businessNo: modalData.businessNo.trim() || '미기재',
      ceoName: modalData.ceoName.trim() || '미기재',
      ceoPhone: modalData.ceoPhone.trim() || '미기재',
      contactName: modalData.contactName.trim() || '미기재',
      contactPhone: modalData.contactPhone.trim() || '미기재',
      origins: modalData.origins,
      destinations: modalData.destinations
    }

    if (editingClient) {
      setClients(prev => prev.map(c => c.id === editingClient.id ? {
        ...c,
        ...sanitizedData
      } : c))
      triggerNotification(`거래처 [${modalData.name}] 정보가 수정되었습니다.`)
    } else {
      const newId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1
      const newClient: Client = {
        id: newId,
        ...sanitizedData
      }
      setClients(prev => [...prev, newClient])
      triggerNotification(`거래처 [${modalData.name}]이(가) 등록되었습니다.`)
    }
    setShowModal(false)
  }

  const filteredClients = clients.filter(client => {
    const term = searchFilter.toLowerCase().trim()
    if (!term) return true
    return (
      client.name.toLowerCase().includes(term) ||
      client.contactName.toLowerCase().includes(term) ||
      client.phone.includes(term) ||
      client.businessNo.includes(term) ||
      client.ceoName.toLowerCase().includes(term)
    )
  })

  const modalTabStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '0.6rem 1.2rem',
    fontSize: '0.85rem',
    fontWeight: 700,
    border: 'none',
    borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
    backgroundColor: 'transparent',
    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)'
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '2rem' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1.5px solid var(--primary)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.5rem',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 110,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 700,
          animation: 'fadeIn var(--transition-fast)'
        }}>
          <Check size={18} style={{ color: 'var(--primary)' }} />
          <span>{notification}</span>
        </div>
      )}

      {/* Client Registration Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <Card style={{ width: '520px', padding: '2rem', border: 'none', backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 className="text-lg font-bold">{editingClient ? '거래처 정보 수정' : '새 거래처 등록'}</h3>
            
            {/* Modal Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '0.25rem' }}>
              <button 
                type="button" 
                onClick={() => setModalTab('basic')} 
                style={modalTabStyle(modalTab === 'basic')}
              >
                기본 정보
              </button>
              <button 
                type="button" 
                onClick={() => setModalTab('origins')} 
                style={modalTabStyle(modalTab === 'origins')}
              >
                상차지 ({modalData.origins.length}/20)
              </button>
              <button 
                type="button" 
                onClick={() => setModalTab('destinations')} 
                style={modalTabStyle(modalTab === 'destinations')}
              >
                하차지 ({modalData.destinations.length}/20)
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
              {modalTab === 'basic' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '380px', overflowY: 'auto', paddingRight: '0.25rem' }} className="hide-scrollbar">
                  <div>
                    <label className="text-sm font-bold text-secondary mb-1 block">거래처명 *</label>
                    <Input 
                      required 
                      placeholder="예: (주)한결물류"
                      value={modalData.name} 
                      onChange={e => setModalData({...modalData, name: e.target.value})} 
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="text-sm font-bold text-secondary mb-1 block">사업자등록번호</label>
                      <Input 
                        placeholder="000-00-00000"
                        value={modalData.businessNo} 
                        onChange={e => setModalData({...modalData, businessNo: formatBusinessNo(e.target.value)})} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-secondary mb-1 block">회사 대표전화</label>
                      <Input 
                        placeholder="02-000-0000"
                        value={modalData.phone} 
                        onChange={e => setModalData({...modalData, phone: formatPhone(e.target.value)})} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-secondary mb-1 block">회사 주소</label>
                    <div style={{ display: 'flex', gap: '0.4rem', position: 'relative' }}>
                      <Input 
                        placeholder="회사 주소 검색"
                        value={modalData.address} 
                        onClick={() => setActivePostcodeField(activePostcodeField === 'clientAddress' ? null : 'clientAddress')}
                        readOnly
                        style={{ cursor: 'pointer' }}
                      />
                      <Button 
                        type="button" 
                        variant="secondary" 
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.82rem' }}
                        onClick={() => setActivePostcodeField(activePostcodeField === 'clientAddress' ? null : 'clientAddress')}
                      >
                        검색
                      </Button>
                      {activePostcodeField === 'clientAddress' && (
                        <>
                          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} onClick={() => setActivePostcodeField(null)} />
                          <div 
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              right: 0,
                              height: '300px',
                              border: '1.5px solid var(--primary)',
                              borderRadius: 'var(--radius-md)',
                              boxShadow: 'var(--shadow-lg)',
                              backgroundColor: 'var(--bg-secondary)',
                              zIndex: 1000,
                              marginTop: '0.25rem',
                              overflow: 'hidden'
                            }}
                            ref={(el) => {
                              if (el) {
                                const daum = (window as any).daum;
                                if (daum && daum.Postcode) {
                                  new daum.Postcode({
                                    oncomplete: (data: any) => {
                                      const addr = data.roadAddress || data.address;
                                      setModalData(prev => ({ ...prev, address: addr }));
                                      setActivePostcodeField(null);
                                    },
                                    width: '100%',
                                    height: '100%'
                                  }).embed(el);
                                }
                              }
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <div>
                      <label className="text-sm font-bold text-secondary mb-1 block">대표자명</label>
                      <Input 
                        placeholder="예: 김화주"
                        value={modalData.ceoName} 
                        onChange={e => setModalData({...modalData, ceoName: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-secondary mb-1 block">대표자 연락처</label>
                      <Input 
                        placeholder="010-0000-0000"
                        value={modalData.ceoPhone} 
                        onChange={e => setModalData({...modalData, ceoPhone: formatPhone(e.target.value)})} 
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <div>
                      <label className="text-sm font-bold text-secondary mb-1 block">담당자명</label>
                      <Input 
                        placeholder="예: 홍길동"
                        value={modalData.contactName} 
                        onChange={e => setModalData({...modalData, contactName: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-secondary mb-1 block">담당자 연락처</label>
                      <Input 
                        placeholder="010-0000-0000"
                        value={modalData.contactPhone} 
                        onChange={e => setModalData({...modalData, contactPhone: formatPhone(e.target.value)})} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {(modalTab === 'origins' || modalTab === 'destinations') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '380px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    자주 이용하는 주요 {modalTab === 'origins' ? '상차지' : '하차지'}를 최대 20개까지 등록해두고 편하게 선택할 수 있습니다.
                  </span>
                  
                  {/* Location Input and Add Button */}
                  <div style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <MapPin size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                      <Input 
                        style={{ paddingLeft: '2.25rem', fontSize: '0.85rem', cursor: 'pointer' }}
                        placeholder={modalTab === 'origins' ? "상차지 주소 검색" : "하차지 주소 검색"} 
                        value={locationInput}
                        onClick={() => setActivePostcodeField(activePostcodeField === 'clientLoc' ? null : 'clientLoc')}
                        readOnly
                        disabled={modalData[modalTab].length >= 20}
                      />
                    </div>
                    {activePostcodeField === 'clientLoc' && (
                      <>
                        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} onClick={() => setActivePostcodeField(null)} />
                        <div 
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            height: '300px',
                            border: '1.5px solid var(--primary)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-lg)',
                            backgroundColor: 'var(--bg-secondary)',
                            zIndex: 1000,
                            marginTop: '0.25rem',
                            overflow: 'hidden'
                          }}
                          ref={(el) => {
                            if (el) {
                              const daum = (window as any).daum;
                              if (daum && daum.Postcode) {
                                new daum.Postcode({
                                  oncomplete: (data: any) => {
                                    const addr = data.roadAddress || data.address;
                                    setLocationInput(addr);
                                    setActivePostcodeField(null);
                                  },
                                  width: '100%',
                                  height: '100%'
                                }).embed(el);
                              }
                            }
                          }}
                        />
                      </>
                    )}
                    <Button 
                      type="button" 
                      variant="primary" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} 
                      onClick={() => handleAddLocation(modalTab)}
                      disabled={modalData[modalTab].length >= 20}
                    >
                      추가
                    </Button>
                  </div>

                  {/* Registered Locations List */}
                  <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.75rem', backgroundColor: 'var(--bg-primary)' }} className="hide-scrollbar">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {modalData[modalTab].map((loc, i) => (
                        <div 
                          key={i} 
                          style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            padding: '0.45rem 0.6rem', 
                            backgroundColor: 'var(--bg-secondary)', 
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)'
                          }}
                        >
                          <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{loc}</span>
                          <button 
                            type="button" 
                            style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            onClick={() => handleRemoveLocation(modalTab, i)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {modalData[modalTab].length === 0 && (
                        <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>
                          등록된 {modalTab === 'origins' ? '상차지' : '하차지'}가 없습니다.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <Button type="button" variant="secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>취소</Button>
                <Button type="submit" variant="primary" style={{ flex: 1 }}>{editingClient ? '수정완료' : '등록하기'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="text-2xl font-bold">거래처 관리</h2>
          <p className="text-secondary mt-1 text-sm">화주 거래처 정보 및 주요 노선을 등록하고 관리할 수 있습니다.</p>
        </div>
        <Button variant="primary" onClick={handleOpenAddModal}><Plus size={18} /> 새 거래처 등록</Button>
      </div>

      {/* Search Bar */}
      <Card className="responsive-filter-bar" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', border: 'none' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <Input 
            style={{ paddingLeft: '2.75rem' }} 
            placeholder="거래처명, 대표자명 또는 담당자명 검색" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') setSearchFilter(searchTerm)
            }}
          />
        </div>
        <Button variant="secondary" style={{ padding: '0.75rem 1.5rem' }} onClick={() => setSearchFilter(searchTerm)}>검색</Button>
      </Card>

      {/* Clients Table */}
      <Card style={{ flex: 1, overflowY: 'auto', border: 'none' }}>
        <div className="responsive-table-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>거래처명</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>사업자번호</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>대표자 정보</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>담당자 정보</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>등록된 노선</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)', width: '80px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(client => {
              const isExpanded = expandedId === client.id
              return (
                <React.Fragment key={client.id}>
                  <tr 
                    style={{ 
                      borderBottom: isExpanded ? 'none' : '1px solid var(--border-color)', 
                      transition: 'background-color var(--transition-fast)',
                      cursor: 'pointer',
                      backgroundColor: isExpanded ? 'var(--bg-tertiary)' : 'transparent'
                    }} 
                    onClick={() => setExpandedId(isExpanded ? null : client.id)}
                    onMouseEnter={e => {
                      if (!isExpanded) e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'
                    }} 
                    onMouseLeave={e => {
                      if (!isExpanded) e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700 }}>{client.name}</td>
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{client.businessNo}</td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{client.ceoName}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{client.ceoPhone}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{client.contactName}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{client.contactPhone}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <Badge color="primary">상차지 {client.origins.length}개</Badge>
                        <Badge color="success">하차지 {client.destinations.length}개</Badge>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <button 
                          style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', padding: '0.4rem', borderRadius: '50%' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--border-color)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(activeDropdownId === client.id ? null : client.id);
                          }}
                        >
                          <MoreVertical size={20} />
                        </button>
                        {activeDropdownId === client.id && (
                          <>
                            <div 
                              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }} 
                              onClick={() => setActiveDropdownId(null)}
                            />
                            <div style={{
                              position: 'absolute',
                              right: 0,
                              top: '100%',
                              backgroundColor: 'var(--bg-secondary)',
                              border: '1px solid var(--border-color)',
                              borderRadius: 'var(--radius-md)',
                              boxShadow: 'var(--shadow-md)',
                              zIndex: 11,
                              minWidth: '100px',
                              display: 'flex',
                              flexDirection: 'column',
                              overflow: 'hidden'
                            }}>
                              <button
                                style={{
                                  padding: '0.6rem 1rem',
                                  fontSize: '0.82rem',
                                  border: 'none',
                                  background: 'none',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  color: 'var(--text-primary)',
                                  width: '100%'
                                }}
                                onClick={() => handleOpenEditModal(client)}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <Edit size={14} /> 수정
                              </button>
                              <button
                                style={{
                                  padding: '0.6rem 1rem',
                                  fontSize: '0.82rem',
                                  border: 'none',
                                  background: 'none',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  color: 'var(--danger)',
                                  width: '100%'
                                }}
                                onClick={() => handleDeleteClient(client.id, client.name)}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--danger-bg)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <Trash2 size={14} /> 삭제
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                      <td colSpan={6} style={{ padding: '0.5rem 1.5rem 1.5rem 1.5rem' }}>
                        <div 
                          className="animate-slide-down detail-grid-layout"
                          style={{
                            padding: '1.25rem',
                            backgroundColor: 'var(--bg-primary)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
                            display: 'grid',
                            gridTemplateColumns: '1.5fr 1fr 1fr',
                            gap: '1.5rem'
                          }}
                        >
                          {/* Left Column: Business & Detail Info */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                              거래처 상세 정보
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                              <div>
                                <span style={{ color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.15rem' }}>회사 대표전화</span>
                                <span style={{ fontWeight: 600 }}>{client.phone}</span>
                              </div>
                              <div>
                                <span style={{ color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.15rem' }}>사업자등록번호</span>
                                <span style={{ fontWeight: 600 }}>{client.businessNo}</span>
                              </div>
                              <div style={{ gridColumn: 'span 2' }}>
                                <span style={{ color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.15rem' }}>회사 주소</span>
                                <span style={{ fontWeight: 600 }}>{client.address || '등록된 주소 없음'}</span>
                              </div>
                              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                  <span style={{ color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.15rem' }}>대표자 정보</span>
                                  <span style={{ fontWeight: 600 }}>대표: {client.ceoName}</span>
                                  <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.1rem' }}>연락처: {client.ceoPhone}</span>
                                </div>
                                <div>
                                  <span style={{ color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.15rem' }}>담당자 정보</span>
                                  <span style={{ fontWeight: 600 }}>담당: {client.contactName}</span>
                                  <span style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.1rem' }}>연락처: {client.contactPhone}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Middle Column: Origins */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>주요 상차지</span>
                              <Badge color="primary">{client.origins.length}/20</Badge>
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '0.25rem' }} className="hide-scrollbar">
                              {client.origins.map((org, i) => (
                                <div key={i} style={{ fontSize: '0.82rem', padding: '0.35rem 0.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={org}>
                                  {org}
                                </div>
                              ))}
                              {client.origins.length === 0 && (
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontStyle: 'italic', padding: '1.5rem 0', textAlign: 'center' }}>등록된 상차지 없음</span>
                              )}
                            </div>
                          </div>

                          {/* Right Column: Destinations */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>주요 하차지</span>
                              <Badge color="success">{client.destinations.length}/20</Badge>
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '0.25rem' }} className="hide-scrollbar">
                              {client.destinations.map((dest, i) => (
                                <div key={i} style={{ fontSize: '0.82rem', padding: '0.35rem 0.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={dest}>
                                  {dest}
                                </div>
                              ))}
                              {client.destinations.length === 0 && (
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontStyle: 'italic', padding: '1.5rem 0', textAlign: 'center' }}>등록된 하차지 없음</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                  검색 조건에 부합하는 거래처 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  )
}
