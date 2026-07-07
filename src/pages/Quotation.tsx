import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Input } from '../components/ui'
import { Copy, ArrowRight, Search, FileText, CheckCircle2, CloudRain, Calendar, Moon, Sparkles } from 'lucide-react'

// Coordinate center for each province in Korea (relative approx in km)
const REGIONS = [
  { name: '서울', x: 0, y: 0 },
  { name: '인천', x: -30, y: 0 },
  { name: '경기', x: 10, y: -10 },
  { name: '강원', x: 120, y: 30 },
  { name: '충북', x: 80, y: -90 },
  { name: '충남', x: -40, y: -100 },
  { name: '대전', x: 30, y: -140 },
  { name: '세종', x: 20, y: -120 },
  { name: '전북', x: -20, y: -220 },
  { name: '전남', x: -50, y: -320 },
  { name: '광주', x: -30, y: -280 },
  { name: '경북', x: 150, y: -160 },
  { name: '경남', x: 140, y: -280 },
  { name: '대구', x: 120, y: -220 },
  { name: '울산', x: 200, y: -260 },
  { name: '부산', x: 190, y: -300 },
  { name: '제주', x: -50, y: -480 }
]

const TONNAGES = [
  { value: 1, label: '1톤', multiplier: 1.0 },
  { value: 2.5, label: '2.5톤', multiplier: 1.35 },
  { value: 3.5, label: '3.5톤', multiplier: 1.55 },
  { value: 5, label: '5톤', multiplier: 1.95 },
  { value: 11, label: '11톤', multiplier: 2.75 },
  { value: 25, label: '25톤', multiplier: 3.85 }
]

const INCHEON_DISTRICTS = [
  { name: '인천 중구', x: -35, y: 0 },
  { name: '인천 동구', x: -33, y: 2 },
  { name: '인천 미추홀구', x: -30, y: -3 },
  { name: '인천 연수구', x: -31, y: -8 },
  { name: '인천 남동구', x: -26, y: -6 },
  { name: '인천 부평구', x: -22, y: -1 },
  { name: '인천 계양구', x: -21, y: 4 },
  { name: '인천 서구', x: -28, y: 7 },
  { name: '인천 강화군', x: -50, y: 25 },
  { name: '인천 옹진군', x: -60, y: -20 }
]

