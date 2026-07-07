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

const DISTRICTS_MAP: Record<string, { name: string, dx: number, dy: number }[]> = {
  '서울': [
    { name: '서울 강남구', dx: 5, dy: -5 },
    { name: '서울 서초구', dx: 2, dy: -6 },
    { name: '서울 송파구', dx: 10, dy: -4 },
    { name: '서울 강동구', dx: 18, dy: -2 },
    { name: '서울 마포구', dx: -5, dy: 3 },
    { name: '서울 강서구', dx: -12, dy: 1 },
    { name: '서울 종로구', dx: 0, dy: 5 },
    { name: '서울 중구', dx: 0, dy: 0 },
    { name: '서울 용산구', dx: 0, dy: -3 },
    { name: '서울 성동구', dx: 5, dy: 1 },
    { name: '서울 광진구', dx: 8, dy: 1 },
    { name: '서울 동대문구', dx: 6, dy: 4 },
    { name: '서울 중랑구', dx: 10, dy: 5 },
    { name: '서울 성북구', dx: 3, dy: 8 },
    { name: '서울 강북구', dx: 2, dy: 12 },
    { name: '서울 도봉구', dx: 3, dy: 16 },
    { name: '서울 노원구', dx: 8, dy: 14 },
    { name: '서울 은평구', dx: -6, dy: 10 },
    { name: '서울 서대문구', dx: -4, dy: 4 },
    { name: '서울 양천구', dx: -10, dy: -3 },
    { name: '서울 구로구', dx: -10, dy: -7 },
    { name: '서울 금천구', dx: -6, dy: -10 },
    { name: '서울 영등포구', dx: -5, dy: -4 },
    { name: '서울 동작구', dx: 0, dy: -6 },
    { name: '서울 관악구', dx: 0, dy: -10 }
  ],
  '인천': [
    { name: '인천 중구', dx: -5, dy: 0 },
    { name: '인천 동구', dx: -3, dy: 2 },
    { name: '인천 미추홀구', dx: 0, dy: -3 },
    { name: '인천 연수구', dx: -1, dy: -8 },
    { name: '인천 남동구', dx: 4, dy: -6 },
    { name: '인천 부평구', dx: 8, dy: -1 },
    { name: '인천 계양구', dx: 9, dy: 4 },
    { name: '인천 서구', dx: 2, dy: 7 },
    { name: '인천 강화군', dx: -20, dy: 25 },
    { name: '인천 옹진군', dx: -30, dy: -20 }
  ],
  '경기': [
    { name: '수원시', dx: 0, dy: -20 },
    { name: '성남시', dx: 15, dy: -15 },
    { name: '고양시', dx: -10, dy: 15 },
    { name: '용인시', dx: 20, dy: -30 },
    { name: '부천시', dx: -10, dy: -5 },
    { name: '안산시', dx: -15, dy: -25 },
    { name: '안양시', dx: -2, dy: -15 },
    { name: '남양주시', dx: 30, dy: 15 },
    { name: '화성시', dx: -5, dy: -40 },
    { name: '평택시', dx: 0, dy: -65 },
    { name: '의정부시', dx: 5, dy: 25 },
    { name: '시흥시', dx: -18, dy: -15 },
    { name: '파주시', dx: -20, dy: 35 },
    { name: '김포시', dx: -25, dy: 15 },
    { name: '광명시', dx: -8, dy: -10 },
    { name: '군포시', dx: -5, dy: -20 },
    { name: '광주시', dx: 25, dy: -20 },
    { name: '이천시', dx: 45, dy: -35 },
    { name: '양주시', dx: -2, dy: 30 },
    { name: '오산시', dx: 5, dy: -35 },
    { name: '구리시', dx: 15, dy: 10 },
    { name: '안성시', dx: 25, dy: -65 },
    { name: '포천시', dx: 20, dy: 45 },
    { name: '의왕시', dx: 2, dy: -22 },
    { name: '하남시', dx: 20, dy: 0 },
    { name: '여주시', dx: 55, dy: -35 },
    { name: '동두천시', dx: 10, dy: 40 },
    { name: '양평군', dx: 50, dy: -10 },
    { name: '가평군', dx: 50, dy: 25 },
    { name: '연천군', dx: 10, dy: 60 }
  ],
  '부산': [
    { name: '부산 해운대구', dx: 15, dy: 10 },
    { name: '부산 사하구', dx: -15, dy: -12 },
    { name: '부산 강서구', dx: -25, dy: -5 },
    { name: '부산 금정구', dx: 5, dy: 20 },
    { name: '부산 중구', dx: 0, dy: 0 },
    { name: '부산 서구', dx: -5, dy: -3 },
    { name: '부산 동구', dx: 2, dy: 2 },
    { name: '부산 영도구', dx: 2, dy: -8 },
    { name: '부산 부산진구', dx: -2, dy: 5 },
    { name: '부산 동래구', dx: 3, dy: 10 },
    { name: '부산 남구', dx: 6, dy: 2 },
    { name: '부산 북구', dx: -8, dy: 12 },
    { name: '부산 연제구', dx: 2, dy: 7 },
    { name: '부산 수영구', dx: 8, dy: 6 },
    { name: '부산 사상구', dx: -10, dy: 6 },
    { name: '부산 기장군', dx: 25, dy: 22 }
  ],
  '대구': [
    { name: '대구 수성구', dx: 15, dy: -5 },
    { name: '대구 달서구', dx: -15, dy: -10 },
    { name: '대구 북구', dx: -5, dy: 12 },
    { name: '대구 동구', dx: 18, dy: 10 },
    { name: '대구 중구', dx: 0, dy: 0 },
    { name: '대구 서구', dx: -8, dy: 2 },
    { name: '대구 남구', dx: 0, dy: -6 },
    { name: '대구 달성군', dx: -25, dy: -30 },
    { name: '대구 군위군', dx: -10, dy: 50 }
  ],
  '광주': [
    { name: '광주 북구', dx: 5, dy: 8 },
    { name: '광주 서구', dx: -5, dy: -2 },
    { name: '광주 광산구', dx: -15, dy: 0 },
    { name: '광주 남구', dx: 0, dy: -8 },
    { name: '광주 동구', dx: 8, dy: -4 }
  ],
  '대전': [
    { name: '대전 서구', dx: -5, dy: -5 },
    { name: '대전 유성구', dx: -10, dy: 5 },
    { name: '대전 중구', dx: 2, dy: -8 },
    { name: '대전 대덕구', dx: 8, dy: 10 },
    { name: '대전 동구', dx: 12, dy: -3 }
  ],
  '울산': [
    { name: '울산 남구', dx: 5, dy: -10 },
    { name: '울산 북구', dx: 8, dy: 12 },
    { name: '울산 울주군', dx: -20, dy: -15 },
    { name: '울산 중구', dx: -2, dy: 2 },
    { name: '울산 동구', dx: 18, dy: 2 }
  ],
  '세종': [
    { name: '세종 조치원읍', dx: 0, dy: 15 },
    { name: '세종 한솔동', dx: -5, dy: -5 },
    { name: '세종 아름동', dx: -3, dy: 5 },
    { name: '세종 도담동', dx: 2, dy: 5 }
  ],
  '강원': [
    { name: '춘천시', dx: 0, dy: 20 },
    { name: '원주시', dx: 10, dy: -30 },
    { name: '강릉시', dx: 80, dy: 10 },
    { name: '동해시', dx: 90, dy: -10 },
    { name: '태백시', dx: 85, dy: -50 },
    { name: '속초시', dx: 70, dy: 50 },
    { name: '삼척시', dx: 95, dy: -25 },
    { name: '홍천군', dx: 25, dy: -10 },
    { name: '횡성군', dx: 25, dy: -25 },
    { name: '영월군', dx: 50, dy: -55 },
    { name: '평창군', dx: 50, dy: -25 },
    { name: '정선군', dx: 70, dy: -35 },
    { name: '철원군', dx: -35, dy: 45 },
    { name: '화천군', dx: -15, dy: 35 },
    { name: '양구군', dx: 15, dy: 40 },
    { name: '인제군', dx: 45, dy: 30 },
    { name: '고성군', dx: 70, dy: 70 },
    { name: '양양군', dx: 75, dy: 30 }
  ],
  '충북': [
    { name: '청주시', dx: -20, dy: -10 },
    { name: '충주시', dx: 10, dy: 20 },
    { name: '제천시', dx: 30, dy: 30 },
    { name: '보은군', dx: -15, dy: -35 },
    { name: '옥천군', dx: -25, dy: -55 },
    { name: '영동군', dx: -15, dy: -80 },
    { name: '증평군', dx: -10, dy: 5 },
    { name: '진천군', dx: -22, dy: 15 },
    { name: '괴산군', dx: 0, dy: -2 },
    { name: '음성군', dx: -5, dy: 10 },
    { name: '단양군', dx: 45, dy: 15 }
  ],
  '충남': [
    { name: '천안시', dx: 15, dy: 20 },
    { name: '공주시', dx: 0, dy: -15 },
    { name: '보령시', dx: -35, dy: -50 },
    { name: '아산시', dx: 0, dy: 15 },
    { name: '서산시', dx: -40, dy: 10 },
    { name: '논산시', dx: 5, dy: -45 },
    { name: '계룡시', dx: 8, dy: -35 },
    { name: '당진시', dx: -25, dy: 25 },
    { name: '금산군', dx: 25, dy: -60 },
    { name: '부여군', dx: -15, dy: -45 },
    { name: '서천군', dx: -30, dy: -65 },
    { name: '청양군', dx: -15, dy: -25 },
    { name: '홍성군', dx: -25, dy: -15 },
    { name: '예산군', dx: -12, dy: 2 },
    { name: '태안군', dx: -55, dy: 5 }
  ],
  '전북': [
    { name: '전주시', dx: 5, dy: -10 },
    { name: '군산시', dx: -35, dy: 10 },
    { name: '익산시', dx: -15, dy: 15 },
    { name: '정읍시', dx: -20, dy: -35 },
    { name: '남원시', dx: 30, dy: -45 },
    { name: '김제시', dx: -20, dy: -15 },
    { name: '완주군', dx: 15, dy: -5 },
    { name: '진안군', dx: 25, dy: -10 },
    { name: '무주군', dx: 45, dy: 5 },
    { name: '장수군', dx: 35, dy: -25 },
    { name: '임실군', dx: 15, dy: -30 },
    { name: '순창군', dx: 10, dy: -50 },
    { name: '고창군', dx: -35, dy: -50 },
    { name: '부안군', dx: -35, dy: -25 }
  ],
  '전남': [
    { name: '목포시', dx: -50, dy: -10 },
    { name: '여수시', dx: 40, dy: -40 },
    { name: '순천시', dx: 25, dy: -20 },
    { name: '나주시', dx: -20, dy: -10 },
    { name: '광양시', dx: 45, dy: -15 },
    { name: '담양군', dx: 0, dy: 15 },
    { name: '곡성군', dx: 15, dy: 5 },
    { name: '구례군', dx: 30, dy: 5 },
    { name: '고흥군', dx: 20, dy: -50 },
    { name: '보성군', dx: 10, dy: -35 },
    { name: '화순군', dx: 10, dy: -15 },
    { name: '장흥군', dx: -5, dy: -35 },
    { name: '강진군', dx: -15, dy: -35 },
    { name: '해남군', dx: -30, dy: -40 },
    { name: '영암군', dx: -25, dy: -20 },
    { name: '무안군', dx: -40, dy: -5 },
    { name: '함평군', dx: -35, dy: 5 },
    { name: '영광군', dx: -35, dy: 20 },
    { name: '장성군', dx: -15, dy: 20 },
    { name: '완도군', dx: -15, dy: -65 },
    { name: '진도군', dx: -55, dy: -55 },
    { name: '신안군', dx: -65, dy: -15 }
  ],
  '경북': [
    { name: '포항시', dx: 60, dy: -30 },
    { name: '경주시', dx: 50, dy: -60 },
    { name: '김천시', dx: -45, dy: -20 },
    { name: '안동시', dx: 5, dy: 40 },
    { name: '구미시', dx: -30, dy: 0 },
    { name: '영주시', dx: -5, dy: 75 },
    { name: '영천시', dx: 25, dy: -40 },
    { name: '상주시', dx: -45, dy: 25 },
    { name: '문경시', dx: -40, dy: 50 },
    { name: '경산시', dx: -5, dy: -60 },
    { name: '의성군', dx: -10, dy: 20 },
    { name: '청송군', dx: 30, dy: 20 },
    { name: '영양군', dx: 30, dy: 45 },
    { name: '영덕군', dx: 50, dy: 20 },
    { name: '청도군', dx: 10, dy: -65 },
    { name: '고령군', dx: -20, dy: -55 },
    { name: '성주군', dx: -35, dy: -40 },
    { name: '칠곡군', dx: -20, dy: -25 },
    { name: '예천군', dx: -20, dy: 50 },
    { name: '봉화군', dx: 15, dy: 75 },
    { name: '울진군', dx: 55, dy: 60 },
    { name: '울릉군', dx: 150, dy: 90 }
  ],
  '경남': [
    { name: '창원시', dx: 10, dy: -10 },
    { name: '진주시', dx: -50, dy: -20 },
    { name: '통영시', dx: -25, dy: -60 },
    { name: '사천시', dx: -40, dy: -40 },
    { name: '김해시', dx: 35, dy: -12 },
    { name: '밀양시', dx: 25, dy: 10 },
    { name: '거제시', dx: 0, dy: -65 },
    { name: '양산시', dx: 45, dy: 5 },
    { name: '의령군', dx: -20, dy: -10 },
    { name: '함안군', dx: -10, dy: -15 },
    { name: '창녕군', dx: -5, dy: 15 },
    { name: '고성군', dx: -20, dy: -45 },
    { name: '남해군', dx: -60, dy: -55 },
    { name: '하동군', dx: -70, dy: -30 },
    { name: '산청군', dx: -50, dy: 5 },
    { name: '함양군', dx: -65, dy: 15 },
    { name: '거창군', dx: -55, dy: 35 },
    { name: '합천군', dx: -30, dy: 15 }
  ],
  '제주': [
    { name: '제주시', dx: 0, dy: 15 },
    { name: '서귀포시', dx: 0, dy: -20 }
  ]
};

