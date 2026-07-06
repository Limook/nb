import React, { useState, useEffect } from 'react'
import { Card, Button, Input, Badge } from '../components/ui'
import { Plus, Search, MoreVertical, Check, Trash2, Edit, X, Truck } from 'lucide-react'

interface Driver {
  id: number
  name: string
  phone: string
  vNumber: string
  type: string // 소속, 지입, 외부
  spec: string
  bank: string
}

const initialDrivers: Driver[] = [
  {
    "id": 1,
    "name": "김차주",
    "phone": "010-1001-2001",
    "vNumber": "서울81바1001",
    "type": "소속",
    "spec": "5톤 윙바디",
    "bank": "국민은행 123-456-789001"
  },
  {
    "id": 2,
    "name": "이기사",
    "phone": "010-1002-2002",
    "vNumber": "경기82사1002",
    "type": "지입",
    "spec": "11톤 카고",
    "bank": "신한은행 234-567-890002"
  },
  {
    "id": 3,
    "name": "박기사",
    "phone": "010-1003-2003",
    "vNumber": "인천83아1003",
    "type": "외부",
    "spec": "1톤 탑차",
    "bank": "우리은행 345-678-901003"
  },
  {
    "id": 4,
    "name": "최차주",
    "phone": "010-1004-2004",
    "vNumber": "부산84바1004",
    "type": "소속",
    "spec": "25톤 카고",
    "bank": "하나은행 456-789-012004"
  },
  {
    "id": 5,
    "name": "정기사",
    "phone": "010-1005-2005",
    "vNumber": "대구85사1005",
    "type": "지입",
    "spec": "3.5톤 윙바디",
    "bank": "농협은행 567-890-123005"
  },
  {
    "id": 6,
    "name": "강차주",
    "phone": "010-1006-2006",
    "vNumber": "대전86아1006",
    "type": "외부",
    "spec": "8톤 윙바디",
    "bank": "기업은행 678-901-234006"
  },
  {
    "id": 7,
    "name": "조기사",
    "phone": "010-1007-2007",
    "vNumber": "울산87바1007",
    "type": "소속",
    "spec": "18톤 윙바디",
    "bank": "우체국 789-012-345007"
  },
  {
    "id": 8,
    "name": "윤차주",
    "phone": "010-1008-2008",
    "vNumber": "광주88사1008",
    "type": "지입",
    "spec": "5톤 카고",
    "bank": "국민은행 890-123-456008"
  },
  {
    "id": 9,
    "name": "장기사",
    "phone": "010-1009-2009",
    "vNumber": "세종89아1009",
    "type": "외부",
    "spec": "1.4톤 윙바디",
    "bank": "신한은행 901-234-567009"
  },
  {
    "id": 10,
    "name": "임차주",
    "phone": "010-1010-2010",
    "vNumber": "경기90바1010",
    "type": "소속",
    "spec": "11톤 윙바디",
    "bank": "우리은행 012-345-678010"
  },
  {
    "id": 11,
    "name": "한기사",
    "phone": "010-1011-2011",
    "vNumber": "서울91사1011",
    "type": "지입",
    "spec": "1톤 탑차",
    "bank": "하나은행 123-456-789011"
  },
  {
    "id": 12,
    "name": "오차주",
    "phone": "010-1012-2012",
    "vNumber": "인천92아1012",
    "type": "외부",
    "spec": "2.5톤 탑차",
    "bank": "농협은행 234-567-890012"
  },
  {
    "id": 13,
    "name": "서기사",
    "phone": "010-1013-2013",
    "vNumber": "부산93바1013",
    "type": "소속",
    "spec": "5톤 윙바디",
    "bank": "기업은행 345-678-901013"
  },
  {
    "id": 14,
    "name": "신차주",
    "phone": "010-1014-2014",
    "vNumber": "대구94사1014",
    "type": "지입",
    "spec": "11톤 카고",
    "bank": "국민은행 456-789-012014"
  },
  {
    "id": 15,
    "name": "권기사",
    "phone": "010-1015-2015",
    "vNumber": "대전95아1015",
    "type": "외부",
    "spec": "25톤 카고",
    "bank": "신한은행 567-890-123015"
  },
  {
    "id": 16,
    "name": "황차주",
    "phone": "010-1016-2016",
    "vNumber": "울산96바1016",
    "type": "소속",
    "spec": "5톤 카고",
    "bank": "우리은행 678-901-234016"
  },
  {
    "id": 17,
    "name": "안기사",
    "phone": "010-1017-2017",
    "vNumber": "광주97사1017",
    "type": "지입",
    "spec": "18톤 윙바디",
    "bank": "하나은행 789-012-345017"
  },
  {
    "id": 18,
    "name": "송차주",
    "phone": "010-1018-2018",
    "vNumber": "세종98아1018",
    "type": "외부",
    "spec": "1.4톤 윙바디",
    "bank": "농협은행 890-123-456018"
  },
  {
    "id": 19,
    "name": "전기사",
    "phone": "010-1019-2019",
    "vNumber": "경기99바1019",
    "type": "소속",
    "spec": "5톤 윙바디",
    "bank": "기업은행 901-234-567019"
  },
  {
    "id": 20,
    "name": "홍차주",
    "phone": "010-1020-2020",
    "vNumber": "서울79사1020",
    "type": "지입",
    "spec": "11톤 윙바디",
    "bank": "국민은행 012-345-678020"
  }
]

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('drivers')
    return saved ? JSON.parse(saved) : initialDrivers
  })

  useEffect(() => {
    localStorage.setItem('drivers', JSON.stringify(drivers))
  }, [drivers])

  const [searchTerm, setSearchTerm] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)

  const [modalData, setModalData] = useState<Omit<Driver, 'id'>>({
    name: '',
    phone: '',
    vNumber: '',
    type: '소속',
    spec: '',
    bank: ''
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
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length <= 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }

  const handleOpenAddModal = () => {
    setEditingDriver(null)
    setModalData({
      name: '',
      phone: '',
      vNumber: '',
      type: '소속',
      spec: '',
      bank: ''
    })
    setShowModal(true)
  }

  const handleOpenEditModal = (driver: Driver) => {
    setEditingDriver(driver)
    setModalData({
      name: driver.name,
      phone: driver.phone === '미기재' ? '' : driver.phone,
      vNumber: driver.vNumber || '',
      type: driver.type || '소속',
      spec: driver.spec || '',
      bank: driver.bank === '미기재' ? '' : driver.bank
    })
    setShowModal(true)
    setActiveDropdownId(null)
  }

  const handleDeleteDriver = (id: number, name: string) => {
    if (window.confirm(`정말로 [${name}] 차주 정보를 삭제하시겠습니까?`)) {
      setDrivers(prev => prev.filter(d => d.id !== id))
      triggerNotification(`차주 [${name}] 정보가 삭제되었습니다.`)
      setActiveDropdownId(null)
      if (expandedId === id) setExpandedId(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!modalData.name.trim() || !modalData.vNumber.trim()) return

    const sanitizedData = {
      name: modalData.name.trim(),
      phone: modalData.phone.trim() || '미기재',
      vNumber: modalData.vNumber.trim(),
      type: modalData.type,
      spec: modalData.spec.trim() || '미지정',
      bank: modalData.bank.trim() || '미기재'
    }

    if (editingDriver) {
      setDrivers(prev => prev.map(d => d.id === editingDriver.id ? {
        ...d,
        ...sanitizedData
      } : d))
      triggerNotification(`차주 [${modalData.name}] 정보가 수정되었습니다.`)
    } else {
      const newId = drivers.length > 0 ? Math.max(...drivers.map(d => d.id)) + 1 : 1
      const newDriver: Driver = {
        id: newId,
        ...sanitizedData
      }
      setDrivers(prev => [...prev, newDriver])
      triggerNotification(`차주 [${modalData.name}]이(가) 등록되었습니다.`)
    }
    setShowModal(false)
  }

  const filteredDrivers = drivers.filter(driver => {
    const term = searchFilter.toLowerCase().trim()
    const matchesSearch = !term || (
      driver.name.toLowerCase().includes(term) ||
      driver.vNumber.toLowerCase().includes(term) ||
      driver.phone.includes(term) ||
      driver.spec.toLowerCase().includes(term)
    )
    const matchesType = !typeFilter || driver.type === typeFilter
    return matchesSearch && matchesType
  })

  const recommendationButtonStyle: React.CSSProperties = {
    fontSize: '0.72rem',
    padding: '0.2rem 0.6rem',
    background: 'var(--primary-light)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    color: 'var(--primary)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  }

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

      {/* Driver Registration Modal */}
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
          <Card style={{ width: '460px', padding: '2rem', border: 'none', backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 className="text-lg font-bold">{editingDriver ? '차주 정보 수정' : '새 차주 등록'}</h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="text-sm font-bold text-secondary mb-1 block">차주명 *</label>
                <Input 
                  required 
                  placeholder="예: 홍길동"
                  value={modalData.name} 
                  onChange={e => setModalData({...modalData, name: e.target.value})} 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="text-sm font-bold text-secondary mb-1 block">연락처</label>
                  <Input 
                    placeholder="010-0000-0000"
                    value={modalData.phone} 
                    onChange={e => setModalData({...modalData, phone: formatPhone(e.target.value)})} 
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-secondary mb-1 block">차량번호 *</label>
                  <Input 
                    required
                    placeholder="예: 서울81바1234"
                    value={modalData.vNumber} 
                    onChange={e => setModalData({...modalData, vNumber: e.target.value})} 
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.75rem' }}>
                <div>
                  <label className="text-sm font-bold text-secondary mb-1 block">차량 구분</label>
                  <select 
                    style={{ 
                      padding: '0.75rem 1rem', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid var(--border-color)', 
                      backgroundColor: 'var(--bg-primary)', 
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                      width: '100%',
                      cursor: 'pointer'
                    }}
                    value={modalData.type}
                    onChange={e => setModalData({...modalData, type: e.target.value})}
                  >
                    <option value="소속">소속차량</option>
                    <option value="지입">지입차량</option>
                    <option value="외부">외부차량</option>
                  </select>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <label className="text-sm font-bold text-secondary block">차량스펙</label>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      {['1톤 탑차', '5톤 윙', '11톤 카고'].map(s => (
                        <button 
                          key={s} 
                          type="button" 
                          onClick={() => setModalData({...modalData, spec: s})}
                          style={recommendationButtonStyle}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Input 
                    placeholder="예: 5톤 윙바디"
                    value={modalData.spec} 
                    onChange={e => setModalData({...modalData, spec: e.target.value})} 
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-secondary mb-1 block">정산 계좌정보</label>
                <Input 
                  placeholder="예: 국민은행 123-456-789"
                  value={modalData.bank} 
                  onChange={e => setModalData({...modalData, bank: e.target.value})} 
                />
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <Button type="button" variant="secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>취소</Button>
                <Button type="submit" variant="primary" style={{ flex: 1 }}>{editingDriver ? '수정완료' : '등록하기'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="text-2xl font-bold">차주 관리</h2>
          <p className="text-secondary mt-1 text-sm">소속차량, 지입차량, 외부차량의 제원 및 정산 계좌 정보를 관리합니다.</p>
        </div>
        <Button variant="primary" onClick={handleOpenAddModal}><Plus size={18} /> 새 차주 등록</Button>
      </div>

      {/* Search Bar */}
      <Card style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', border: 'none' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <Input 
            style={{ paddingLeft: '2.75rem' }} 
            placeholder="차주명, 차량번호 또는 차량스펙 검색" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') setSearchFilter(searchTerm)
            }}
          />
        </div>
        <select 
          style={{ 
            padding: '0.75rem 1rem', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid transparent', 
            backgroundColor: 'var(--bg-primary)', 
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          onFocus={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
            e.currentTarget.style.borderColor = 'var(--primary)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <option value="">전체 차량 구분</option>
          <option value="소속">소속차량</option>
          <option value="지입">지입차량</option>
          <option value="외부">외부차량</option>
        </select>
        <Button variant="secondary" style={{ padding: '0.75rem 1.5rem' }} onClick={() => setSearchFilter(searchTerm)}>검색</Button>
      </Card>

      {/* Drivers Table */}
      <Card style={{ flex: 1, overflowY: 'auto', border: 'none' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>차주명</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>연락처</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>차량번호</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>구분</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>차량스펙</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>정산 계좌정보</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)', width: '80px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map(driver => {
              const isExpanded = expandedId === driver.id
              return (
                <React.Fragment key={driver.id}>
                  <tr 
                    style={{ 
                      borderBottom: isExpanded ? 'none' : '1px solid var(--border-color)', 
                      transition: 'background-color var(--transition-fast)',
                      cursor: 'pointer',
                      backgroundColor: isExpanded ? 'var(--bg-tertiary)' : 'transparent'
                    }}
                    onClick={() => setExpandedId(isExpanded ? null : driver.id)}
                    onMouseEnter={e => {
                      if (!isExpanded) e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'
                    }} 
                    onMouseLeave={e => {
                      if (!isExpanded) e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700 }}>{driver.name}</td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>{driver.phone}</td>
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600 }}>{driver.vNumber}</td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <Badge color={driver.type === '소속' ? 'primary' : driver.type === '지입' ? 'success' : 'gray'}>
                        {driver.type}차량
                      </Badge>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{driver.spec}</td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{driver.bank}</td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <button 
                          style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', padding: '0.4rem', borderRadius: '50%' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--border-color)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(activeDropdownId === driver.id ? null : driver.id);
                          }}
                        >
                          <MoreVertical size={20} />
                        </button>
                        {activeDropdownId === driver.id && (
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
                                onClick={() => handleOpenEditModal(driver)}
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
                                onClick={() => handleDeleteDriver(driver.id, driver.name)}
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
                      <td colSpan={7} style={{ padding: '0.5rem 1.5rem 1.5rem 1.5rem' }}>
                        <div 
                          className="animate-slide-down"
                          style={{
                            padding: '1.25rem',
                            backgroundColor: 'var(--bg-primary)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                          }}
                        >
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Truck size={15} style={{ color: 'var(--primary)' }} />
                            차주 및 차량 상세 제원
                          </h4>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', fontSize: '0.85rem', paddingTop: '0.25rem' }}>
                            <div>
                              <span style={{ color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.15rem' }}>차주명 (연락처)</span>
                              <span style={{ fontWeight: 600 }}>{driver.name} ({driver.phone})</span>
                            </div>
                            <div>
                              <span style={{ color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.15rem' }}>차량 구분 / 번호</span>
                              <span style={{ fontWeight: 600 }}>{driver.type}차량 / {driver.vNumber}</span>
                            </div>
                            <div>
                              <span style={{ color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.15rem' }}>차량 제원스펙</span>
                              <span style={{ fontWeight: 600 }}>{driver.spec}</span>
                            </div>
                            <div style={{ gridColumn: 'span 3', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                              <span style={{ color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.15rem' }}>정산 지급 계좌정보</span>
                              <span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.9rem' }}>{driver.bank}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
            {filteredDrivers.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                  검색 결과 조건에 맞는 차주 정보가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