export default function Quotation() {
  const navigate = useNavigate()

  // Input states
  const [originRegion, setOriginRegion] = useState('서울')
  const [originDetail, setOriginDetail] = useState('')
  const [carType, setCarType] = useState<'cargo' | 'wing_top' | 'refrigerated'>('cargo')
  
  // Surcharge conditions
  const [surchargeWeekend, setSurchargeWeekend] = useState(false)
  const [surchargeNight, setSurchargeNight] = useState(false)
  const [surchargeWeather, setSurchargeWeather] = useState(false)
  
  // Supply/Demand multiplier
  const [demandFactor, setDemandFactor] = useState(1.0)
  
  // Filter search
  const [searchQuery, setSearchQuery] = useState('')
  
  // Selected Quote Detail
  const [selectedQuote, setSelectedQuote] = useState<{
    destination: string
    tonnage: number
    tonnageLabel: string
    fee: number
  } | null>(null)

  const [isIncheonExpanded, setIsIncheonExpanded] = useState(false)

  // Notification Toast State
  const [notification, setNotification] = useState<string | null>(null)
  const triggerNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 2500)
  }

  // Calculate distance between origin region and dest region
  const getCoordinates = (name: string) => {
    return REGIONS.find(r => r.name === name) || { x: 0, y: 0 }
  }

  // Calculate distance for any target coordinate
  const calculateDistance = (originName: string, target: { x: number, y: number }) => {
    const origin = getCoordinates(originName)
    const dx = origin.x - target.x
    const dy = origin.y - target.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    return dist === 0 ? 10 : dist
  }

  // Calculate fare for any target coordinate
  const calculateFareForCoordinates = (targetX: number, targetY: number, tonnageMultiplier: number) => {
    const origin = getCoordinates(originRegion)
    const dx = origin.x - targetX
    const dy = origin.y - targetY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    let baseFare = 0
    if (distance === 0) {
      baseFare = 60000
    } else {
      baseFare = 60000 + distance * 550
    }

    if (originRegion === '제주') {
      baseFare += 250000
    }

    let fare = baseFare * tonnageMultiplier

    if (carType === 'wing_top') {
      fare *= 1.10
    } else if (carType === 'refrigerated') {
      fare *= 1.25
    }

    if (surchargeWeekend) fare *= 1.10
    if (surchargeNight) fare *= 1.20
    if (surchargeWeather) fare *= 1.15

    fare *= demandFactor

    return Math.round(fare / 5000) * 5000
  }

  // Generate dynamic calculation logic
  const calculateFare = (destName: string, tonnageMultiplier: number) => {
    const origin = getCoordinates(originRegion)
    const dest = getCoordinates(destName)
    
    const dx = origin.x - dest.x
    const dy = origin.y - dest.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // 1. Base fare calculation
    let baseFare = 0
    if (distance === 0) {
      // Same province (local intra-city short rate)
      baseFare = 60000
    } else {
      // Cross-provincial distance rate
      baseFare = 60000 + distance * 550
    }

    // 2. Ferry surcharge for Jeju Island
    if (originRegion === '제주' || destName === '제주') {
      if (originRegion !== destName) {
        baseFare += 250000 // Extra shipping ferry cost
      }
    }

    // 3. Apply vehicle multipliers
    let fare = baseFare * tonnageMultiplier

    // 4. Apply car type multiplier
    if (carType === 'wing_top') {
      fare *= 1.10
    } else if (carType === 'refrigerated') {
      fare *= 1.25
    }

    // 5. Apply active surcharges
    if (surchargeWeekend) fare *= 1.10
    if (surchargeNight) fare *= 1.20
    if (surchargeWeather) fare *= 1.15

    // 6. Apply Peak Demand Slider multiplier
    fare *= demandFactor

    // 7. Round to nearest 5,000 won (logistic standard)
    return Math.round(fare / 5000) * 5000
  }

  // Filtered regions for table
  const filteredRegions = useMemo(() => {
    if (!searchQuery.trim()) return REGIONS
    return REGIONS.filter(r => r.name.includes(searchQuery.trim()))
  }, [searchQuery])

  // Clipboard export copy
  const copyQuoteToClipboard = (dest: string, tonnageLabel: string, fee: number) => {
    const carTypeText = carType === 'refrigerated' ? '냉동/냉장' : carType === 'wing_top' ? '윙바디/탑차' : '카고'
    const formattedFee = fee.toLocaleString()
    const text = `[T-Logis 견적 안내]
■ 상차지: ${originRegion} ${originDetail ? '(' + originDetail + ')' : ''}
■ 하차지: ${dest}
■ 차종/톤수: ${tonnageLabel} ${carTypeText}
■ 최종 추천 견적: ${formattedFee}원 (VAT 별도)
* 기상 상황, 야간/주말 배차 등 현장 수급에 따라 실시간 매칭 운임은 상이할 수 있습니다.`
    
    navigator.clipboard.writeText(text)
    triggerNotification('📋 견적 정보가 클립보드에 복사되었습니다.')
  }

  // Create dispatch link integration
  const handleCreateDispatch = (dest: string, tonnageVal: number, fee: number) => {
    const carTypeText = carType === 'refrigerated' ? '냉동' : carType === 'wing_top' ? '윙바디' : '카고'
    const pendingQuote = {
      origin: `${originRegion} ${originDetail}`.trim(),
      destination: dest,
      tonnage: tonnageVal,
      carType: carTypeText,
      fee: fee
    }
    localStorage.setItem('pending_quote', JSON.stringify(pendingQuote))
    triggerNotification('🚚 견적 정보가 배차 등록 폼에 전송되었습니다.')
    setTimeout(() => {
      navigate('/dispatches')
    }, 500)
  }

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%', overflowY: 'auto' }}>
      
      {/* Toast Notification Banner */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1100,
          backgroundColor: 'var(--text-primary)',
          color: 'var(--bg-secondary)',
          padding: '0.85rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '0.88rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          pointerEvents: 'none',
          animation: 'fadeSlideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          <CheckCircle2 size={16} style={{ color: 'var(--primary)' }} />
          {notification}
        </div>
      )}

      {/* Headline Header */}
      <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', border: 'none' }}>
        <h3 style={{ 
          fontSize: '1.15rem', 
          fontWeight: 700, 
          color: 'var(--text-primary)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.45rem' 
        }}>
          <span style={{ width: '4px', height: '16px', backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-sm)' }}></span>
          지역별 견적 계산기 (Quotation Calculator)
        </h3>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
          화주 견적 문의 시 신속히 매칭 가능한 추천 요금을 도출할 수 있는 지역별/톤수별 실시간 견적 계산기입니다.
        </p>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem' }} className="responsive-layout-grid-quote">
        
        {/* Left Column: Config Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: 'none' }}>
            <h4 style={{ 
              fontSize: '0.92rem', 
              fontWeight: 700, 
              color: 'var(--text-primary)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem', 
              borderBottom: '1px solid var(--border-color)', 
              paddingBottom: '0.5rem', 
              margin: '0 0 -0.25rem 0' 
            }}>
              <span style={{ width: '4px', height: '14px', backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-sm)' }}></span>
              상차 및 차종 옵션 설정
            </h4>

            {/* Origin province selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>상차지 (시도 선택)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <select 
                  value={originRegion} 
                  onChange={(e) => {
                    setOriginRegion(e.target.value)
                    setSelectedQuote(null)
                  }}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                >
                  {REGIONS.map(r => (
                    <option key={r.name} value={r.name}>{r.name}</option>
                  ))}
                </select>
                <Input 
                  placeholder="상세 구/군 (예: 강남구)" 
                  value={originDetail}
                  onChange={(e) => {
                    setOriginDetail(e.target.value)
                    setSelectedQuote(null)
                  }}
                  style={{ padding: '0.65rem 0.85rem', fontSize: '0.86rem' }}
                />
              </div>
            </div>

            {/* Car Type Segment Control */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>운송 차량 종류</label>
              <div style={{
                display: 'flex',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-primary)'
              }}>
                <button
                  type="button"
                  onClick={() => { setCarType('cargo'); setSelectedQuote(null); }}
                  style={{
                    flex: 1,
                    padding: '0.6rem 0.5rem',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: carType === 'cargo' ? 700 : 500,
                    backgroundColor: carType === 'cargo' ? 'var(--bg-secondary)' : 'transparent',
                    color: carType === 'cargo' ? 'var(--primary)' : 'var(--text-secondary)',
                    boxShadow: carType === 'cargo' ? 'var(--shadow-sm)' : 'none',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  카고 (기본)
                </button>
                <button
                  type="button"
                  onClick={() => { setCarType('wing_top'); setSelectedQuote(null); }}
                  style={{
                    flex: 1,
                    padding: '0.6rem 0.5rem',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: carType === 'wing_top' ? 700 : 500,
                    backgroundColor: carType === 'wing_top' ? 'var(--bg-secondary)' : 'transparent',
                    color: carType === 'wing_top' ? 'var(--primary)' : 'var(--text-secondary)',
                    boxShadow: carType === 'wing_top' ? 'var(--shadow-sm)' : 'none',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  윙바디/탑 (+10%)
                </button>
                <button
                  type="button"
                  onClick={() => { setCarType('refrigerated'); setSelectedQuote(null); }}
                  style={{
                    flex: 1,
                    padding: '0.6rem 0.5rem',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: carType === 'refrigerated' ? 700 : 500,
                    backgroundColor: carType === 'refrigerated' ? 'var(--bg-secondary)' : 'transparent',
                    color: carType === 'refrigerated' ? 'var(--primary)' : 'var(--text-secondary)',
                    boxShadow: carType === 'refrigerated' ? 'var(--shadow-sm)' : 'none',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  냉동/냉장 (+25%)
                </button>
              </div>
            </div>

            {/* Surcharges checklists */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>할증 조건 추가</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                
                <button
                  type="button"
                  onClick={() => { setSurchargeWeekend(!surchargeWeekend); setSelectedQuote(null); }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.45rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: surchargeWeekend ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                    backgroundColor: surchargeWeekend ? 'var(--primary-light)' : 'var(--bg-secondary)',
                    color: surchargeWeekend ? 'var(--primary)' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: surchargeWeekend ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <Calendar size={14} /> 주말/공휴일 (+10%)
                </button>

                <button
                  type="button"
                  onClick={() => { setSurchargeNight(!surchargeNight); setSelectedQuote(null); }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.45rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: surchargeNight ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                    backgroundColor: surchargeNight ? 'var(--primary-light)' : 'var(--bg-secondary)',
                    color: surchargeNight ? 'var(--primary)' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: surchargeNight ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <Moon size={14} /> 야간배송 (+20%)
                </button>

                <button
                  type="button"
                  onClick={() => { setSurchargeWeather(!surchargeWeather); setSelectedQuote(null); }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.45rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: surchargeWeather ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                    backgroundColor: surchargeWeather ? 'var(--primary-light)' : 'var(--bg-secondary)',
                    color: surchargeWeather ? 'var(--primary)' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: surchargeWeather ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <CloudRain size={14} /> 기상악화 (+15%)
                </button>
              </div>
            </div>

            {/* Peak Demand Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>시장 실시간 수급 조절</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: demandFactor > 1.15 ? 'var(--danger-text)' : demandFactor > 1.0 ? 'var(--warning-text)' : 'var(--success-text)' }}>
                  {demandFactor === 1.0 ? '안정 (1.0x)' : `${demandFactor.toFixed(2)}x`}
                </span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
                value={demandFactor}
                onChange={(e) => {
                  setDemandFactor(parseFloat(e.target.value))
                  setSelectedQuote(null)
                }}
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  accentColor: 'var(--primary)'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                <span>비성수기 (-20%)</span>
                <span>보통</span>
                <span>공급부족 (+50%)</span>
              </div>
            </div>
          </Card>

          {/* Quick Notice Card */}
          <div style={{ 
            backgroundColor: 'rgba(49, 130, 246, 0.05)', 
            border: '1px dashed var(--primary)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <h5 style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Sparkles size={14} /> T-Logis 견적 매트릭스 안내
            </h5>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              해당 테이블에 노출된 운임은 실제 시장 실거래 데이터 기반의 거리별 운임 매트릭스 공식에 따른 계산값입니다. 오른쪽 하차지별 표에서 금액을 클릭하면 견적 정보 클립보드 복사 및 즉시 배차 등록이 지원됩니다.
            </p>
          </div>
        </div>

        {/* Right Column: Grid Rate Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: 'none', height: '100%' }}>
            
            {/* Header: Title and Search Filter */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '4px', height: '14px', backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-sm)' }}></span>
                지역별/톤수별 추천 운임표
              </h4>
              <div style={{ position: 'relative', width: '220px' }}>
                <Search size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <Input 
                  placeholder="하차 지역 검색 (예: 부산)" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2rem', paddingRight: '0.5rem', paddingTop: '0.45rem', paddingBottom: '0.45rem', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            {/* Rate Grid Matrix */}
            <div className="responsive-table-wrapper hide-scrollbar" style={{ flex: 1, maxHeight: '420px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid var(--border-color)', position: 'sticky', top: 0, backgroundColor: 'var(--bg-secondary)', zIndex: 10 }}>
                    <th style={{ padding: '0.65rem 0.5rem', textAlign: 'left', fontWeight: 800, color: 'var(--text-secondary)' }}>하차지 (시도)</th>
                    {TONNAGES.map(t => (
                      <th key={t.label} style={{ padding: '0.65rem 0.5rem', textAlign: 'right', fontWeight: 800, color: 'var(--text-secondary)' }}>{t.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRegions.map(region => {
                    const isIncheon = region.name === '인천';
                    return (
                      <React.Fragment key={region.name}>
                        <tr 
                          style={{ 
                            borderBottom: '1px solid var(--border-color)',
                            backgroundColor: region.name === originRegion ? 'rgba(49, 130, 246, 0.03)' : 'transparent',
                            transition: 'background-color var(--transition-fast)'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = region.name === originRegion ? 'rgba(49, 130, 246, 0.03)' : 'transparent' }}
                        >
                          <td 
                            style={{ 
                              padding: '0.65rem 0.5rem', 
                              fontWeight: 700, 
                              color: 'var(--text-primary)',
                              cursor: isIncheon ? 'pointer' : 'default'
                            }}
                            onClick={() => {
                              if (isIncheon) {
                                setIsIncheonExpanded(!isIncheonExpanded)
                              }
                            }}
                          >
                            {region.name}
                            {region.name === originRegion && (
                              <span style={{ fontSize: '0.65rem', marginLeft: '0.25rem', padding: '0.05rem 0.35rem', backgroundColor: 'var(--primary)', color: '#ffffff', borderRadius: 'var(--radius-sm)' }}>상차</span>
                            )}
                            {isIncheon && (
                              <span style={{ 
                                fontSize: '0.65rem', 
                                marginLeft: '0.35rem', 
                                padding: '0.1rem 0.4rem', 
                                backgroundColor: isIncheonExpanded ? 'var(--primary-light)' : 'var(--bg-primary)', 
                                color: isIncheonExpanded ? 'var(--primary)' : 'var(--text-secondary)', 
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: 700
                              }}>
                                {isIncheonExpanded ? '접기 ▲' : '구단위 보기 ▼'}
                              </span>
                            )}
                          </td>
                          {TONNAGES.map(tonnage => {
                            const calculatedFee = calculateFare(region.name, tonnage.multiplier)
                            const isSelected = selectedQuote && selectedQuote.destination === region.name && selectedQuote.tonnage === tonnage.value
                            
                            return (
                              <td 
                                key={tonnage.value} 
                                style={{ 
                                  padding: '0.65rem 0.5rem', 
                                  textAlign: 'right', 
                                  cursor: 'pointer',
                                  fontWeight: isSelected ? 800 : 500,
                                  color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                                  backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                                  borderRadius: isSelected ? 'var(--radius-sm)' : 'none',
                                  transition: 'all var(--transition-fast)'
                                }}
                                onClick={() => {
                                  setSelectedQuote({
                                    destination: region.name,
                                    tonnage: tonnage.value,
                                    tonnageLabel: tonnage.label,
                                    fee: calculatedFee
                                  })
                                }}
                              >
                                {(calculatedFee / 10000).toFixed(1)}만
                              </td>
                            )
                          })}
                        </tr>
                        {isIncheon && isIncheonExpanded && (
                          INCHEON_DISTRICTS.map(district => {
                            const dist = calculateDistance(originRegion, district)
                            
                            return (
                              <tr 
                                key={district.name}
                                style={{ 
                                  borderBottom: '1px dashed var(--border-color)',
                                  backgroundColor: 'var(--bg-tertiary)'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--border-color)' }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)' }}
                              >
                                <td style={{ padding: '0.55rem 0.5rem 0.55rem 1.5rem', textAlign: 'left' }}>
                                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                    <span style={{ color: 'var(--text-tertiary)' }}>↳</span> {district.name.replace('인천 ', '')}
                                  </div>
                                  <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '0.15rem' }}>
                                    {dist.toFixed(1)}km
                                  </div>
                                </td>
                                {TONNAGES.map(tonnage => {
                                  const calculatedFee = calculateFareForCoordinates(district.x, district.y, tonnage.multiplier)
                                  const isSelected = selectedQuote && selectedQuote.destination === district.name && selectedQuote.tonnage === tonnage.value
                                  const ratePerKm = Math.round(calculatedFee / dist)
                                  
                                  return (
                                    <td 
                                      key={tonnage.value} 
                                      style={{ 
                                        padding: '0.55rem 0.5rem', 
                                        textAlign: 'right', 
                                        cursor: 'pointer',
                                        fontWeight: isSelected ? 800 : 500,
                                        color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                                        backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                                        borderRadius: isSelected ? 'var(--radius-sm)' : 'none',
                                        transition: 'all var(--transition-fast)'
                                      }}
                                      onClick={() => {
                                        setSelectedQuote({
                                          destination: district.name,
                                          tonnage: tonnage.value,
                                          tonnageLabel: tonnage.label,
                                          fee: calculatedFee
                                        })
                                      }}
                                      title={`${tonnage.label} 단가: ${ratePerKm.toLocaleString()}원/km`}
                                    >
                                      <div>{(calculatedFee / 10000).toFixed(1)}만</div>
                                      <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '0.1rem', fontWeight: 400 }}>
                                        {ratePerKm.toLocaleString()}원/km
                                      </div>
                                    </td>
                                  )
                                })}
                              </tr>
                            )
                          })
                        )}
                      </React.Fragment>
                    )
                  })}
                  {filteredRegions.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: '2rem', textRendering: 'optimizeSpeed', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                        검색된 하차 지역이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom selected quote summary actions */}
            {selectedQuote && (
              <div 
                className="animate-fade-slide-up"
                style={{ 
                  marginTop: '0.5rem', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '1rem 1.25rem', 
                  backgroundColor: 'var(--bg-tertiary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    flexShrink: 0
                  }}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>선택된 견적 상세 요약</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                      {originRegion} → {selectedQuote.destination} ({selectedQuote.tonnageLabel} {carType === 'refrigerated' ? '냉동' : carType === 'wing_top' ? '윙바디' : '카고'})
                      <span style={{ marginLeft: '0.5rem', color: 'var(--primary)', fontWeight: 900 }}>
                        {selectedQuote.fee.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button 
                    variant="outline" 
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                    onClick={() => copyQuoteToClipboard(selectedQuote.destination, selectedQuote.tonnageLabel, selectedQuote.fee)}
                  >
                    <Copy size={13} /> 클립보드 복사
                  </Button>
                  <Button 
                    variant="primary" 
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                    onClick={() => handleCreateDispatch(selectedQuote.destination, selectedQuote.tonnage, selectedQuote.fee)}
                  >
                    신규 배차 등록 <ArrowRight size={13} />
                  </Button>
                </div>
              </div>
            )}

          </Card>
        </div>

      </div>

    </div>
  )
}