export default function Quotation() {
  const navigate = useNavigate()

  // Input states
  const [originRegion, setOriginRegion] = useState('서울')
  const [originDetail, setOriginDetail] = useState('')
  const [originDistrict, setOriginDistrict] = useState(() => {
    const list = DISTRICTS_MAP['서울'] || []
    return list[0]?.name || ''
  })
  const [addressSearchInput, setAddressSearchInput] = useState('')
  const [carType, setCarType] = useState<'cargo' | 'wing_top' | 'refrigerated'>('cargo')
  const [activePostcodeField, setActivePostcodeField] = useState<string | null>(null)

  // Load Daum Postcode API script on mount if not already present
  React.useEffect(() => {
    if (!(window as any).daum) {
      const script = document.createElement('script');
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const mapSidoToRegion = (sido: string): string => {
    if (sido.includes('서울')) return '서울'
    if (sido.includes('인천')) return '인천'
    if (sido.includes('경기')) return '경기'
    if (sido.includes('강원')) return '강원'
    if (sido.includes('충북') || sido.includes('충청북도')) return '충북'
    if (sido.includes('충남') || sido.includes('충청남도')) return '충남'
    if (sido.includes('대전')) return '대전'
    if (sido.includes('세종')) return '세종'
    if (sido.includes('전북') || sido.includes('전라북도')) return '전북'
    if (sido.includes('전남') || sido.includes('전라남도')) return '전남'
    if (sido.includes('광주')) return '광주'
    if (sido.includes('경북') || sido.includes('경상북도')) return '경북'
    if (sido.includes('경남') || sido.includes('경상남도')) return '경남'
    if (sido.includes('대구')) return '대구'
    if (sido.includes('울산')) return '울산'
    if (sido.includes('부산')) return '부산'
    if (sido.includes('제주')) return '제주'
    return '서울'
  }
  
  // Surcharge conditions
  const [surchargeWeekend, setSurchargeWeekend] = useState(false)
  const [surchargeNight, setSurchargeNight] = useState(false)
  const [surchargeWeather, setSurchargeWeather] = useState(false)
  
  // Supply/Demand multiplier
  const [demandFactor, setDemandFactor] = useState(1.0)
  
  // Company Profit Rate (%)
  const [profitRate, setProfitRate] = useState(10)
  
  // Filter search
  const [searchQuery, setSearchQuery] = useState('')
  
  // Selected Quote Detail
  const [selectedQuote, setSelectedQuote] = useState<{
    destination: string
    tonnage: number
    tonnageLabel: string
    fee: number
  } | null>(null)

  const [expandedProvince, setExpandedProvince] = useState<string | null>(null)

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

  // Get active origin coordinates taking selected district into account
  const getOriginCoordinates = () => {
    const parent = REGIONS.find(r => r.name === originRegion) || { x: 0, y: 0 }
    const districts = DISTRICTS_MAP[originRegion] || []
    const matched = districts.find(d => d.name === originDistrict || d.name === (originRegion + ' ' + originDistrict))
    if (matched) {
      return { x: parent.x + matched.dx, y: parent.y + matched.dy }
    }
    return { x: parent.x, y: parent.y }
  }

  // Calculate distance for any target coordinate
  const calculateDistance = (_originName: string, target: { x: number, y: number }) => {
    const origin = getOriginCoordinates()
    const dx = origin.x - target.x
    const dy = origin.y - target.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    return dist === 0 ? 10 : dist
  }

  // Calculate fare for any target coordinate
  const calculateFareForCoordinates = (targetX: number, targetY: number, tonnageMultiplier: number) => {
    const origin = getOriginCoordinates()
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
    fare *= (1 + profitRate / 100)

    return Math.round(fare / 5000) * 5000
  }

  // Generate dynamic calculation logic
  const calculateFare = (destName: string, tonnageMultiplier: number) => {
    const origin = getOriginCoordinates()
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
    fare *= (1 + profitRate / 100)

    // 7. Round to nearest 5,000 won (logistic standard)
    return Math.round(fare / 5000) * 5000
  }

  // Get detailed breakdown of selected quote
  const getSelectedQuoteBreakdown = () => {
    if (!selectedQuote) return null;
    const destName = selectedQuote.destination;
    const tonnage = TONNAGES.find(t => t.value === selectedQuote.tonnage) || TONNAGES[0];
    const tonnageMultiplier = tonnage.multiplier;

    let targetX = 0;
    let targetY = 0;
    let isDistrict = false;
    
    let parentRegionName = "";
    for (const rName of Object.keys(DISTRICTS_MAP)) {
      if (destName.startsWith(rName) || destName.includes(rName)) {
        parentRegionName = rName;
        break;
      }
    }

    if (parentRegionName) {
      const districts = DISTRICTS_MAP[parentRegionName] || [];
      const cleanDest = destName.replace(parentRegionName + " ", "");
      const matched = districts.find(d => d.name === destName || d.name === cleanDest);
      if (matched) {
        const parentCoords = getCoordinates(parentRegionName);
        targetX = parentCoords.x + matched.dx;
        targetY = parentCoords.y + matched.dy;
        isDistrict = true;
      }
    }

    if (!isDistrict) {
      const coords = getCoordinates(destName);
      targetX = coords.x;
      targetY = coords.y;
    }

    const origin = getOriginCoordinates();
    const dx = origin.x - targetX;
    const dy = origin.y - targetY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let rawBase = 0;
    if (distance === 0) {
      rawBase = 60000;
    } else {
      rawBase = 60000 + distance * 550;
    }

    // Ferry surcharge for Jeju Island
    if (originRegion === "제주" || destName.includes("제주")) {
      if (originRegion !== "제주" || !destName.includes("제주")) {
        rawBase += 250000;
      }
    }

    const baseFare = rawBase * tonnageMultiplier;

    const surchargesList = [];
    let currentFare = baseFare;

    if (carType === "wing_top") {
      surchargesList.push({ label: "윙바디/탑차 (+10%)", amount: baseFare * 0.10 });
      currentFare *= 1.10;
    } else if (carType === "refrigerated") {
      surchargesList.push({ label: "냉동/냉장 (+25%)", amount: baseFare * 0.25 });
      currentFare *= 1.25;
    }

    if (surchargeWeekend) {
      surchargesList.push({ label: "주말/공휴일 (+10%)", amount: currentFare * 0.10 });
      currentFare *= 1.10;
    }
    if (surchargeNight) {
      surchargesList.push({ label: "야간배송 (+20%)", amount: currentFare * 0.20 });
      currentFare *= 1.20;
    }
    if (surchargeWeather) {
      surchargesList.push({ label: "기상악화 (+15%)", amount: currentFare * 0.15 });
      currentFare *= 1.15;
    }

    const totalSurcharges = surchargesList.reduce((sum, item) => sum + item.amount, 0);
    const netCost = currentFare * demandFactor;
    const profitAmount = netCost * (profitRate / 100);

    return {
      distance,
      baseFare,
      surchargesList,
      totalSurcharges,
      demandFactor,
      profitRate,
      profitAmount
    };
  }

  const breakdown = getSelectedQuoteBreakdown();

  const selectedQuoteFee = useMemo(() => {
    if (!selectedQuote) return 0;
    const tonnage = TONNAGES.find(t => t.value === selectedQuote.tonnage) || TONNAGES[0];
    return calculateFare(selectedQuote.destination, tonnage.multiplier);
  }, [selectedQuote, originRegion, originDistrict, carType, surchargeWeekend, surchargeNight, surchargeWeather, demandFactor, profitRate]);

  // Filtered regions for table (checks province name or child districts)
  const filteredRegions = useMemo(() => {
    const query = searchQuery.trim()
    if (!query) return REGIONS
    return REGIONS.filter(region => {
      const provinceMatches = region.name.includes(query)
      const districts = DISTRICTS_MAP[region.name] || []
      const districtMatches = districts.some(d => d.name.includes(query))
      return provinceMatches || districtMatches
    })
  }, [searchQuery])

  // Automatically expand matching provinces when search query matches a child district
  React.useEffect(() => {
    const query = searchQuery.trim()
    if (!query) return
    for (const region of REGIONS) {
      const districts = DISTRICTS_MAP[region.name] || []
      if (districts.some(d => d.name.includes(query))) {
        setExpandedProvince(region.name)
        break
      }
    }
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%', overflow: 'hidden' }}>
      
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem', flex: 1, overflow: 'hidden' }} className="responsive-layout-grid-quote">
        
        {/* Left Column: Config Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%', overflow: 'hidden' }}>
          
          <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: 'none', flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
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

            {/* Origin province and district selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>상차지 선택 (시/도 및 구)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <select 
                  value={originRegion} 
                  onChange={(e) => {
                    const newRegion = e.target.value
                    setOriginRegion(newRegion)
                    const list = DISTRICTS_MAP[newRegion] || []
                    setOriginDistrict(list[0]?.name || '')
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

                <select 
                  value={originDistrict} 
                  onChange={(e) => {
                    setOriginDistrict(e.target.value)
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
                  disabled={!(DISTRICTS_MAP[originRegion] && DISTRICTS_MAP[originRegion].length > 0)}
                >
                  {(DISTRICTS_MAP[originRegion] || []).map(d => {
                    const shortName = d.name.includes(originRegion) ? d.name.replace(originRegion + ' ', '') : d.name
                    return (
                      <option key={d.name} value={d.name}>{shortName}</option>
                    )
                  })}
                  {!(DISTRICTS_MAP[originRegion] && DISTRICTS_MAP[originRegion].length > 0) && (
                    <option value="">일반(시/도 전체)</option>
                  )}
                </select>
              </div>
            </div>

            {/* Address Search Finder */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', position: 'relative' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>주소로 상차지 찾기</label>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <Input 
                  placeholder="클릭하여 주소 검색 API 실행" 
                  value={addressSearchInput}
                  onClick={() => setActivePostcodeField(activePostcodeField === 'origin' ? null : 'origin')}
                  readOnly
                  style={{ paddingLeft: '2rem', paddingRight: '0.5rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}
                />
              </div>

              {activePostcodeField === 'origin' && (
                <>
                  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} onClick={() => setActivePostcodeField(null)} />
                  <div 
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      height: '320px',
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
                              setAddressSearchInput(addr);
                              
                              // Auto-map region & district coordinates
                              const regionName = mapSidoToRegion(data.sido);
                              setOriginRegion(regionName);
                              
                              const districtsList = DISTRICTS_MAP[regionName] || [];
                              const matchedDistrict = districtsList.find(d => {
                                const cleanD = d.name.replace(regionName + ' ', '');
                                return data.sigungu.includes(cleanD) || cleanD.includes(data.sigungu);
                              });
                              
                              setOriginDistrict(matchedDistrict ? matchedDistrict.name : (districtsList[0]?.name || ''));
                              setOriginDetail(addr);
                              setActivePostcodeField(null);
                              setSelectedQuote(null);
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
                  onClick={() => { setSurchargeWeekend(!surchargeWeekend); }}
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
                  onClick={() => { setSurchargeNight(!surchargeNight); }}
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
                  onClick={() => { setSurchargeWeather(!surchargeWeather); }}
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

            {/* Company Profit Margin Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>회사 이익률 설정</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {profitRate}%
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={profitRate}
                  onChange={(e) => {
                    setProfitRate(parseInt(e.target.value))
                  }}
                  style={{
                    flex: 1,
                    cursor: 'pointer',
                    accentColor: 'var(--primary)'
                  }}
                />
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={profitRate}
                  onChange={(e: any) => {
                    const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                    setProfitRate(val)
                  }}
                  style={{ width: '65px', padding: '0.3rem', fontSize: '0.78rem', textAlign: 'center' }}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                <span>0% (차주 요금 원가)</span>
                <span>10% (기본마진)</span>
                <span>50% (최대)</span>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%', overflow: 'hidden' }}>
          
          <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: 'none', height: '100%', flex: 1, overflow: 'hidden' }}>
            
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
            <div className="responsive-table-wrapper hide-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
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
                    const isExpanded = expandedProvince === region.name;
                    const districts = DISTRICTS_MAP[region.name] || [];
                    const parentDist = calculateDistance(originRegion, region);
                    
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
                              cursor: 'pointer',
                              userSelect: 'none'
                            }}
                            onClick={() => {
                              setExpandedProvince(isExpanded ? null : region.name)
                            }}
                          >
                            <span style={{ fontSize: '0.68rem', marginRight: '0.35rem', color: 'var(--text-tertiary)' }}>
                              {isExpanded ? '▼' : '▶'}
                            </span>
                            {region.name}
                            {region.name === originRegion ? (
                              <span style={{ fontSize: '0.65rem', marginLeft: '0.25rem', padding: '0.05rem 0.35rem', backgroundColor: 'var(--primary)', color: '#ffffff', borderRadius: 'var(--radius-sm)' }}>상차</span>
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginLeft: '0.35rem', fontWeight: 700 }}>
                                ({parentDist.toFixed(0)}km)
                              </span>
                            )}
                          </td>
                          {TONNAGES.map(tonnage => {
                            const calculatedFee = calculateFare(region.name, tonnage.multiplier)
                            const isSelected = selectedQuote && selectedQuote.destination === region.name && selectedQuote.tonnage === tonnage.value
                            const ratePerKm = Math.round(calculatedFee / parentDist)
                            
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
                                <div>{(calculatedFee / 10000).toFixed(1)}만</div>
                                <div style={{ 
                                  fontSize: '0.72rem', 
                                  color: '#16a34a', marginTop: '0.15rem', fontWeight: 700 
                                }}>
                                  {ratePerKm.toLocaleString()}원/km
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                        {isExpanded && (
                          districts.filter(d => {
                            const query = searchQuery.trim()
                            if (!query) return true
                            if (region.name.includes(query)) return true
                            return d.name.includes(query)
                          }).map(district => {
                            const dist = calculateDistance(originRegion, {
                              x: getCoordinates(region.name).x + district.dx,
                              y: getCoordinates(region.name).y + district.dy
                            })
                            
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
                                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                    <span style={{ color: 'var(--text-tertiary)' }}>↳</span> {district.name.includes(region.name) ? district.name.replace(region.name + ' ', '') : district.name}
                                  </div>
                                  <div style={{ marginTop: '0.25rem' }}>
                                    <span style={{ 
                                      display: 'inline-block', 
                                      padding: '0.15rem 0.45rem', 
                                      fontSize: '0.7rem', 
                                      fontWeight: 800, 
                                      backgroundColor: 'var(--border-color)', 
                                      color: 'var(--text-primary)', 
                                      borderRadius: 'var(--radius-sm)' 
                                    }}>
                                      {dist.toFixed(1)} km
                                    </span>
                                  </div>
                                </td>
                                {TONNAGES.map(tonnage => {
                                  const calculatedFee = calculateFareForCoordinates(
                                    getCoordinates(region.name).x + district.dx,
                                    getCoordinates(region.name).y + district.dy,
                                    tonnage.multiplier
                                  )
                                  const fullDestName = district.name.includes(region.name) ? district.name : (region.name + ' ' + district.name)
                                  const isSelected = selectedQuote && selectedQuote.destination === fullDestName && selectedQuote.tonnage === tonnage.value
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
                                          destination: fullDestName,
                                          tonnage: tonnage.value,
                                          tonnageLabel: tonnage.label,
                                          fee: calculatedFee
                                        })
                                      }}
                                      title={tonnage.label + ' 단가: ' + ratePerKm.toLocaleString() + '원/km'}
                                    >
                                      <div>{(calculatedFee / 10000).toFixed(1)}만</div>
                                      <div style={{ 
                                        fontSize: '0.72rem', 
                                        color: '#16a34a', marginTop: '0.15rem', fontWeight: 700 
                                      }}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1 }}>
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
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>선택된 견적 상세 요약</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.1rem', marginBottom: '0.35rem' }}>
                      {originRegion} → {selectedQuote.destination} ({selectedQuote.tonnageLabel} {carType === 'refrigerated' ? '냉동' : carType === 'wing_top' ? '윙바디' : '카고'})
                    </div>
                    {breakdown && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                        <div>기본금액: <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{Math.round(breakdown.baseFare).toLocaleString()}원</span></div>
                        <div style={{ color: 'var(--border-color)' }}>|</div>
                        {breakdown.surchargesList.length > 0 ? (
                          <div>
                            할증: {breakdown.surchargesList.map((s, idx) => (
                              <span key={idx} style={{ marginRight: '0.35rem' }}>
                                <span style={{ fontWeight: 600 }}>{s.label.split(' ')[0]}</span>
                                <span style={{ color: 'var(--primary)', fontWeight: 700 }}> (+{Math.round(s.amount).toLocaleString()}원)</span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div>할증: <span style={{ fontWeight: 600 }}>없음</span></div>
                        )}
                        <div style={{ color: 'var(--border-color)' }}>|</div>
                        <div>수급조절배수: <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{breakdown.demandFactor.toFixed(2)}x</span></div>
                        <div style={{ color: 'var(--border-color)' }}>|</div>
                        <div>회사이익률: <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{breakdown.profitRate}%</span> <span style={{ color: 'var(--primary)', fontWeight: 700 }}>(+{Math.round(breakdown.profitAmount).toLocaleString()}원)</span></div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.45rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.1rem' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>최종 견적 운임:</span>
                    <span style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 900 }}>
                      {selectedQuoteFee.toLocaleString()}원
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>(VAT 별도)</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button 
                      variant="outline" 
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                      onClick={() => copyQuoteToClipboard(selectedQuote.destination, selectedQuote.tonnageLabel, selectedQuoteFee)}
                    >
                      <Copy size={13} /> 클립보드 복사
                    </Button>
                    <Button 
                      variant="primary" 
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                      onClick={() => handleCreateDispatch(selectedQuote.destination, selectedQuote.tonnage, selectedQuoteFee)}
                    >
                      신규 배차 등록 <ArrowRight size={13} />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
                      </Card>
        </div>

      </div>

    </div>
  )
}
