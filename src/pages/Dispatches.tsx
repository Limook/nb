import React, { useState } from 'react'
import { Card, Button, Input, Badge } from '../components/ui'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Check, Route, ChevronDown, ChevronUp, FileText, Star } from 'lucide-react'

// Rich historical dispatch data for calculating recommendations
const initialHistoricalDispatches = [
  {
    "client": "가온물류",
    "origin": "서울 마포구 독막로",
    "destination": "경북 구미시 3공단로",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 200000,
    "date": "2026-07-01T09:00:00"
  },
  {
    "client": "나래물산",
    "origin": "경기 화성시 동탄산단로",
    "destination": "대구 달서구 성서공단로",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 250000,
    "date": "2026-07-02T09:00:00"
  },
  {
    "client": "다솜유통",
    "origin": "경기 안산시 단원구",
    "destination": "경남 창원시 성산구",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 300000,
    "date": "2026-07-03T09:00:00"
  },
  {
    "client": "라온제나",
    "origin": "서울 영등포구 여의나루로",
    "destination": "부산 강서구 녹산산단로",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 350000,
    "date": "2026-07-04T09:00:00"
  },
  {
    "client": "마루아라",
    "origin": "부산 강서구 과학산단로",
    "destination": "경북 포항시 남구 괴동로",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 400000,
    "date": "2026-07-05T09:00:00"
  },
  {
    "client": "바른로지스",
    "origin": "세종 연서면 공단로",
    "destination": "서울 금천구 가산디지털로",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 450000,
    "date": "2026-07-06T09:00:00"
  },
  {
    "client": "새솔산업",
    "origin": "울산 남구 장생포로",
    "destination": "충남 서산시 대산읍",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 500000,
    "date": "2026-07-01T09:00:00"
  },
  {
    "client": "아라글로벌",
    "origin": "전남 장성군 물류로",
    "destination": "경북 경산시 진량읍",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 550000,
    "date": "2026-07-02T09:00:00"
  },
  {
    "client": "자람무역",
    "origin": "경북 구미시 수출대로",
    "destination": "서울 강남구 학동로",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 600000,
    "date": "2026-07-03T09:00:00"
  },
  {
    "client": "하랑로지스",
    "origin": "서울 송파구 양재대로",
    "destination": "충남 당진시 송악읍",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 150000,
    "date": "2026-07-04T09:00:00"
  },
  {
    "client": "가온물류",
    "origin": "경기 김포시 고촌읍",
    "destination": "전남 여수시 여수산단로",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 200000,
    "date": "2026-07-05T09:00:00"
  },
  {
    "client": "나래물산",
    "origin": "경기 평택시 포승읍",
    "destination": "울산 남구 산단로",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 250000,
    "date": "2026-07-06T09:00:00"
  },
  {
    "client": "다솜유통",
    "origin": "인천 연수구 송도과학로",
    "destination": "경기 파주시 문산읍",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 300000,
    "date": "2026-07-01T09:00:00"
  },
  {
    "client": "라온제나",
    "origin": "서울 성동구 아차산로",
    "destination": "충남 아산시 배방읍",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 350000,
    "date": "2026-07-02T09:00:00"
  },
  {
    "client": "마루아라",
    "origin": "경남 양산시 어곡산단로",
    "destination": "서울 영등포구 경인로",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 400000,
    "date": "2026-07-03T09:00:00"
  },
  {
    "client": "바른로지스",
    "origin": "대전 대덕구 대화로",
    "destination": "경기 이천시 대장로",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 450000,
    "date": "2026-07-04T09:00:00"
  },
  {
    "client": "새솔산업",
    "origin": "울산 북구 효자로",
    "destination": "전북 군산시 외항로",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 500000,
    "date": "2026-07-05T09:00:00"
  },
  {
    "client": "아라글로벌",
    "origin": "전북 전주시 덕진구",
    "destination": "인천 중구 서해대로",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 550000,
    "date": "2026-07-06T09:00:00"
  },
  {
    "client": "자람무역",
    "origin": "대구 서구 와룡로",
    "destination": "경기 파주시 탄현면",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 600000,
    "date": "2026-07-01T09:00:00"
  },
  {
    "client": "하랑로지스",
    "origin": "경기 광주시 초월읍",
    "destination": "경남 김해시 골든루트로",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 150000,
    "date": "2026-07-02T09:00:00"
  },
  {
    "client": "가온물류",
    "origin": "인천 중구 서해대로",
    "destination": "부산 해운대구 우동",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 200000,
    "date": "2026-07-03T09:00:00"
  },
  {
    "client": "나래물산",
    "origin": "경기 성남시 분당구",
    "destination": "충남 천안시 서북구",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 250000,
    "date": "2026-07-04T09:00:00"
  },
  {
    "client": "다솜유통",
    "origin": "인천 중구 아암대로",
    "destination": "충북 청주시 흥덕구",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 300000,
    "date": "2026-07-05T09:00:00"
  },
  {
    "client": "라온제나",
    "origin": "경기 김포시 대곶면",
    "destination": "광주 광산구 하남산단로",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 350000,
    "date": "2026-07-06T09:00:00"
  },
  {
    "client": "마루아라",
    "origin": "부산 사하구 신평로",
    "destination": "경기 평택시 경기대로",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 400000,
    "date": "2026-07-01T09:00:00"
  },
  {
    "client": "바른로지스",
    "origin": "충북 청주시 청원구",
    "destination": "경남 창원시 진해구",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 450000,
    "date": "2026-07-02T09:00:00"
  },
  {
    "client": "새솔산업",
    "origin": "경남 양산시 웅상대로",
    "destination": "경기 시흥시 공단대로",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 500000,
    "date": "2026-07-03T09:00:00"
  },
  {
    "client": "아라글로벌",
    "origin": "광주 광산구 사암로",
    "destination": "경기 용인시 처인구",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 550000,
    "date": "2026-07-04T09:00:00"
  },
  {
    "client": "자람무역",
    "origin": "경북 칠곡군 왜관읍",
    "destination": "전남 목포시 삼학로",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 600000,
    "date": "2026-07-05T09:00:00"
  },
  {
    "client": "하랑로지스",
    "origin": "경기 용인시 백암면",
    "destination": "부산 사상구 백양대로",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 150000,
    "date": "2026-07-06T09:00:00"
  },
  {
    "client": "가온물류",
    "origin": "서울 마포구 독막로",
    "destination": "경북 구미시 3공단로",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 200000,
    "date": "2026-07-01T09:00:00"
  },
  {
    "client": "나래물산",
    "origin": "경기 화성시 동탄산단로",
    "destination": "대구 달서구 성서공단로",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 250000,
    "date": "2026-07-02T09:00:00"
  },
  {
    "client": "다솜유통",
    "origin": "경기 안산시 단원구",
    "destination": "경남 창원시 성산구",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 300000,
    "date": "2026-07-03T09:00:00"
  },
  {
    "client": "라온제나",
    "origin": "서울 영등포구 여의나루로",
    "destination": "부산 강서구 녹산산단로",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 350000,
    "date": "2026-07-04T09:00:00"
  },
  {
    "client": "마루아라",
    "origin": "부산 강서구 과학산단로",
    "destination": "경북 포항시 남구 괴동로",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 400000,
    "date": "2026-07-05T09:00:00"
  },
  {
    "client": "바른로지스",
    "origin": "세종 연서면 공단로",
    "destination": "서울 금천구 가산디지털로",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 450000,
    "date": "2026-07-06T09:00:00"
  },
  {
    "client": "새솔산업",
    "origin": "울산 남구 장생포로",
    "destination": "충남 서산시 대산읍",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 500000,
    "date": "2026-07-01T09:00:00"
  },
  {
    "client": "아라글로벌",
    "origin": "전남 장성군 물류로",
    "destination": "경북 경산시 진량읍",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 550000,
    "date": "2026-07-02T09:00:00"
  },
  {
    "client": "자람무역",
    "origin": "경북 구미시 수출대로",
    "destination": "서울 강남구 학동로",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 600000,
    "date": "2026-07-03T09:00:00"
  },
  {
    "client": "하랑로지스",
    "origin": "서울 송파구 양재대로",
    "destination": "충남 당진시 송악읍",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 150000,
    "date": "2026-07-04T09:00:00"
  },
  {
    "client": "가온물류",
    "origin": "경기 김포시 고촌읍",
    "destination": "전남 여수시 여수산단로",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 200000,
    "date": "2026-07-05T09:00:00"
  },
  {
    "client": "나래물산",
    "origin": "경기 평택시 포승읍",
    "destination": "울산 남구 산단로",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 250000,
    "date": "2026-07-06T09:00:00"
  },
  {
    "client": "다솜유통",
    "origin": "인천 연수구 송도과학로",
    "destination": "경기 파주시 문산읍",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 300000,
    "date": "2026-07-01T09:00:00"
  },
  {
    "client": "라온제나",
    "origin": "서울 성동구 아차산로",
    "destination": "충남 아산시 배방읍",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 350000,
    "date": "2026-07-02T09:00:00"
  },
  {
    "client": "마루아라",
    "origin": "경남 양산시 어곡산단로",
    "destination": "서울 영등포구 경인로",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 400000,
    "date": "2026-07-03T09:00:00"
  },
  {
    "client": "바른로지스",
    "origin": "대전 대덕구 대화로",
    "destination": "경기 이천시 대장로",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 450000,
    "date": "2026-07-04T09:00:00"
  },
  {
    "client": "새솔산업",
    "origin": "울산 북구 효자로",
    "destination": "전북 군산시 외항로",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 500000,
    "date": "2026-07-05T09:00:00"
  },
  {
    "client": "아라글로벌",
    "origin": "전북 전주시 덕진구",
    "destination": "인천 중구 서해대로",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 550000,
    "date": "2026-07-06T09:00:00"
  },
  {
    "client": "자람무역",
    "origin": "대구 서구 와룡로",
    "destination": "경기 파주시 탄현면",
    "tonnage": "11톤",
    "carType": "카고",
    "weight": "5T",
    "fee": 600000,
    "date": "2026-07-01T09:00:00"
  },
  {
    "client": "하랑로지스",
    "origin": "경기 광주시 초월읍",
    "destination": "경남 김해시 골든루트로",
    "tonnage": "5톤",
    "carType": "윙바디",
    "weight": "5T",
    "fee": 150000,
    "date": "2026-07-02T09:00:00"
  }
]

const dummyDrivers = [
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

const tonnages = ['1톤', '1.4톤', '2.5톤', '3.5톤', '5톤', '8톤', '11톤', '18톤', '25톤']
const carTypes = ['카고', '윙바디', '탑차', '냉장탑', '냉동탑', '윙카', '추레라', '리프트']

type DispatchStatus = 'dispatching' | 'dispatched' | 'cancelled' | 'loaded' | 'unloaded' | 'completed'

export default function Dispatches() {
  const navigate = useNavigate()
  const getLocalDateTimeString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getInitialDates = () => {
    const now = new Date();
    const later = new Date();
    later.setHours(later.getHours() + 3);
    return {
      originDate: getLocalDateTimeString(now),
      destinationDate: getLocalDateTimeString(later)
    };
  };

  const addDaysAndFormat = (baseStr: string, days: number) => {
    const dateObj = baseStr ? new Date(baseStr.substring(0, 10)) : new Date();
    if (isNaN(dateObj.getTime())) return '';
    dateObj.setDate(dateObj.getDate() + days);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatEndOfMonth = (baseStr: string, offsetMonths: number) => {
    const dateObj = baseStr ? new Date(baseStr.substring(0, 10)) : new Date();
    if (isNaN(dateObj.getTime())) return '';
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const lastDay = new Date(year, month + offsetMonths + 1, 0);
    const yyyy = lastDay.getFullYear();
    const mm = String(lastDay.getMonth() + 1).padStart(2, '0');
    const dd = String(lastDay.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [formData, setFormData] = useState(() => {
    const dates = getInitialDates();
    return {
      clientName: '',
      clientPhone: '',
      clientContact: '',
      origin: '',
      originDate: dates.originDate,
      destination: '',
      destinationDate: dates.destinationDate,
      waypoints: [] as string[],
      tonnage: '',
      carType: '',
      weight: '',
      settleMethod: '인수증', // 인수증, 선불, 착불, 카드
      fee: '',
      commission: '',
      settleDate: '',
      cargoItem: '',
      memo: ''
    };
  });

  // Dispatches state (Database representation in memory)
  const [dispatches, setDispatches] = useState<any[]>(() => {
    const saved = localStorage.getItem('dispatches')
    const initialItems = saved ? JSON.parse(saved) : [
  {
    "id": 1,
    "client": "가온물류",
    "origin": "서울 마포구 독막로",
    "originDate": "2026-07-01T11:00:00",
    "destination": "경북 구미시 3공단로",
    "destinationDate": "2026-07-01T16:00:00",
    "spec": "11톤 카고",
    "status": "loaded",
    "fee": 200000,
    "settleMethod": "인수증",
    "commission": "",
    "settleDate": "2026-08-01",
    "cargoItem": "철강",
    "memo": "특이사항 없음",
    "date": "2026-07-01T09:00:00",
    "driverName": "김차주",
    "driverPhone": "010-1001-2001",
    "carNumber": "서울81바1001"
  },
  {
    "id": 2,
    "client": "나래물산",
    "origin": "경기 화성시 동탄산단로",
    "originDate": "2026-07-02T11:00:00",
    "destination": "대구 달서구 성서공단로",
    "destinationDate": "2026-07-02T16:00:00",
    "spec": "5톤 윙바디",
    "status": "dispatched",
    "fee": 250000,
    "settleMethod": "선불",
    "commission": "12500",
    "settleDate": "2026-08-02",
    "cargoItem": "기계",
    "memo": "시간 엄수 바랍니다",
    "date": "2026-07-02T09:00:00",
    "driverName": "이기사",
    "driverPhone": "010-1002-2002",
    "carNumber": "경기82사1002"
  },
  {
    "id": 3,
    "client": "다솜유통",
    "origin": "경기 안산시 단원구",
    "originDate": "2026-07-03T11:00:00",
    "destination": "경남 창원시 성산구",
    "destinationDate": "2026-07-03T16:00:00",
    "spec": "11톤 카고",
    "status": "dispatching",
    "fee": 300000,
    "settleMethod": "착불",
    "commission": "15000",
    "settleDate": "2026-08-03",
    "cargoItem": "박스",
    "memo": "지게차 하차 필요",
    "date": "2026-07-03T09:00:00",
    "driverName": "",
    "driverPhone": "",
    "carNumber": ""
  },
  {
    "id": 4,
    "client": "라온제나",
    "origin": "서울 영등포구 여의나루로",
    "originDate": "2026-07-04T11:00:00",
    "destination": "부산 강서구 녹산산단로",
    "destinationDate": "2026-07-04T16:00:00",
    "spec": "5톤 윙바디",
    "status": "cancelled",
    "fee": 350000,
    "settleMethod": "카드",
    "commission": "17500",
    "settleDate": "2026-07-04",
    "cargoItem": "빠레트",
    "memo": "안전운전 필수",
    "date": "2026-07-04T09:00:00",
    "driverName": "최차주",
    "driverPhone": "010-1004-2004",
    "carNumber": "부산84바1004"
  },
  {
    "id": 5,
    "client": "마루아라",
    "origin": "부산 강서구 과학산단로",
    "originDate": "2026-07-05T11:00:00",
    "destination": "경북 포항시 남구 괴동로",
    "destinationDate": "2026-07-05T16:00:00",
    "spec": "11톤 카고",
    "status": "completed",
    "fee": 400000,
    "settleMethod": "인수증",
    "commission": "",
    "settleDate": "2026-08-05",
    "cargoItem": "철강",
    "memo": "상하차 전 기사 통화 요망",
    "date": "2026-07-05T09:00:00",
    "driverName": "정기사",
    "driverPhone": "010-1005-2005",
    "carNumber": "대구85사1005"
  },
  {
    "id": 6,
    "client": "바른로지스",
    "origin": "세종 연서면 공단로",
    "originDate": "2026-07-06T11:00:00",
    "destination": "서울 금천구 가산디지털로",
    "destinationDate": "2026-07-06T16:00:00",
    "spec": "5톤 윙바디",
    "status": "loaded",
    "fee": 450000,
    "settleMethod": "선불",
    "commission": "22500",
    "settleDate": "2026-08-06",
    "cargoItem": "기계",
    "memo": "특이사항 없음",
    "date": "2026-07-06T09:00:00",
    "driverName": "강차주",
    "driverPhone": "010-1006-2006",
    "carNumber": "대전86아1006"
  },
  {
    "id": 7,
    "client": "새솔산업",
    "origin": "울산 남구 장생포로",
    "originDate": "2026-07-01T11:00:00",
    "destination": "충남 서산시 대산읍",
    "destinationDate": "2026-07-01T16:00:00",
    "spec": "11톤 카고",
    "status": "dispatched",
    "fee": 500000,
    "settleMethod": "착불",
    "commission": "25000",
    "settleDate": "2026-08-01",
    "cargoItem": "박스",
    "memo": "시간 엄수 바랍니다",
    "date": "2026-07-01T09:00:00",
    "driverName": "조기사",
    "driverPhone": "010-1007-2007",
    "carNumber": "울산87바1007"
  },
  {
    "id": 8,
    "client": "아라글로벌",
    "origin": "전남 장성군 물류로",
    "originDate": "2026-07-02T11:00:00",
    "destination": "경북 경산시 진량읍",
    "destinationDate": "2026-07-02T16:00:00",
    "spec": "5톤 윙바디",
    "status": "dispatching",
    "fee": 550000,
    "settleMethod": "카드",
    "commission": "27500",
    "settleDate": "2026-07-02",
    "cargoItem": "빠레트",
    "memo": "지게차 하차 필요",
    "date": "2026-07-02T09:00:00",
    "driverName": "",
    "driverPhone": "",
    "carNumber": ""
  },
  {
    "id": 9,
    "client": "자람무역",
    "origin": "경북 구미시 수출대로",
    "originDate": "2026-07-03T11:00:00",
    "destination": "서울 강남구 학동로",
    "destinationDate": "2026-07-03T16:00:00",
    "spec": "11톤 카고",
    "status": "cancelled",
    "fee": 600000,
    "settleMethod": "인수증",
    "commission": "",
    "settleDate": "2026-08-03",
    "cargoItem": "철강",
    "memo": "안전운전 필수",
    "date": "2026-07-03T09:00:00",
    "driverName": "장기사",
    "driverPhone": "010-1009-2009",
    "carNumber": "세종89아1009"
  },
  {
    "id": 10,
    "client": "하랑로지스",
    "origin": "서울 송파구 양재대로",
    "originDate": "2026-07-04T11:00:00",
    "destination": "충남 당진시 송악읍",
    "destinationDate": "2026-07-04T16:00:00",
    "spec": "5톤 윙바디",
    "status": "completed",
    "fee": 150000,
    "settleMethod": "선불",
    "commission": "7500",
    "settleDate": "2026-08-04",
    "cargoItem": "기계",
    "memo": "상하차 전 기사 통화 요망",
    "date": "2026-07-04T09:00:00",
    "driverName": "임차주",
    "driverPhone": "010-1010-2010",
    "carNumber": "경기90바1010"
  },
  {
    "id": 11,
    "client": "가온물류",
    "origin": "경기 김포시 고촌읍",
    "originDate": "2026-07-05T11:00:00",
    "destination": "전남 여수시 여수산단로",
    "destinationDate": "2026-07-05T16:00:00",
    "spec": "11톤 카고",
    "status": "loaded",
    "fee": 200000,
    "settleMethod": "착불",
    "commission": "10000",
    "settleDate": "2026-08-05",
    "cargoItem": "박스",
    "memo": "특이사항 없음",
    "date": "2026-07-05T09:00:00",
    "driverName": "한기사",
    "driverPhone": "010-1011-2011",
    "carNumber": "서울91사1011"
  },
  {
    "id": 12,
    "client": "나래물산",
    "origin": "경기 평택시 포승읍",
    "originDate": "2026-07-06T11:00:00",
    "destination": "울산 남구 산단로",
    "destinationDate": "2026-07-06T16:00:00",
    "spec": "5톤 윙바디",
    "status": "dispatched",
    "fee": 250000,
    "settleMethod": "카드",
    "commission": "12500",
    "settleDate": "2026-07-06",
    "cargoItem": "빠레트",
    "memo": "시간 엄수 바랍니다",
    "date": "2026-07-06T09:00:00",
    "driverName": "오차주",
    "driverPhone": "010-1012-2012",
    "carNumber": "인천92아1012"
  },
  {
    "id": 13,
    "client": "다솜유통",
    "origin": "인천 연수구 송도과학로",
    "originDate": "2026-07-01T11:00:00",
    "destination": "경기 파주시 문산읍",
    "destinationDate": "2026-07-01T16:00:00",
    "spec": "11톤 카고",
    "status": "dispatching",
    "fee": 300000,
    "settleMethod": "인수증",
    "commission": "",
    "settleDate": "2026-08-01",
    "cargoItem": "철강",
    "memo": "지게차 하차 필요",
    "date": "2026-07-01T09:00:00",
    "driverName": "",
    "driverPhone": "",
    "carNumber": ""
  },
  {
    "id": 14,
    "client": "라온제나",
    "origin": "서울 성동구 아차산로",
    "originDate": "2026-07-02T11:00:00",
    "destination": "충남 아산시 배방읍",
    "destinationDate": "2026-07-02T16:00:00",
    "spec": "5톤 윙바디",
    "status": "cancelled",
    "fee": 350000,
    "settleMethod": "선불",
    "commission": "17500",
    "settleDate": "2026-08-02",
    "cargoItem": "기계",
    "memo": "안전운전 필수",
    "date": "2026-07-02T09:00:00",
    "driverName": "신차주",
    "driverPhone": "010-1014-2014",
    "carNumber": "대구94사1014"
  },
  {
    "id": 15,
    "client": "마루아라",
    "origin": "경남 양산시 어곡산단로",
    "originDate": "2026-07-03T11:00:00",
    "destination": "서울 영등포구 경인로",
    "destinationDate": "2026-07-03T16:00:00",
    "spec": "11톤 카고",
    "status": "completed",
    "fee": 400000,
    "settleMethod": "착불",
    "commission": "20000",
    "settleDate": "2026-08-03",
    "cargoItem": "박스",
    "memo": "상하차 전 기사 통화 요망",
    "date": "2026-07-03T09:00:00",
    "driverName": "권기사",
    "driverPhone": "010-1015-2015",
    "carNumber": "대전95아1015"
  },
  {
    "id": 16,
    "client": "바른로지스",
    "origin": "대전 대덕구 대화로",
    "originDate": "2026-07-04T11:00:00",
    "destination": "경기 이천시 대장로",
    "destinationDate": "2026-07-04T16:00:00",
    "spec": "5톤 윙바디",
    "status": "loaded",
    "fee": 450000,
    "settleMethod": "카드",
    "commission": "22500",
    "settleDate": "2026-07-04",
    "cargoItem": "빠레트",
    "memo": "특이사항 없음",
    "date": "2026-07-04T09:00:00",
    "driverName": "황차주",
    "driverPhone": "010-1016-2016",
    "carNumber": "울산96바1016"
  },
  {
    "id": 17,
    "client": "새솔산업",
    "origin": "울산 북구 효자로",
    "originDate": "2026-07-05T11:00:00",
    "destination": "전북 군산시 외항로",
    "destinationDate": "2026-07-05T16:00:00",
    "spec": "11톤 카고",
    "status": "dispatched",
    "fee": 500000,
    "settleMethod": "인수증",
    "commission": "",
    "settleDate": "2026-08-05",
    "cargoItem": "철강",
    "memo": "시간 엄수 바랍니다",
    "date": "2026-07-05T09:00:00",
    "driverName": "안기사",
    "driverPhone": "010-1017-2017",
    "carNumber": "광주97사1017"
  },
  {
    "id": 18,
    "client": "아라글로벌",
    "origin": "전북 전주시 덕진구",
    "originDate": "2026-07-06T11:00:00",
    "destination": "인천 중구 서해대로",
    "destinationDate": "2026-07-06T16:00:00",
    "spec": "5톤 윙바디",
    "status": "dispatching",
    "fee": 550000,
    "settleMethod": "선불",
    "commission": "27500",
    "settleDate": "2026-08-06",
    "cargoItem": "기계",
    "memo": "지게차 하차 필요",
    "date": "2026-07-06T09:00:00",
    "driverName": "",
    "driverPhone": "",
    "carNumber": ""
  },
  {
    "id": 19,
    "client": "자람무역",
    "origin": "대구 서구 와룡로",
    "originDate": "2026-07-01T11:00:00",
    "destination": "경기 파주시 탄현면",
    "destinationDate": "2026-07-01T16:00:00",
    "spec": "11톤 카고",
    "status": "cancelled",
    "fee": 600000,
    "settleMethod": "착불",
    "commission": "30000",
    "settleDate": "2026-08-01",
    "cargoItem": "박스",
    "memo": "안전운전 필수",
    "date": "2026-07-01T09:00:00",
    "driverName": "전기사",
    "driverPhone": "010-1019-2019",
    "carNumber": "경기99바1019"
  },
  {
    "id": 20,
    "client": "하랑로지스",
    "origin": "경기 광주시 초월읍",
    "originDate": "2026-07-02T11:00:00",
    "destination": "경남 김해시 골든루트로",
    "destinationDate": "2026-07-02T16:00:00",
    "spec": "5톤 윙바디",
    "status": "completed",
    "fee": 150000,
    "settleMethod": "카드",
    "commission": "7500",
    "settleDate": "2026-07-02",
    "cargoItem": "빠레트",
    "memo": "상하차 전 기사 통화 요망",
    "date": "2026-07-02T09:00:00",
    "driverName": "홍차주",
    "driverPhone": "010-1020-2020",
    "carNumber": "서울79사1020"
  },
  {
    "id": 21,
    "client": "가온물류",
    "origin": "인천 중구 서해대로",
    "originDate": "2026-07-03T11:00:00",
    "destination": "부산 해운대구 우동",
    "destinationDate": "2026-07-03T16:00:00",
    "spec": "11톤 카고",
    "status": "loaded",
    "fee": 200000,
    "settleMethod": "인수증",
    "commission": "",
    "settleDate": "2026-08-03",
    "cargoItem": "철강",
    "memo": "특이사항 없음",
    "date": "2026-07-03T09:00:00",
    "driverName": "김차주",
    "driverPhone": "010-1001-2001",
    "carNumber": "서울81바1001"
  },
  {
    "id": 22,
    "client": "나래물산",
    "origin": "경기 성남시 분당구",
    "originDate": "2026-07-04T11:00:00",
    "destination": "충남 천안시 서북구",
    "destinationDate": "2026-07-04T16:00:00",
    "spec": "5톤 윙바디",
    "status": "dispatched",
    "fee": 250000,
    "settleMethod": "선불",
    "commission": "12500",
    "settleDate": "2026-08-04",
    "cargoItem": "기계",
    "memo": "시간 엄수 바랍니다",
    "date": "2026-07-04T09:00:00",
    "driverName": "이기사",
    "driverPhone": "010-1002-2002",
    "carNumber": "경기82사1002"
  },
  {
    "id": 23,
    "client": "다솜유통",
    "origin": "인천 중구 아암대로",
    "originDate": "2026-07-05T11:00:00",
    "destination": "충북 청주시 흥덕구",
    "destinationDate": "2026-07-05T16:00:00",
    "spec": "11톤 카고",
    "status": "dispatching",
    "fee": 300000,
    "settleMethod": "착불",
    "commission": "15000",
    "settleDate": "2026-08-05",
    "cargoItem": "박스",
    "memo": "지게차 하차 필요",
    "date": "2026-07-05T09:00:00",
    "driverName": "",
    "driverPhone": "",
    "carNumber": ""
  },
  {
    "id": 24,
    "client": "라온제나",
    "origin": "경기 김포시 대곶면",
    "originDate": "2026-07-06T11:00:00",
    "destination": "광주 광산구 하남산단로",
    "destinationDate": "2026-07-06T16:00:00",
    "spec": "5톤 윙바디",
    "status": "cancelled",
    "fee": 350000,
    "settleMethod": "카드",
    "commission": "17500",
    "settleDate": "2026-07-06",
    "cargoItem": "빠레트",
    "memo": "안전운전 필수",
    "date": "2026-07-06T09:00:00",
    "driverName": "최차주",
    "driverPhone": "010-1004-2004",
    "carNumber": "부산84바1004"
  },
  {
    "id": 25,
    "client": "마루아라",
    "origin": "부산 사하구 신평로",
    "originDate": "2026-07-01T11:00:00",
    "destination": "경기 평택시 경기대로",
    "destinationDate": "2026-07-01T16:00:00",
    "spec": "11톤 카고",
    "status": "completed",
    "fee": 400000,
    "settleMethod": "인수증",
    "commission": "",
    "settleDate": "2026-08-01",
    "cargoItem": "철강",
    "memo": "상하차 전 기사 통화 요망",
    "date": "2026-07-01T09:00:00",
    "driverName": "정기사",
    "driverPhone": "010-1005-2005",
    "carNumber": "대구85사1005"
  },
  {
    "id": 26,
    "client": "바른로지스",
    "origin": "충북 청주시 청원구",
    "originDate": "2026-07-02T11:00:00",
    "destination": "경남 창원시 진해구",
    "destinationDate": "2026-07-02T16:00:00",
    "spec": "5톤 윙바디",
    "status": "loaded",
    "fee": 450000,
    "settleMethod": "선불",
    "commission": "22500",
    "settleDate": "2026-08-02",
    "cargoItem": "기계",
    "memo": "특이사항 없음",
    "date": "2026-07-02T09:00:00",
    "driverName": "강차주",
    "driverPhone": "010-1006-2006",
    "carNumber": "대전86아1006"
  },
  {
    "id": 27,
    "client": "새솔산업",
    "origin": "경남 양산시 웅상대로",
    "originDate": "2026-07-03T11:00:00",
    "destination": "경기 시흥시 공단대로",
    "destinationDate": "2026-07-03T16:00:00",
    "spec": "11톤 카고",
    "status": "dispatched",
    "fee": 500000,
    "settleMethod": "착불",
    "commission": "25000",
    "settleDate": "2026-08-03",
    "cargoItem": "박스",
    "memo": "시간 엄수 바랍니다",
    "date": "2026-07-03T09:00:00",
    "driverName": "조기사",
    "driverPhone": "010-1007-2007",
    "carNumber": "울산87바1007"
  },
  {
    "id": 28,
    "client": "아라글로벌",
    "origin": "광주 광산구 사암로",
    "originDate": "2026-07-04T11:00:00",
    "destination": "경기 용인시 처인구",
    "destinationDate": "2026-07-04T16:00:00",
    "spec": "5톤 윙바디",
    "status": "dispatching",
    "fee": 550000,
    "settleMethod": "카드",
    "commission": "27500",
    "settleDate": "2026-07-04",
    "cargoItem": "빠레트",
    "memo": "지게차 하차 필요",
    "date": "2026-07-04T09:00:00",
    "driverName": "",
    "driverPhone": "",
    "carNumber": ""
  },
  {
    "id": 29,
    "client": "자람무역",
    "origin": "경북 칠곡군 왜관읍",
    "originDate": "2026-07-05T11:00:00",
    "destination": "전남 목포시 삼학로",
    "destinationDate": "2026-07-05T16:00:00",
    "spec": "11톤 카고",
    "status": "cancelled",
    "fee": 600000,
    "settleMethod": "인수증",
    "commission": "",
    "settleDate": "2026-08-05",
    "cargoItem": "철강",
    "memo": "안전운전 필수",
    "date": "2026-07-05T09:00:00",
    "driverName": "장기사",
    "driverPhone": "010-1009-2009",
    "carNumber": "세종89아1009"
  },
  {
    "id": 30,
    "client": "하랑로지스",
    "origin": "경기 용인시 백암면",
    "originDate": "2026-07-06T11:00:00",
    "destination": "부산 사상구 백양대로",
    "destinationDate": "2026-07-06T16:00:00",
    "spec": "5톤 윙바디",
    "status": "completed",
    "fee": 150000,
    "settleMethod": "선불",
    "commission": "7500",
    "settleDate": "2026-08-06",
    "cargoItem": "기계",
    "memo": "상하차 전 기사 통화 요망",
    "date": "2026-07-06T09:00:00",
    "driverName": "임차주",
    "driverPhone": "010-1010-2010",
    "carNumber": "경기90바1010"
  },
  {
    "id": 31,
    "client": "가온물류",
    "origin": "서울 마포구 독막로",
    "originDate": "2026-07-01T11:00:00",
    "destination": "경북 구미시 3공단로",
    "destinationDate": "2026-07-01T16:00:00",
    "spec": "11톤 카고",
    "status": "loaded",
    "fee": 200000,
    "settleMethod": "착불",
    "commission": "10000",
    "settleDate": "2026-08-01",
    "cargoItem": "박스",
    "memo": "특이사항 없음",
    "date": "2026-07-01T09:00:00",
    "driverName": "한기사",
    "driverPhone": "010-1011-2011",
    "carNumber": "서울91사1011"
  },
  {
    "id": 32,
    "client": "나래물산",
    "origin": "경기 화성시 동탄산단로",
    "originDate": "2026-07-02T11:00:00",
    "destination": "대구 달서구 성서공단로",
    "destinationDate": "2026-07-02T16:00:00",
    "spec": "5톤 윙바디",
    "status": "dispatched",
    "fee": 250000,
    "settleMethod": "카드",
    "commission": "12500",
    "settleDate": "2026-07-02",
    "cargoItem": "빠레트",
    "memo": "시간 엄수 바랍니다",
    "date": "2026-07-02T09:00:00",
    "driverName": "오차주",
    "driverPhone": "010-1012-2012",
    "carNumber": "인천92아1012"
  },
  {
    "id": 33,
    "client": "다솜유통",
    "origin": "경기 안산시 단원구",
    "originDate": "2026-07-03T11:00:00",
    "destination": "경남 창원시 성산구",
    "destinationDate": "2026-07-03T16:00:00",
    "spec": "11톤 카고",
    "status": "dispatching",
    "fee": 300000,
    "settleMethod": "인수증",
    "commission": "",
    "settleDate": "2026-08-03",
    "cargoItem": "철강",
    "memo": "지게차 하차 필요",
    "date": "2026-07-03T09:00:00",
    "driverName": "",
    "driverPhone": "",
    "carNumber": ""
  },
  {
    "id": 34,
    "client": "라온제나",
    "origin": "서울 영등포구 여의나루로",
    "originDate": "2026-07-04T11:00:00",
    "destination": "부산 강서구 녹산산단로",
    "destinationDate": "2026-07-04T16:00:00",
    "spec": "5톤 윙바디",
    "status": "cancelled",
    "fee": 350000,
    "settleMethod": "선불",
    "commission": "17500",
    "settleDate": "2026-08-04",
    "cargoItem": "기계",
    "memo": "안전운전 필수",
    "date": "2026-07-04T09:00:00",
    "driverName": "신차주",
    "driverPhone": "010-1014-2014",
    "carNumber": "대구94사1014"
  },
  {
    "id": 35,
    "client": "마루아라",
    "origin": "부산 강서구 과학산단로",
    "originDate": "2026-07-05T11:00:00",
    "destination": "경북 포항시 남구 괴동로",
    "destinationDate": "2026-07-05T16:00:00",
    "spec": "11톤 카고",
    "status": "completed",
    "fee": 400000,
    "settleMethod": "착불",
    "commission": "20000",
    "settleDate": "2026-08-05",
    "cargoItem": "박스",
    "memo": "상하차 전 기사 통화 요망",
    "date": "2026-07-05T09:00:00",
    "driverName": "권기사",
    "driverPhone": "010-1015-2015",
    "carNumber": "대전95아1015"
  },
  {
    "id": 36,
    "client": "바른로지스",
    "origin": "세종 연서면 공단로",
    "originDate": "2026-07-06T11:00:00",
    "destination": "서울 금천구 가산디지털로",
    "destinationDate": "2026-07-06T16:00:00",
    "spec": "5톤 윙바디",
    "status": "loaded",
    "fee": 450000,
    "settleMethod": "카드",
    "commission": "22500",
    "settleDate": "2026-07-06",
    "cargoItem": "빠레트",
    "memo": "특이사항 없음",
    "date": "2026-07-06T09:00:00",
    "driverName": "황차주",
    "driverPhone": "010-1016-2016",
    "carNumber": "울산96바1016"
  },
  {
    "id": 37,
    "client": "새솔산업",
    "origin": "울산 남구 장생포로",
    "originDate": "2026-07-01T11:00:00",
    "destination": "충남 서산시 대산읍",
    "destinationDate": "2026-07-01T16:00:00",
    "spec": "11톤 카고",
    "status": "dispatched",
    "fee": 500000,
    "settleMethod": "인수증",
    "commission": "",
    "settleDate": "2026-08-01",
    "cargoItem": "철강",
    "memo": "시간 엄수 바랍니다",
    "date": "2026-07-01T09:00:00",
    "driverName": "안기사",
    "driverPhone": "010-1017-2017",
    "carNumber": "광주97사1017"
  },
  {
    "id": 38,
    "client": "아라글로벌",
    "origin": "전남 장성군 물류로",
    "originDate": "2026-07-02T11:00:00",
    "destination": "경북 경산시 진량읍",
    "destinationDate": "2026-07-02T16:00:00",
    "spec": "5톤 윙바디",
    "status": "dispatching",
    "fee": 550000,
    "settleMethod": "선불",
    "commission": "27500",
    "settleDate": "2026-08-02",
    "cargoItem": "기계",
    "memo": "지게차 하차 필요",
    "date": "2026-07-02T09:00:00",
    "driverName": "",
    "driverPhone": "",
    "carNumber": ""
  },
  {
    "id": 39,
    "client": "자람무역",
    "origin": "경북 구미시 수출대로",
    "originDate": "2026-07-03T11:00:00",
    "destination": "서울 강남구 학동로",
    "destinationDate": "2026-07-03T16:00:00",
    "spec": "11톤 카고",
    "status": "cancelled",
    "fee": 600000,
    "settleMethod": "착불",
    "commission": "30000",
    "settleDate": "2026-08-03",
    "cargoItem": "박스",
    "memo": "안전운전 필수",
    "date": "2026-07-03T09:00:00",
    "driverName": "전기사",
    "driverPhone": "010-1019-2019",
    "carNumber": "경기99바1019"
  },
  {
    "id": 40,
    "client": "하랑로지스",
    "origin": "서울 송파구 양재대로",
    "originDate": "2026-07-04T11:00:00",
    "destination": "충남 당진시 송악읍",
    "destinationDate": "2026-07-04T16:00:00",
    "spec": "5톤 윙바디",
    "status": "completed",
    "fee": 150000,
    "settleMethod": "카드",
    "commission": "7500",
    "settleDate": "2026-07-04",
    "cargoItem": "빠레트",
    "memo": "상하차 전 기사 통화 요망",
    "date": "2026-07-04T09:00:00",
    "driverName": "홍차주",
    "driverPhone": "010-1020-2020",
    "carNumber": "서울79사1020"
  },
  {
    "id": 41,
    "client": "가온물류",
    "origin": "경기 김포시 고촌읍",
    "originDate": "2026-07-05T11:00:00",
    "destination": "전남 여수시 여수산단로",
    "destinationDate": "2026-07-05T16:00:00",
    "spec": "11톤 카고",
    "status": "loaded",
    "fee": 200000,
    "settleMethod": "인수증",
    "commission": "",
    "settleDate": "2026-08-05",
    "cargoItem": "철강",
    "memo": "특이사항 없음",
    "date": "2026-07-05T09:00:00",
    "driverName": "김차주",
    "driverPhone": "010-1001-2001",
    "carNumber": "서울81바1001"
  },
  {
    "id": 42,
    "client": "나래물산",
    "origin": "경기 평택시 포승읍",
    "originDate": "2026-07-06T11:00:00",
    "destination": "울산 남구 산단로",
    "destinationDate": "2026-07-06T16:00:00",
    "spec": "5톤 윙바디",
    "status": "dispatched",
    "fee": 250000,
    "settleMethod": "선불",
    "commission": "12500",
    "settleDate": "2026-08-06",
    "cargoItem": "기계",
    "memo": "시간 엄수 바랍니다",
    "date": "2026-07-06T09:00:00",
    "driverName": "이기사",
    "driverPhone": "010-1002-2002",
    "carNumber": "경기82사1002"
  },
  {
    "id": 43,
    "client": "다솜유통",
    "origin": "인천 연수구 송도과학로",
    "originDate": "2026-07-01T11:00:00",
    "destination": "경기 파주시 문산읍",
    "destinationDate": "2026-07-01T16:00:00",
    "spec": "11톤 카고",
    "status": "dispatching",
    "fee": 300000,
    "settleMethod": "착불",
    "commission": "15000",
    "settleDate": "2026-08-01",
    "cargoItem": "박스",
    "memo": "지게차 하차 필요",
    "date": "2026-07-01T09:00:00",
    "driverName": "",
    "driverPhone": "",
    "carNumber": ""
  },
  {
    "id": 44,
    "client": "라온제나",
    "origin": "서울 성동구 아차산로",
    "originDate": "2026-07-02T11:00:00",
    "destination": "충남 아산시 배방읍",
    "destinationDate": "2026-07-02T16:00:00",
    "spec": "5톤 윙바디",
    "status": "cancelled",
    "fee": 350000,
    "settleMethod": "카드",
    "commission": "17500",
    "settleDate": "2026-07-02",
    "cargoItem": "빠레트",
    "memo": "안전운전 필수",
    "date": "2026-07-02T09:00:00",
    "driverName": "최차주",
    "driverPhone": "010-1004-2004",
    "carNumber": "부산84바1004"
  },
  {
    "id": 45,
    "client": "마루아라",
    "origin": "경남 양산시 어곡산단로",
    "originDate": "2026-07-03T11:00:00",
    "destination": "서울 영등포구 경인로",
    "destinationDate": "2026-07-03T16:00:00",
    "spec": "11톤 카고",
    "status": "completed",
    "fee": 400000,
    "settleMethod": "인수증",
    "commission": "",
    "settleDate": "2026-08-03",
    "cargoItem": "철강",
    "memo": "상하차 전 기사 통화 요망",
    "date": "2026-07-03T09:00:00",
    "driverName": "정기사",
    "driverPhone": "010-1005-2005",
    "carNumber": "대구85사1005"
  },
  {
    "id": 46,
    "client": "바른로지스",
    "origin": "대전 대덕구 대화로",
    "originDate": "2026-07-04T11:00:00",
    "destination": "경기 이천시 대장로",
    "destinationDate": "2026-07-04T16:00:00",
    "spec": "5톤 윙바디",
    "status": "loaded",
    "fee": 450000,
    "settleMethod": "선불",
    "commission": "22500",
    "settleDate": "2026-08-04",
    "cargoItem": "기계",
    "memo": "특이사항 없음",
    "date": "2026-07-04T09:00:00",
    "driverName": "강차주",
    "driverPhone": "010-1006-2006",
    "carNumber": "대전86아1006"
  },
  {
    "id": 47,
    "client": "새솔산업",
    "origin": "울산 북구 효자로",
    "originDate": "2026-07-05T11:00:00",
    "destination": "전북 군산시 외항로",
    "destinationDate": "2026-07-05T16:00:00",
    "spec": "11톤 카고",
    "status": "dispatched",
    "fee": 500000,
    "settleMethod": "착불",
    "commission": "25000",
    "settleDate": "2026-08-05",
    "cargoItem": "박스",
    "memo": "시간 엄수 바랍니다",
    "date": "2026-07-05T09:00:00",
    "driverName": "조기사",
    "driverPhone": "010-1007-2007",
    "carNumber": "울산87바1007"
  },
  {
    "id": 48,
    "client": "아라글로벌",
    "origin": "전북 전주시 덕진구",
    "originDate": "2026-07-06T11:00:00",
    "destination": "인천 중구 서해대로",
    "destinationDate": "2026-07-06T16:00:00",
    "spec": "5톤 윙바디",
    "status": "dispatching",
    "fee": 550000,
    "settleMethod": "카드",
    "commission": "27500",
    "settleDate": "2026-07-06",
    "cargoItem": "빠레트",
    "memo": "지게차 하차 필요",
    "date": "2026-07-06T09:00:00",
    "driverName": "",
    "driverPhone": "",
    "carNumber": ""
  },
  {
    "id": 49,
    "client": "자람무역",
    "origin": "대구 서구 와룡로",
    "originDate": "2026-07-01T11:00:00",
    "destination": "경기 파주시 탄현면",
    "destinationDate": "2026-07-01T16:00:00",
    "spec": "11톤 카고",
    "status": "cancelled",
    "fee": 600000,
    "settleMethod": "인수증",
    "commission": "",
    "settleDate": "2026-08-01",
    "cargoItem": "철강",
    "memo": "안전운전 필수",
    "date": "2026-07-01T09:00:00",
    "driverName": "장기사",
    "driverPhone": "010-1009-2009",
    "carNumber": "세종89아1009"
  },
  {
    "id": 50,
    "client": "하랑로지스",
    "origin": "경기 광주시 초월읍",
    "originDate": "2026-07-02T11:00:00",
    "destination": "경남 김해시 골든루트로",
    "destinationDate": "2026-07-02T16:00:00",
    "spec": "5톤 윙바디",
    "status": "completed",
    "fee": 150000,
    "settleMethod": "선불",
    "commission": "7500",
    "settleDate": "2026-08-02",
    "cargoItem": "기계",
    "memo": "상하차 전 기사 통화 요망",
    "date": "2026-07-02T09:00:00",
    "driverName": "임차주",
    "driverPhone": "010-1010-2010",
    "carNumber": "경기90바1010"
  }
]
    return initialItems.map((item: any) => ({
      ...item,
      originalFee: item.originalFee || item.fee
    }));
  })

  React.useEffect(() => {
    localStorage.setItem('dispatches', JSON.stringify(dispatches))
  }, [dispatches])

  // Recommendations data source state
  const [historyPool, setHistoryPool] = useState(initialHistoricalDispatches)

  // Validation highlights state
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  // Client save modal state
  const [showClientModal, setShowClientModal] = useState(false)
  const [clientModalData, setClientModalData] = useState({
    name: '',
    phone: '',
    address: '',
    businessNo: '',
    ceoName: '',
    contactName: '',
    contactPhone: ''
  })

  // Table expanded row state
  const [expandedId, setExpandedId] = useState<number | null>(null)

  // Active dispatch ID being assigned a driver
  const [assigningDispatchId, setAssigningDispatchId] = useState<number | null>(null)
  const [activeLeftPanel, setActiveLeftPanel] = useState<'form' | 'chat'>('form')
  const [chatRoomRecipient, setChatRoomRecipient] = useState<{
    partnerName: string
    partnerType: 'driver' | 'client'
    phone: string
    vehicleNo?: string
  } | null>(null)
  const [embeddedChatInput, setEmbeddedChatInput] = useState('')
  const [embeddedChatMessages, setEmbeddedChatMessages] = useState<any[]>([])
  const [showEmbeddedTemplates, setShowEmbeddedTemplates] = useState(false)
  const [embeddedTemplates, setEmbeddedTemplates] = useState<any[]>([])

  const LOCAL_DEFAULT_TEMPLATES = [
    { id: 't1', category: '정산', text: '이번 운행 건 인수증 사진과 함께 세금계산서 청구 부탁드립니다.' },
    { id: 't2', category: '정산', text: '운임 정산 처리가 완료되었습니다. 다음 결제일에 등록하신 계좌로 입금 예정입니다.' },
    { id: 't3', category: '상하차', text: '상차지 주소: [상차지주소] / 하차지 주소: [하차지주소] 운행 스펙 확인하시고 이동 바랍니다.' },
    { id: 't4', category: '상하차', text: '하차 장소가 협소하여 진입 대기가 발생할 수 있으니 도착 10분 전 연락 바랍니다.' },
    { id: 't5', category: '공지', text: '운행 중 특이사항(차량 이상, 상하차 지연 등)이 발생할 경우 즉시 관제 센터로 공유 부탁드립니다.' }
  ];

  // Sync templates dynamically via CustomEvent and localStorage
  React.useEffect(() => {
    const loadTemps = () => {
      const savedTemplates = localStorage.getItem('chat_templates')
      if (savedTemplates) {
        try {
          setEmbeddedTemplates(JSON.parse(savedTemplates))
        } catch (e) {
          setEmbeddedTemplates(LOCAL_DEFAULT_TEMPLATES)
        }
      } else {
        setEmbeddedTemplates(LOCAL_DEFAULT_TEMPLATES)
        localStorage.setItem('chat_templates', JSON.stringify(LOCAL_DEFAULT_TEMPLATES))
      }
    }
    loadTemps()
    window.addEventListener('chat_templates_updated', loadTemps)
    return () => window.removeEventListener('chat_templates_updated', loadTemps)
  }, [])

  const handleAddEmbeddedTemplate = () => {
    const category = prompt('카테고리를 입력하세요 (예: 정산, 상하차, 공지 등):')
    if (!category) return
    const text = prompt('상용구 내용을 입력하세요:')
    if (!text) return

    const newTemplate = {
      id: 't_' + Date.now(),
      category: category.trim(),
      text: text.trim()
    }
    const updated = [...embeddedTemplates, newTemplate]
    setEmbeddedTemplates(updated)
    localStorage.setItem('chat_templates', JSON.stringify(updated))
    window.dispatchEvent(new Event('chat_templates_updated'))
  }

  const handleDeleteEmbeddedTemplate = (id: string, e: any) => {
    e.stopPropagation()
    if (!confirm('해당 상용구를 삭제하시겠습니까?')) return
    const updated = embeddedTemplates.filter(t => t.id !== id)
    setEmbeddedTemplates(updated)
    localStorage.setItem('chat_templates', JSON.stringify(updated))
    window.dispatchEvent(new Event('chat_templates_updated'))
  }

  const loadOrCreateChatRoom = (recipientName: string, recipientType: 'driver' | 'client', phone: string, vehicleNo?: string) => {
    const saved = localStorage.getItem('chat_logs')
    let rooms = []
    if (saved) {
      try { rooms = JSON.parse(saved); } catch (e) { rooms = []; }
    }
    let room = rooms.find((r: any) => r.partnerName === recipientName && r.partnerType === recipientType)
    if (!room) {
      const newRoom = {
        id: 'room_' + Date.now(),
        partnerName: recipientName,
        partnerType: recipientType,
        vehicleNo,
        phone,
        unreadCount: 0,
        lastUpdated: new Date().toISOString(),
        messages: [
          { id: 'init', sender: 'dispatcher', text: `안녕하세요, ${recipientName}님. 이번 배차 관련하여 문의사항 있으시면 남겨주세요.`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]
      }
      rooms.unshift(newRoom)
      localStorage.setItem('chat_logs', JSON.stringify(rooms))
      room = newRoom
    }
    setChatRoomRecipient({
      partnerName: recipientName,
      partnerType: recipientType,
      phone,
      vehicleNo
    })
    setEmbeddedChatMessages(room.messages)
    setActiveLeftPanel('chat')
  }
  const [expandedDriverId, setExpandedDriverId] = useState<number | null>(null)
  const [adjustTargetMap, setAdjustTargetMap] = useState<Record<number, 'fee' | 'commission'>>({})
  const [blinkRow, setBlinkRow] = useState<{ id: number; status: DispatchStatus } | null>(null)

  const triggerBlink = (dispatchId: number, status: DispatchStatus) => {
    setBlinkRow({ id: dispatchId, status });
    setTimeout(() => {
      setBlinkRow(prev => prev && prev.id === dispatchId ? null : prev);
    }, 1200);
  };

  React.useEffect(() => {
    if (expandedId !== null) {
      setTimeout(() => {
        const el = document.getElementById(`expanded-row-${expandedId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 120);
    }
  }, [expandedId]);

  // Load quote details from Quotation page if any
  React.useEffect(() => {
    const pendingQuoteStr = localStorage.getItem('pending_quote');
    if (pendingQuoteStr) {
      try {
        const pendingQuote = JSON.parse(pendingQuoteStr);
        setFormData(prev => ({
          ...prev,
          origin: pendingQuote.origin || '',
          destination: pendingQuote.destination || '',
          tonnage: String(pendingQuote.tonnage || ''),
          carType: pendingQuote.carType || '',
          fee: pendingQuote.fee ? String(pendingQuote.fee) : '',
        }));
        localStorage.removeItem('pending_quote');
        setTimeout(() => {
          triggerNotification('견적 계산기로부터 요금과 상/하차지 정보가 적용되었습니다!');
        }, 300);
      } catch (err) {
        console.error('Failed to parse pending_quote:', err);
      }
    }
  }, []);

  // Table filters state
  const [dateFilterType, setDateFilterType] = useState('전체') // 전체, 오늘, 이번주, 지난주, 이번달, 지난달, 직접선택
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [statusFilter, setStatusFilter] = useState('전체') // 전체, 배차중, 배차완료, 배차취소, 상차완료, 하차완료, 운행완료

  // Temporary driver input state inside expanded card
  const [driverInput, setDriverInput] = useState({
    carNumber: '',
    driverName: '',
    driverPhone: ''
  })

  const [notification, setNotification] = useState<string | null>(null)

  // Search filter state for dispatch history
  const [searchTerm, setSearchTerm] = useState('')
  const [searchFilter, setSearchFilter] = useState('')

  // Client search view states
  const [showClientSearch, setShowClientSearch] = useState(false)

  // Embedded Postcode dropdown state
  const [activePostcodeField, setActivePostcodeField] = useState<string | null>(null)
  const [editingWaypointsId, setEditingWaypointsId] = useState<number | null>(null)
  const [editWaypoints, setEditWaypoints] = useState<string[]>([])

  // Location list view state ('origin' | 'destination' | 'both' | null)
  const [activeLocationListField, setActiveLocationListField] = useState<'origin' | 'destination' | 'both' | null>(null)
  const [clientSearchTerm, setClientSearchTerm] = useState('')
  const [clientSearchFilter, setClientSearchFilter] = useState('')
  const [showHistoryPanel, setShowHistoryPanel] = useState(() => typeof window !== 'undefined' ? window.innerWidth > 768 : true)

  // Scroll to history list when toggled open on mobile
  React.useEffect(() => {
    if (showHistoryPanel && window.innerWidth <= 768) {
      setTimeout(() => {
        const el = document.querySelector('.dispatch-right-area');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [showHistoryPanel]);

  // Quick fee inline editing states
  const [editingFeeId, setEditingFeeId] = useState<number | null>(null)
  const [editingFeeValue, setEditingFeeValue] = useState('')
  const [editingCommissionValue, setEditingCommissionValue] = useState('')

  const handleQuickFeeSave = (id: number) => {
    if (editingFeeId !== id) return
    const rawFee = Number(editingFeeValue.replace(/,/g, ''))
    const rawCommission = editingCommissionValue.replace(/,/g, '')

    if (isNaN(rawFee) || rawFee <= 0) {
      alert('올바른 운임 금액을 입력해 주세요.')
      return
    }

    setDispatches(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          fee: rawFee,
          commission: rawCommission
        }
      }
      return d
    }))

    triggerNotification('운임 및 수수료 정보가 수정 완료되었습니다!')
    setEditingFeeId(null)
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setSearchFilter('')
    setDateFilterType('전체')
    setStatusFilter('전체')
    setCustomStartDate('')
    setCustomEndDate('')
    triggerNotification('필터 조건이 모두 초기화되었습니다!')
  }

  const [clients, setClients] = useState<any[]>(() => {
    const saved = localStorage.getItem('clients')
    return saved ? JSON.parse(saved) : [
  {
    "id": 1,
    "name": "가온물류",
    "contact": "박대리",
    "phone": "02-345-6789",
    "businessNo": "101-81-23456",
    "routes": 5,
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
    "contact": "최과장",
    "phone": "031-701-2345",
    "businessNo": "202-82-34567",
    "routes": 5,
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
    "contact": "정주임",
    "phone": "032-811-0987",
    "businessNo": "303-83-45678",
    "routes": 5,
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
    "contact": "이대리",
    "phone": "02-789-0123",
    "businessNo": "404-84-56789",
    "routes": 5,
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
    "contact": "조과장",
    "phone": "051-505-1122",
    "businessNo": "505-85-67890",
    "routes": 5,
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
    "contact": "윤주임",
    "phone": "042-482-1234",
    "businessNo": "606-86-78901",
    "routes": 5,
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
    "contact": "임대리",
    "phone": "052-251-5678",
    "businessNo": "707-87-89012",
    "routes": 5,
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
    "contact": "송과장",
    "phone": "062-360-1212",
    "businessNo": "808-88-90123",
    "routes": 5,
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
    "contact": "서대리",
    "phone": "053-421-4321",
    "businessNo": "909-89-01234",
    "routes": 5,
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
    "contact": "홍주임",
    "phone": "02-2233-4455",
    "businessNo": "110-90-12345",
    "routes": 5,
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

  // Dynamic recommendation logic based on historical dispatch data
  const getRecommendations = () => {
    const client = formData.clientName.trim()

    // Helper to map active dispatches to the same format as historyPool
    const mapDispatchToPoolItem = (d: any) => {
      let tonnage = '';
      let carType = '';
      if (d.spec) {
        const parts = d.spec.trim().split(/\s+/);
        tonnage = parts[0] || '';
        carType = parts[1] || '';
      }
      return {
        client: d.client || '',
        origin: d.origin || '',
        destination: d.destination || '',
        tonnage,
        carType,
        weight: '',
        fee: typeof d.fee === 'number' ? d.fee : (Number(d.fee) || 0),
        date: d.date || ''
      };
    };

    // Combine historyPool and active dispatches (loaded from localStorage) as the source pool
    const combinedPool = [
      ...dispatches.map(mapDispatchToPoolItem),
      ...historyPool
    ];

    const pool = client 
      ? combinedPool.filter(d => d.client === client)
      : combinedPool

    // 1. Routes (origin -> destination)
    const routesMap: Record<string, { count: number, origin: string, destination: string }> = {}
    // 2. Origins
    const originsMap: Record<string, number> = {}
    // 3. Destinations
    const destMap: Record<string, number> = {}

    pool.forEach(item => {
      // Route
      const rKey = `${item.origin}→${item.destination}`
      if (!routesMap[rKey]) routesMap[rKey] = { count: 0, origin: item.origin, destination: item.destination }
      routesMap[rKey].count++

      // Origin
      originsMap[item.origin] = (originsMap[item.origin] || 0) + 1

      // Destination
      destMap[item.destination] = (destMap[item.destination] || 0) + 1
    })

    const topRoutes = Object.values(routesMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)

    const topOrigins = Object.entries(originsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0])

    const topDestinations = Object.entries(destMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0])

    // Hybrid Spec Recommendation System:
    // 1. Get client-specific spec counts
    const clientSpecsMap: Record<string, { count: number, tonnage: string, carType: string, weight: string }> = {};
    const overallSpecsMap: Record<string, { count: number, tonnage: string, carType: string, weight: string }> = {};

    combinedPool.forEach(item => {
      const sKey = `${item.tonnage}|${item.carType}`; // Ignore weight completely
      
      // Overall stats
      if (!overallSpecsMap[sKey]) {
        overallSpecsMap[sKey] = { count: 0, tonnage: item.tonnage, carType: item.carType, weight: '' };
      }
      overallSpecsMap[sKey].count++;

      // Client stats
      if (client && item.client === client) {
        if (!clientSpecsMap[sKey]) {
          clientSpecsMap[sKey] = { count: 0, tonnage: item.tonnage, carType: item.carType, weight: '' };
        }
        clientSpecsMap[sKey].count++;
      }
    });

    const clientSpecsList = Object.values(clientSpecsMap).sort((a, b) => b.count - a.count);
    const overallSpecsList = Object.values(overallSpecsMap).sort((a, b) => b.count - a.count);

    const uniqueSpecsList: Array<{ count: number, tonnage: string, carType: string, weight: string, isClientSpec?: boolean }> = [];
    const seenKeys = new Set<string>();

    // Add client specs first with explicit flag
    clientSpecsList.forEach(spec => {
      const dKey = `${spec.tonnage}|\f${spec.carType}`.replace('\\f', '');
      if (!seenKeys.has(dKey)) {
        seenKeys.add(dKey);
        uniqueSpecsList.push({ ...spec, isClientSpec: true });
      }
    });

    // Add overall specs with explicit flag
    overallSpecsList.forEach(spec => {
      if (uniqueSpecsList.length >= 5) return;
      const dKey = `${spec.tonnage}|\f${spec.carType}`.replace('\\f', '');
      if (!seenKeys.has(dKey)) {
        seenKeys.add(dKey);
        uniqueSpecsList.push({ ...spec, isClientSpec: false });
      }
    });

    // If still less than 5 unique specs, pull from popular standard specs to ensure 5 chips are always displayed
    const defaultSpecs = [
      { count: 0, tonnage: '1톤', carType: '카고', weight: '' },
      { count: 0, tonnage: '1톤', carType: '탑차', weight: '' },
      { count: 0, tonnage: '2.5톤', carType: '카고', weight: '' },
      { count: 0, tonnage: '3.5톤', carType: '윙바디', weight: '' },
      { count: 0, tonnage: '5톤', carType: '카고', weight: '' },
      { count: 0, tonnage: '5톤', carType: '윙바디', weight: '' },
      { count: 0, tonnage: '11톤', carType: '카고', weight: '' }
    ];

    defaultSpecs.forEach(spec => {
      if (uniqueSpecsList.length >= 5) return;
      const dKey = `${spec.tonnage}|\f${spec.carType}`.replace('\\f', '');
      if (!seenKeys.has(dKey)) {
        seenKeys.add(dKey);
        uniqueSpecsList.push({ ...spec, isClientSpec: false });
      }
    });

    // Split back to client-specific vs overall using isClientSpec flag (100% robust)
    const clientPart = uniqueSpecsList.filter(spec => (spec as any).isClientSpec);
    const overallPart = uniqueSpecsList.filter(spec => !(spec as any).isClientSpec);

    // Sort individually in ascending order so that when combined, the most frequent is on the right-most.
    clientPart.reverse();
    overallPart.reverse();

    const topSpecs = [...overallPart, ...clientPart];

    return { topRoutes, topOrigins, topDestinations, topSpecs }
  }

  const { topRoutes, topOrigins, topDestinations, topSpecs } = getRecommendations()

  // Dynamic fee recommendation based on client/origin/destination
  const getFeeRecommendations = () => {
    const client = formData.clientName.trim()
    const origin = formData.origin.trim()
    const destination = formData.destination.trim()

    let pool = historyPool
    if (client) {
      pool = pool.filter(d => d.client === client)
    }
    if (origin) {
      pool = pool.filter(d => d.origin.includes(origin) || origin.includes(d.origin))
    }
    if (destination) {
      pool = pool.filter(d => d.destination.includes(destination) || destination.includes(d.destination))
    }

    // Fallback if matching pool is too small (e.g. no exact match)
    if (pool.length === 0) {
      pool = client ? historyPool.filter(d => d.client === client) : historyPool
    }

    if (pool.length === 0) return { recentFee: null, frequentFee: null }

    // Recent Fee
    const sortedByDate = [...pool].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const recentFee = sortedByDate[0]?.fee || null

    // Frequent Fee
    const counts: Record<number, number> = {}
    pool.forEach(d => {
      counts[d.fee] = (counts[d.fee] || 0) + 1
    })
    const sortedByFreq = Object.entries(counts).sort((a, b) => b[1] - a[1])
    const frequentFee = sortedByFreq[0] ? Number(sortedByFreq[0][0]) : null

    return { recentFee, frequentFee }
  }

  const { recentFee, frequentFee } = getFeeRecommendations()
  const hasOtherInfo = !!(formData.clientName.trim() || formData.origin.trim() || formData.destination.trim())

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (digits.startsWith('02')) {
      if (digits.length <= 2) return digits;
      if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
      if (digits.length <= 9) return `${digits.slice(0, 2)}-\?${digits.slice(2, 5)}-${digits.slice(5)}`.replace('-\?', '-');
      return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
    } else {
      if (digits.length <= 3) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      if (digits.length <= 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    }
  };

  const formatAmount = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (!digits) return '';
    return Number(digits).toLocaleString();
  };

  const handleInputChange = (field: string, value: string) => {
    let formatted = value;
    if (field === 'clientPhone') {
      formatted = formatPhone(value);
    } else if (field === 'fee' || field === 'commission') {
      formatted = formatAmount(value);
    }

    setFormData(prev => ({ ...prev, [field]: formatted }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }))
    }
  }

  const handleRecommendClient = (name: string, phone: string, contact: string) => {
    setFormData(prev => ({
      ...prev,
      clientName: name,
      clientPhone: formatPhone(phone),
      clientContact: contact
    }))
    setActiveLocationListField('both')
    if (window.innerWidth > 768) {
      setShowHistoryPanel(true);
    }
  }

  const handleRecommendSpec = (tonnage: string, type: string, weight: string) => {
    setFormData(prev => ({
      ...prev,
      tonnage,
      carType: type,
      weight
    }))
    setErrors(prev => ({ ...prev, tonnage: false, carType: false }))
  }

  const handleRecommendLocation = (field: 'origin' | 'destination', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setErrors(prev => ({ ...prev, [field]: false }))
  }

  const handleRecommendRoute = (origin: string, destination: string) => {
    setFormData(prev => ({
      ...prev,
      origin,
      destination
    }))
    setErrors(prev => ({ ...prev, origin: false, destination: false }))
  }



  const handleDateShortcut = (field: 'originDate' | 'destinationDate', shortcut: string) => {
    const now = new Date()
    let targetDate = new Date()

    if (shortcut === '지금') {
      const formatted = now.toISOString().slice(0, 16)
      setFormData(prev => ({ ...prev, [field]: formatted }))
      return
    }
    
    if (shortcut === '오늘') {
      targetDate.setHours(12, 0, 0, 0)
    } else if (shortcut === '내일') {
      targetDate.setDate(now.getDate() + 1)
      targetDate.setHours(12, 0, 0, 0)
    } else if (shortcut === '월요일') {
      const day = now.getDay()
      const distance = (8 - day) % 7 || 7 
      targetDate.setDate(now.getDate() + distance)
      targetDate.setHours(12, 0, 0, 0)
    }

    const year = targetDate.getFullYear()
    const month = String(targetDate.getMonth() + 1).padStart(2, '0')
    const date = String(targetDate.getDate()).padStart(2, '0')
    const hours = String(targetDate.getHours()).padStart(2, '0')
    const minutes = '00'

    const formatted = `${year}-${month}-${date}T${hours}:${minutes}`
    setFormData(prev => ({ ...prev, [field]: formatted }))
  }

  const triggerNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }



  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault()
    const newClient = {
      id: clients.length + 1,
      name: clientModalData.name,
      contact: clientModalData.contactName || '미기재',
      phone: clientModalData.phone || '미기재',
      businessNo: clientModalData.businessNo || '미기재',
      routes: 0,
      origins: [],
      destinations: []
    }
    setClients(prev => [...prev, newClient])
    triggerNotification(`거래처 [${clientModalData.name}] 정보가 성공적으로 저장되었습니다!`)
    setShowClientModal(false)
  }

  const handleSelectClient = (client: typeof clients[0]) => {
    setFormData(prev => ({
      ...prev,
      clientName: client.name,
      clientPhone: formatPhone(client.phone),
      clientContact: client.contact
    }))
    setErrors(prev => ({ ...prev, clientName: false }))
    setShowClientSearch(false)
    setActiveLocationListField('both')
    triggerNotification(`거래처 [${client.name}]이(가) 선택되었습니다.`)
  }

  const handleResetForm = () => {
    const dates = getInitialDates();
    setFormData({
      clientName: '',
      clientPhone: '',
      clientContact: '',
      origin: '',
      originDate: dates.originDate,
      destination: '',
      destinationDate: dates.destinationDate,
      waypoints: [],
      tonnage: '',
      carType: '',
      weight: '',
      settleMethod: '인수증',
      fee: '',
      commission: '',
      settleDate: '',
      cargoItem: '',
      memo: ''
    })
    setErrors({})
    setActiveLocationListField(null)
  }

  const handleDispatchSubmit = (e: React.MouseEvent) => {
    e.preventDefault()
    
    const requiredFields = {
      origin: '상차지',
      destination: '하차지',
      tonnage: '톤급',
      carType: '차종',
      fee: '운임'
    }

    const missingFields: string[] = []
    const newErrors: Record<string, boolean> = {}

    Object.entries(requiredFields).forEach(([field, label]) => {
      const val = formData[field as keyof typeof formData]
      if (typeof val === 'string' && !val.trim()) {
        missingFields.push(label)
        newErrors[field] = true
      }
    })

    if (missingFields.length > 0) {
      setErrors(newErrors)
      alert(`필수 입력 값이 누락되었습니다:\n- ${missingFields.join('\n- ')}`)
      return
    }

    // Register new dispatch item
    const newId = dispatches.length > 0 ? Math.max(...dispatches.map(d => d.id)) + 1 : 1
    const registeredDispatch = {
      id: newId,
      client: formData.clientName.trim() || '일반화주',
      origin: formData.origin,
      originDate: formData.originDate,
      destination: formData.destination,
      destinationDate: formData.destinationDate,
      waypoints: (formData.waypoints || []).filter((w: string) => w.trim() !== ''),
      spec: `${formData.tonnage} ${formData.carType} ${formData.weight ? `(${formData.weight})` : ''}`.trim(),
      status: 'dispatching' as DispatchStatus,
      fee: Number(formData.fee.replace(/,/g, '')),
      originalFee: Number(formData.fee.replace(/,/g, '')),
      settleMethod: formData.settleMethod,
      commission: formData.commission.replace(/,/g, ''),
      settleDate: formData.settleDate,
      cargoItem: formData.cargoItem,
      memo: formData.memo,
      date: new Date().toISOString(),
      driverName: '',
      driverPhone: '',
      carNumber: ''
    }

    // Update dispatch list state
    setDispatches([registeredDispatch, ...dispatches])

    // Update recommendation pool so the pricing/route recommendations adapt to this new dispatch immediately
    const poolItem = {
      client: formData.clientName.trim() || '일반화주',
      origin: formData.origin,
      destination: formData.destination,
      tonnage: formData.tonnage,
      carType: formData.carType,
      weight: formData.weight || '0T',
      fee: Number(formData.fee.replace(/,/g, '')),
      date: new Date().toISOString()
    }
    setHistoryPool([poolItem, ...historyPool])

    triggerNotification('배차가 성공적으로 등록되었습니다!')
    handleResetForm()
    setActiveLocationListField(null)
  }

  // Handle assigning/updating a driver and status
  const handleUpdateDriverAndStatus = (dispatchId: number, status: DispatchStatus) => {
    // If setting to dispatching (resets everything)
    if (status === 'dispatching') {
      setDispatches(prev => prev.map(d => {
        if (d.id === dispatchId) {
          return {
            ...d,
            status,
            carNumber: '',
            driverName: '',
            driverPhone: ''
          }
        }
        return d
      }))
      setDriverInput({ carNumber: '', driverName: '', driverPhone: '' })
      triggerNotification('배차가 대기 상태로 환원되고 차주 정보가 초기화되었습니다.')
      triggerBlink(dispatchId, 'dispatching')
      return
    }

    // If setting to cancelled (resets everything and changes status)
    if (status === 'cancelled') {
      setDispatches(prev => prev.map(d => {
        if (d.id === dispatchId) {
          return {
            ...d,
            status,
            carNumber: '',
            driverName: '',
            driverPhone: ''
          }
        }
        return d
      }))
      setDriverInput({ carNumber: '', driverName: '', driverPhone: '' })
      triggerNotification('배차가 취소 상태로 변경되고 차주 정보가 초기화되었습니다.')
      triggerBlink(dispatchId, 'cancelled')
      return
    }

    // Otherwise require driver details
    if (!driverInput.carNumber.trim() || !driverInput.driverName.trim() || !driverInput.driverPhone.trim()) {
      alert('배차/운행 처리를 위해 차량번호, 차주명, 차주 연락처를 모두 입력해야 합니다.')
      return
    }

    setDispatches(prev => prev.map(d => {
      if (d.id === dispatchId) {
        return {
          ...d,
          status,
          carNumber: driverInput.carNumber,
          driverName: driverInput.driverName,
          driverPhone: driverInput.driverPhone
        }
      }
      return d
    }))

    triggerNotification(`차주 정보 및 배차 상태가 [${getStatusLabel(status)}]로 설정되었습니다.`)
    triggerBlink(dispatchId, status)
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'dispatching': return '배차중'
      case 'dispatched': return '배차완료'
      case 'cancelled': return '배차취소'
      case 'loaded': return '상차완료'
      case 'unloaded': return '하차완료'
      case 'completed': return '운행완료'
      default: return status
    }
  }

  // Date filtering logic helper
  const filterByDateRange = (itemDateStr: string) => {
    const itemDate = new Date(itemDateStr)
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

    if (dateFilterType === '오늘') {
      return itemDate >= startOfToday && itemDate <= endOfToday
    }

    if (dateFilterType === '이번주') {
      const day = now.getDay()
      const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Monday start
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), diff)
      const endOfWeek = new Date(now.getFullYear(), now.getMonth(), diff + 6, 23, 59, 59, 999)
      return itemDate >= startOfWeek && itemDate <= endOfWeek
    }

    if (dateFilterType === '지난주') {
      const day = now.getDay()
      const diff = now.getDate() - day + (day === 0 ? -6 : 1) - 7 // Prev Monday start
      const startOfLastWeek = new Date(now.getFullYear(), now.getMonth(), diff)
      const endOfLastWeek = new Date(now.getFullYear(), now.getMonth(), diff + 6, 23, 59, 59, 999)
      return itemDate >= startOfLastWeek && itemDate <= endOfLastWeek
    }

    if (dateFilterType === '이번달') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
      return itemDate >= startOfMonth && itemDate <= endOfMonth
    }

    if (dateFilterType === '지난달') {
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
      return itemDate >= startOfLastMonth && itemDate <= endOfLastMonth
    }

    if (dateFilterType === '직접선택') {
      if (!customStartDate || !customEndDate) return true
      const start = new Date(customStartDate + 'T00:00:00')
      const end = new Date(customEndDate + 'T23:59:59')
      return itemDate >= start && itemDate <= end
    }

    return true // '전체'
  }

  // Allowed statuses on the Dispatches page (Others like settlements are filtered out)
  const allowedStatuses = ['dispatching', 'dispatched', 'cancelled', 'loaded', 'unloaded', 'completed']

  // Filtered dispatches to show in history table
  const filteredDispatches = dispatches.filter(dispatch => {
    // 0. Only show dispatches matching page allowed statuses
    if (!allowedStatuses.includes(dispatch.status)) return false

    // 1. Search term check
    const term = searchFilter.toLowerCase().trim()
    const matchesSearch = !term || (
      dispatch.client.toLowerCase().includes(term) ||
      dispatch.origin.toLowerCase().includes(term) ||
      dispatch.destination.toLowerCase().includes(term) ||
      dispatch.spec.toLowerCase().includes(term) ||
      dispatch.driverName.toLowerCase().includes(term) ||
      dispatch.carNumber.toLowerCase().includes(term)
    )

    // 2. Status filter check
    const matchesStatus = statusFilter === '전체' || (
      (statusFilter === '배차중' && dispatch.status === 'dispatching') ||
      (statusFilter === '배차완료' && dispatch.status === 'dispatched') ||
      (statusFilter === '배차취소' && dispatch.status === 'cancelled') ||
      (statusFilter === '상차완료' && dispatch.status === 'loaded') ||
      (statusFilter === '하차완료' && dispatch.status === 'unloaded') ||
      (statusFilter === '운행완료' && dispatch.status === 'completed')
    )

    // 3. Date range filter check
    const matchesDate = filterByDateRange(dispatch.date)

    return matchesSearch && matchesStatus && matchesDate
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

  const dateShortcutStyle: React.CSSProperties = {
    fontSize: '0.72rem',
    padding: '0.2rem 0.5rem',
    background: 'var(--bg-primary)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  }

  // Helpers to calculate faceted search counts for filters
  const getDateCount = (type: string) => {
    return dispatches.filter(dispatch => {
      if (!allowedStatuses.includes(dispatch.status)) return false;
      const term = searchFilter.toLowerCase().trim();
      const matchesSearch = !term || (
        dispatch.client.toLowerCase().includes(term) ||
        dispatch.origin.toLowerCase().includes(term) ||
        dispatch.destination.toLowerCase().includes(term) ||
        dispatch.spec.toLowerCase().includes(term) ||
        (dispatch.driverName && dispatch.driverName.toLowerCase().includes(term)) ||
        (dispatch.carNumber && dispatch.carNumber.toLowerCase().includes(term))
      );
      if (!matchesSearch) return false;
      
      const matchesStatus = statusFilter === '전체' || (
        (statusFilter === '배차중' && dispatch.status === 'dispatching') ||
        (statusFilter === '배차완료' && dispatch.status === 'dispatched') ||
        (statusFilter === '배차취소' && dispatch.status === 'cancelled') ||
        (statusFilter === '상차완료' && dispatch.status === 'loaded') ||
        (statusFilter === '하차완료' && dispatch.status === 'unloaded') ||
        (statusFilter === '운행완료' && dispatch.status === 'completed')
      );
      if (!matchesStatus) return false;

      const itemDate = new Date(dispatch.date);
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      if (type === '오늘') {
        return itemDate >= startOfToday && itemDate <= endOfToday;
      }
      if (type === '이번주') {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), diff);
        const endOfWeek = new Date(now.getFullYear(), now.getMonth(), diff + 6, 23, 59, 59, 999);
        return itemDate >= startOfWeek && itemDate <= endOfWeek;
      }
      if (type === '지난주') {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1) - 7;
        const startOfLastWeek = new Date(now.getFullYear(), now.getMonth(), diff);
        const endOfLastWeek = new Date(now.getFullYear(), now.getMonth(), diff + 6, 23, 59, 59, 999);
        return itemDate >= startOfLastWeek && itemDate <= endOfLastWeek;
      }
      if (type === '이번달') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        return itemDate >= startOfMonth && itemDate <= endOfMonth;
      }
      if (type === '지난달') {
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        return itemDate >= startOfLastMonth && itemDate <= endOfLastMonth;
      }
      if (type === '직접선택') {
        if (!customStartDate || !customEndDate) return true;
        const start = new Date(customStartDate + 'T00:00:00');
        const end = new Date(customEndDate + 'T23:59:59');
        return itemDate >= start && itemDate <= end;
      }
      return true;
    }).length;
  };

  const getStatusCount = (statusType: string) => {
    return dispatches.filter(dispatch => {
      if (!allowedStatuses.includes(dispatch.status)) return false;
      const term = searchFilter.toLowerCase().trim();
      const matchesSearch = !term || (
        dispatch.client.toLowerCase().includes(term) ||
        dispatch.origin.toLowerCase().includes(term) ||
        dispatch.destination.toLowerCase().includes(term) ||
        dispatch.spec.toLowerCase().includes(term) ||
        (dispatch.driverName && dispatch.driverName.toLowerCase().includes(term)) ||
        (dispatch.carNumber && dispatch.carNumber.toLowerCase().includes(term))
      );
      if (!matchesSearch) return false;

      const itemDate = new Date(dispatch.date);
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      
      let matchesDate = true;
      if (dateFilterType === '오늘') {
        matchesDate = itemDate >= startOfToday && itemDate <= endOfToday;
      } else if (dateFilterType === '이번주') {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), diff);
        const endOfWeek = new Date(now.getFullYear(), now.getMonth(), diff + 6, 23, 59, 59, 999);
        matchesDate = itemDate >= startOfWeek && itemDate <= endOfWeek;
      } else if (dateFilterType === '지난주') {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1) - 7;
        const startOfLastWeek = new Date(now.getFullYear(), now.getMonth(), diff);
        const endOfLastWeek = new Date(now.getFullYear(), now.getMonth(), diff + 6, 23, 59, 59, 999);
        matchesDate = itemDate >= startOfLastWeek && itemDate <= endOfLastWeek;
      } else if (dateFilterType === '이번달') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        matchesDate = itemDate >= startOfMonth && itemDate <= endOfMonth;
      } else if (dateFilterType === '지난달') {
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        matchesDate = itemDate >= startOfLastMonth && itemDate <= endOfLastMonth;
      } else if (dateFilterType === '직접선택') {
        if (customStartDate && customEndDate) {
          const start = new Date(customStartDate + 'T00:00:00');
          const end = new Date(customEndDate + 'T23:59:59');
          matchesDate = itemDate >= start && itemDate <= end;
        }
      }
      if (!matchesDate) return false;

      if (statusType === '전체') return true;
      return (
        (statusType === '배차중' && dispatch.status === 'dispatching') ||
        (statusType === '배차완료' && dispatch.status === 'dispatched') ||
        (statusType === '배차취소' && dispatch.status === 'cancelled') ||
        (statusType === '상차완료' && dispatch.status === 'loaded') ||
        (statusType === '하차완료' && dispatch.status === 'unloaded') ||
        (statusType === '운행완료' && dispatch.status === 'completed')
      );
    }).length;
  };

  // Dispatch Difficulty Traffic Light component
  const DispatchTrafficLight = ({ dispatch }: { dispatch: any }) => {
    const baseDiff = dispatch.id % 3;
    const diffInFee = dispatch.fee - (dispatch.originalFee || dispatch.fee);

    let difficulty = baseDiff;
    if (baseDiff === 1) {
      if (diffInFee >= 10000) {
        difficulty = 0;
      }
    } else if (baseDiff === 2) {
      if (diffInFee >= 25000) {
        difficulty = 0;
      } else if (diffInFee >= 10000) {
        difficulty = 1;
      }
    }

    let tooltipText = "";
    if (difficulty === 0) tooltipText = "배차 난이도: 쉬움 (인근 대기 차량 풍부)";
    else if (difficulty === 1) tooltipText = "배차 난이도: 보통 (차 수급 균형)";
    else tooltipText = "배차 난이도: 어려움 (인근 대기 차량 부족 / 지연 우려)";

    const dotStyle = (color: string, active: boolean) => ({
      width: '7px',
      height: '7px',
      borderRadius: '50%',
      backgroundColor: color,
      opacity: active ? 1 : 0.2,
      boxShadow: active ? `0 0 6px ${color}` : 'none',
      transition: 'all var(--transition-fast)'
    });

    return (
      <div 
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '3px', 
          padding: '3px 5px', 
          backgroundColor: 'var(--bg-secondary)', 
          borderRadius: 'var(--radius-full)', 
          border: '1px solid var(--border-color)',
          marginLeft: '0.4rem',
          verticalAlign: 'middle'
        }}
        title={tooltipText}
        onClick={e => e.stopPropagation()} // Prevent row expanding on click
      >
        <div style={dotStyle('#10B981', difficulty === 0)} />
        <div style={dotStyle('#F59E0B', difficulty === 1)} />
        <div style={dotStyle('#EF4444', difficulty === 2)} />
      </div>
    );
  };

  const adjustButtonStyle = (bg: string, color: string): React.CSSProperties => ({
    fontSize: '0.66rem',
    padding: '0.15rem 0.35rem',
    backgroundColor: bg,
    color: color,
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all var(--transition-fast)'
  });

  const filterTabStyle = (active: boolean): React.CSSProperties => ({
    fontSize: '0.78rem',
    padding: '0.35rem 0.75rem',
    background: active ? 'var(--primary-light)' : 'var(--bg-primary)',
    border: active ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
    borderRadius: 'var(--radius-full)',
    color: active ? 'var(--primary)' : 'var(--text-secondary)',
    fontWeight: active ? 700 : 500,
    cursor: 'pointer',
    transition: 'all var(--transition-fast)'
  })

  const selectStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '0.52rem 0.75rem',
    borderRadius: 'var(--radius-md)',
    border: hasError ? '1.5px solid var(--danger)' : '1px solid transparent',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    boxShadow: hasError ? '0 0 0 2px var(--danger-bg)' : 'none',
    height: '40px'
  })

  const methodButtonStyle = (method: string): React.CSSProperties => {
    const isActive = formData.settleMethod === method
    return {
      flex: 1,
      padding: '0.65rem 0.5rem',
      fontSize: '0.85rem',
      fontWeight: 700,
      borderRadius: 'var(--radius-md)',
      border: isActive ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
      backgroundColor: isActive ? 'var(--primary-light)' : 'var(--bg-secondary)',
      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
      cursor: 'pointer',
      transition: 'all var(--transition-fast)'
    }
  }

  return (
    <div className="dispatch-layout-container" style={{ gridTemplateColumns: showHistoryPanel ? undefined : '1fr' }}>
      <style>{`
        @keyframes blink-dispatched {
          0% { background-color: rgba(49, 130, 246, 0.45); }
          100% { background-color: transparent; }
        }
        @keyframes blink-loaded {
          0% { background-color: rgba(16, 185, 129, 0.45); }
          100% { background-color: transparent; }
        }
        @keyframes blink-unloaded {
          0% { background-color: rgba(78, 89, 104, 0.45); }
          100% { background-color: transparent; }
        }
        @keyframes blink-completed {
          0% { background-color: rgba(16, 185, 129, 0.45); }
          100% { background-color: transparent; }
        }
        @keyframes blink-dispatching {
          0% { background-color: rgba(245, 158, 11, 0.45); }
          100% { background-color: transparent; }
        }
        @keyframes blink-cancelled {
          0% { background-color: rgba(239, 68, 68, 0.45); }
          100% { background-color: transparent; }
        }
        .blink-row-active td {
          animation: inherit;
        }
      `}</style>
      
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1.5px solid var(--primary)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.5rem',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 100,
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
      {showClientModal && (
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
          zIndex: 50
        }}>
          <Card style={{ width: '480px', padding: '2rem', border: 'none', backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow-lg)' }}>
            <h3 className="text-lg font-bold mb-4">거래처 정보 저장</h3>
            <form onSubmit={handleSaveClient} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="text-sm font-bold text-secondary mb-1 block">거래처명 *</label>
                <Input required value={clientModalData.name} onChange={e => setClientModalData({...clientModalData, name: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="text-sm font-bold text-secondary mb-1 block">대표자명</label>
                  <Input value={clientModalData.ceoName} onChange={e => setClientModalData({...clientModalData, ceoName: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-bold text-secondary mb-1 block">사업자번호</label>
                  <Input placeholder="000-00-00000" value={clientModalData.businessNo} onChange={e => setClientModalData({...clientModalData, businessNo: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-secondary mb-1 block">전화번호</label>
                <Input value={clientModalData.phone} onChange={e => setClientModalData({...clientModalData, phone: formatPhone(e.target.value)})} />
              </div>
              <div>
                <label className="text-sm font-bold text-secondary mb-1 block">주소</label>
                <div style={{ display: 'flex', gap: '0.4rem', position: 'relative' }}>
                  <Input 
                    placeholder="주소 검색"
                    value={clientModalData.address} 
                    onClick={() => setActivePostcodeField(activePostcodeField === 'clientModalAddr' ? null : 'clientModalAddr')}
                    readOnly
                    style={{ cursor: 'pointer' }}
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.82rem' }}
                    onClick={() => setActivePostcodeField(activePostcodeField === 'clientModalAddr' ? null : 'clientModalAddr')}
                  >
                    검색
                  </Button>
                  {activePostcodeField === 'clientModalAddr' && (
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
                                  setClientModalData(prev => ({ ...prev, address: addr }));
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="text-sm font-bold text-secondary mb-1 block">담당자명</label>
                  <Input value={clientModalData.contactName} onChange={e => setClientModalData({...clientModalData, contactName: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-bold text-secondary mb-1 block">담당자 전화번호</label>
                  <Input value={clientModalData.contactPhone} onChange={e => setClientModalData({...clientModalData, contactPhone: formatPhone(e.target.value)})} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <Button type="button" variant="secondary" style={{ flex: 1 }} onClick={() => setShowClientModal(false)}>취소</Button>
                <Button type="submit" variant="primary" style={{ flex: 1 }}>저장하기</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
      
      {/* Left Area: Dispatch Registration Form OR Driver Assignment (40% Width) */}
      <div className="dispatch-left-area" style={{ flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        {activeLeftPanel === 'chat' && chatRoomRecipient ? (
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
                      if (saved) { rooms = JSON.parse(saved); }
                      const room = rooms.find((r: any) => r.partnerName === chatRoomRecipient.partnerName && r.partnerType === chatRoomRecipient.partnerType);
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

              <div style={{
                flex: 1,
                padding: '0.5rem 0.25rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                backgroundColor: 'rgba(0, 0, 0, 0.01)'
              }} className="hide-scrollbar">
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
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
                          onClick={(e: any) => handleDeleteEmbeddedTemplate(temp.id, e)}
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
                onSubmit={(e) => {
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
                  if (saved) { rooms = JSON.parse(saved); }
                  const updatedRooms = rooms.map((r: any) => {
                    if (r.partnerName === chatRoomRecipient.partnerName && r.partnerType === chatRoomRecipient.partnerType) {
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

                  setTimeout(() => {
                    let replyText = '네, 확인했습니다. 운행 내용 및 정산 서류 처리 진행하겠습니다.';
                    if (embeddedChatInput.includes('인수증')) {
                      replyText = '인수증 사진 찍어서 올렸습니다. 확인 부탁드립니다.';
                    } else if (embeddedChatInput.includes('계산서')) {
                      replyText = '세금계산서 청구 완료했습니다.';
                    } else if (embeddedChatInput.includes('위치')) {
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
                    if (saved2) { rooms2 = JSON.parse(saved2); }
                    const updatedRooms2 = rooms2.map((r: any) => {
                      if (r.partnerName === chatRoomRecipient.partnerName && r.partnerType === chatRoomRecipient.partnerType) {
                        const isActive = (activeLeftPanel === 'chat') && (chatRoomRecipient.partnerName === r.partnerName && chatRoomRecipient.partnerType === r.partnerType);
                        return {
                          ...r,
                          lastUpdated: new Date().toISOString(),
                          messages: [...r.messages, replyMsg],
                          unreadCount: isActive ? 0 : ((r.unreadCount || 0) + 1)
                        };
                      }
                      return r;
                    });
                    localStorage.setItem('chat_logs', JSON.stringify(updatedRooms2));
                    
                    setEmbeddedChatMessages(prev => [...prev, replyMsg]);
                    
                    window.dispatchEvent(new CustomEvent('show-toast', {
                      detail: { message: `${chatRoomRecipient.partnerName}: "${replyText}"` }
                    }));
                  }, 2500);
                }}
                style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}
              >
                                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button
                    type="button"
                    onClick={() => {
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
                      if (saved) { rooms = JSON.parse(saved); }
                      const updatedRooms = rooms.map((r: any) => {
                        if (r.partnerName === chatRoomRecipient.partnerName && r.partnerType === chatRoomRecipient.partnerType) {
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
                    }}
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
        ) : assigningDispatchId !== null ? (
          <div className="animate-fade-slide-up" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Card style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: 'none' }}>
              <h4 style={{ 
                fontSize: '0.92rem', 
                fontWeight: 700, 
                color: 'var(--text-primary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-color)', 
                paddingBottom: '0.5rem', 
                margin: '0 0 -0.25rem 0' 
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '4px', height: '14px', backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-sm)' }}></span>
                  차량/차주 배정
                </span>
                <Button
                  variant="secondary"
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                  onClick={() => setAssigningDispatchId(null)}
                >
                  닫기
                </Button>
              </h4>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.4rem', fontWeight: 700 }}>선택된 배차 정보</span>
                {(() => {
                  const target = dispatches.find(d => d.id === assigningDispatchId)
                  if (!target) return null
                  return (
                    <div style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{target.client}</span>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.92rem' }}>{target.fee.toLocaleString()}원</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        노선: {target.origin.split(' ').slice(0, 2).join(' ')} &rarr; {target.destination.split(' ').slice(0, 2).join(' ')}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                        스펙: {target.spec}
                      </div>
                    </div>
                  )
                })()}
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                {(() => {
                  const target = dispatches.find(d => d.id === assigningDispatchId);
                  if (!target) return null;
                  const driverHomeLocations: Record<number, string> = {
                    1: '경기 안산시 단원구',
                    2: '인천 중구 아암대로',
                    3: '서울 구로구 경인로',
                    4: '충북 청주시 흥덕구',
                    5: '경기 평택시 포승읍',
                    6: '경남 김해시 골든루트로',
                    7: '경남 창원시 성산구',
                    8: '경기 시흥시 공단대로'
                  };

                  const getDistanceInKm = (addr1: string, addr2: string) => {
                    if (!addr1 || !addr2) return 15;
                    const getRegion = (addr: string) => {
                      if (addr.includes('서울')) return 'Seoul';
                      if (addr.includes('인천')) return 'Incheon';
                      if (addr.includes('안산') || addr.includes('평택') || addr.includes('시흥') || addr.includes('경기')) return 'Gyeonggi';
                      if (addr.includes('청주') || addr.includes('충북')) return 'Chungcheong';
                      if (addr.includes('김해') || addr.includes('창원') || addr.includes('부산') || addr.includes('경남')) return 'Gyeongsang';
                      return 'Other';
                    };
                    const r1 = getRegion(addr1);
                    const r2 = getRegion(addr2);
                    if (r1 === r2) return 8.5;
                    const distances: Record<string, Record<string, number>> = {
                      Seoul: { Incheon: 32, Gyeonggi: 25, Chungcheong: 110, Gyeongsang: 340 },
                      Incheon: { Seoul: 32, Gyeonggi: 28, Chungcheong: 125, Gyeongsang: 360 },
                      Gyeonggi: { Seoul: 25, Incheon: 28, Chungcheong: 90, Gyeongsang: 320 },
                      Chungcheong: { Seoul: 110, Incheon: 125, Gyeonggi: 90, Gyeongsang: 210 },
                      Gyeongsang: { Seoul: 340, Incheon: 360, Gyeonggi: 320, Chungcheong: 210 }
                    };
                    const baseDist = distances[r1]?.[r2] || distances[r2]?.[r1] || 150;
                    const offset = (addr1.length + addr2.length) % 10;
                    return baseDist + offset;
                  };

                  const getDriverMonthlyEarnings = (driver: any) => {
                    const completedFee = dispatches
                      .filter(d => (d.carNumber === driver.vNumber || d.driverName === driver.name) && d.status === 'completed')
                      .reduce((sum, d) => sum + d.fee, 0);
                    const base = driver.spec.includes('11톤') || driver.spec.includes('25톤') ? 3500000 : driver.spec.includes('5톤') ? 2200000 : 1200000;
                    return base + completedFee;
                  };

                  const getDriverRecentDispatchesCount = (driver: any) => {
                    return dispatches.filter(d => (d.carNumber === driver.vNumber || d.driverName === driver.name)).length;
                  };

                  const getRecommendationReason = (driver: any, targetSpec: string, distance: number, hasActive: boolean) => {
                    const reasons: string[] = [];
                    const hasExperience = dispatches.some(d => 
                      (d.carNumber === driver.vNumber || d.driverName === driver.name) && 
                      d.spec === targetSpec
                    );
                    if (hasExperience) reasons.push('동종화물 유경험');
                    if (distance < 30) reasons.push('상차지 인접');
                    if (!hasActive) {
                      reasons.push('현재 대기중');
                    } else {
                      reasons.push('연계운행 최적');
                    }
                    return reasons.join(', ');
                  };

                  // Calculate score for each driver
                  const scoredDrivers = dummyDrivers.map(driver => {
                    const activeTrip = dispatches.find(d => 
                      (d.carNumber === driver.vNumber || d.driverName === driver.name) && 
                      d.status !== 'completed' && 
                      d.status !== 'cancelled'
                    );

                    // 1. Same Cargo / Spec Experience
                    const hasExperience = dispatches.some(d => 
                      (d.carNumber === driver.vNumber || d.driverName === driver.name) && 
                      d.spec === target.spec
                    ) ? 30 : 0;

                    // 2. Dispatch Count (Fewer is better)
                    const totalDispatches = getDriverRecentDispatchesCount(driver);
                    const dispatchScore = Math.max(0, 20 - totalDispatches * 4);

                    // 3. Monthly total earnings (Lower is better for fair distribution)
                    const monthlyEarnings = getDriverMonthlyEarnings(driver);
                    const earningsScore = Math.max(0, 20 - (monthlyEarnings / 500000) * 2);

                    // 4. Distance to loading point (Closer is better)
                    const currentAddr = activeTrip ? activeTrip.destination : driverHomeLocations[driver.id];
                    const distance = getDistanceInKm(currentAddr, target.origin);
                    const distanceScore = Math.max(0, 30 - distance * 0.15);

                    // 5. Unloading time before target loading time (Continuous trip scheduling)
                    let nextTripScore = 0;
                    if (activeTrip) {
                      const activeUnloadTime = new Date(activeTrip.destinationDate).getTime();
                      const targetLoadTime = new Date(target.originDate).getTime();
                      const destToOriginDistance = getDistanceInKm(activeTrip.destination, target.origin);
                      if (activeUnloadTime < targetLoadTime && destToOriginDistance < 50) {
                        nextTripScore = 40;
                      }
                    } else {
                      nextTripScore = 15;
                    }

                    const score = hasExperience + dispatchScore + earningsScore + distanceScore + nextTripScore;
                    return {
                      ...driver,
                      activeTrip,
                      distance,
                      monthlyEarnings,
                      score
                    };
                  });

                  // Sort by score descending
                  const sortedDrivers = [...scoredDrivers].sort((a, b) => b.score - a.score);
                  const recommendedDrivers = sortedDrivers.slice(0, 3);

                  const renderDriverCard = (driver: any, isRecommended: boolean) => {
                    return (
                      <div 
                        key={driver.id + (isRecommended ? '-rec' : '')} 
                        onClick={() => setExpandedDriverId(prev => prev === driver.id ? null : driver.id)}
                        style={{ 
                          padding: '1rem', 
                          border: expandedDriverId === driver.id ? '1.5px solid var(--primary)' : '1px solid var(--border-color)', 
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-secondary)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                          cursor: 'pointer',
                          boxShadow: expandedDriverId === driver.id ? 'var(--shadow-sm)' : 'none',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', minWidth: 0 }}>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>{driver.name}</span>
                            <span style={{ flexShrink: 0, display: 'inline-flex' }}>
                              <Badge color={driver.type === '소속' ? 'primary' : driver.type === '지입' ? 'success' : 'gray'}>
                                {driver.type}
                              </Badge>
                            </span>
                            {isRecommended && (
                              <span style={{ flexShrink: 0, display: 'inline-flex', fontWeight: 700 }}>
                                <Badge color="warning">
                                  ⭐ AI 추천
                                </Badge>
                              </span>
                            )}
                          </div>
                          <Button 
                            variant="primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDispatches(prev => prev.map(d => {
                                if (d.id === assigningDispatchId) {
                                    return {
                                      ...d,
                                      status: 'dispatched' as DispatchStatus,
                                      carNumber: driver.vNumber,
                                      driverName: driver.name,
                                      driverPhone: driver.phone
                                    }
                                }
                                return d
                              }))
                              if (expandedId === assigningDispatchId) {
                                setDriverInput({
                                  carNumber: driver.vNumber,
                                  driverName: driver.name,
                                  driverPhone: driver.phone
                                })
                              }
                              triggerNotification(`[${driver.name}] 차주가 배차 건에 정상적으로 배정되었습니다.`);
                              setAssigningDispatchId(null);
                              triggerBlink(assigningDispatchId, 'dispatched');
                            }}
                          >
                            선택 배정
                          </Button>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>차량번호: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{driver.vNumber}</span></div>
                            <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                              {driver.activeTrip ? '연계지 거리:' : '현위치 거리:'} {driver.distance.toFixed(0)}km
                            </div>
                          </div>
                          <div>스펙: {driver.spec}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.1rem' }}>
                            <span>월 총운임: <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{driver.monthlyEarnings.toLocaleString()}원</span></span>
                            {isRecommended && (
                              <span style={{ fontSize: '0.76rem', color: 'var(--warning-text)', fontWeight: 600 }}>
                                {getRecommendationReason(driver, target.spec, driver.distance, !!driver.activeTrip)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Expanded Section with smooth height transition */}
                        <div style={{
                          maxHeight: expandedDriverId === driver.id ? '250px' : '0',
                          overflow: 'hidden',
                          opacity: expandedDriverId === driver.id ? 1 : 0,
                          marginTop: expandedDriverId === driver.id ? '0.75rem' : '0',
                          borderTop: expandedDriverId === driver.id ? '1px dashed var(--border-color)' : 'none',
                          paddingTop: expandedDriverId === driver.id ? '0.75rem' : '0',
                          transition: 'all var(--transition-normal)'
                        }} onClick={e => e.stopPropagation()}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem' }}>
                            <div>
                              <span style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>현재 상태 및 주소</span>
                              {driver.activeTrip ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontWeight: 700 }}>
                                    <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--primary)', borderRadius: '50%' }}></span>
                                    운행중 ({driver.activeTrip.origin.split(' ')[1] || driver.activeTrip.origin} → {driver.activeTrip.destination.split(' ')[1] || driver.activeTrip.destination})
                                  </div>
                                  <div style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)' }}>하차지: {driver.activeTrip.destination}</div>
                                </div>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10B981', fontWeight: 700 }}>
                                    <span style={{ width: '6px', height: '6px', backgroundColor: '#10B981', borderRadius: '50%' }}></span>
                                    대기중 (배정 가능)
                                  </div>
                                  <div style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)' }}>대기위치: {driverHomeLocations[driver.id]}</div>
                                </div>
                              )}
                            </div>
                            <div>
                              <span style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', fontWeight: 700, display: 'block', marginBottom: '0.1rem' }}>계좌 정보</span>
                              <span style={{ color: 'var(--text-secondary)' }}>{driver.bank || '등록된 계좌 없음'}</span>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>최근 배차 이력</span>
                              {(() => {
                                const driverHistory = dispatches.filter(d => 
                                  (d.carNumber === driver.vNumber || d.driverName === driver.name)
                                );
                                if (driverHistory.length === 0) {
                                  return <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>배차 이력 없음</div>;
                                }
                                return (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    {driverHistory.slice(0, 3).map((hist, idx) => (
                                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                        <span>{hist.origin.split(' ')[1] || hist.origin} → {hist.destination.split(' ')[1] || hist.destination} ({hist.client})</span>
                                        <span style={{ fontWeight: 600, color: hist.status === 'completed' ? '#10B981' : hist.status === 'cancelled' ? '#EF4444' : 'var(--primary)' }}>
                                          {hist.status === 'completed' ? '완료' : hist.status === 'cancelled' ? '취소' : '진행중'}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  };

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {/* 1. Recommended section */}
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--warning-text)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.6rem' }}>
                          ⭐ AI 최적 추천 차주 (최대 3명)
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          {recommendedDrivers.map(driver => renderDriverCard(driver, true))}
                        </div>
                      </div>

                      {/* Divider */}
                      <div style={{ borderTop: '1px dashed var(--border-color)', margin: '0.25rem 0' }} />

                      {/* 2. All drivers section */}
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.6rem' }}>
                          전체 배정 가능 차주 목록
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          {sortedDrivers.map(driver => renderDriverCard(driver, false))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </Card>
          </div>
        ) : (
          <>
            <Card className="dispatch-registration-card" style={{ flex: 1, padding: '0.85rem 1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem', border: 'none' }}>
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
                운행 등록
              </h4>
          
          {/* 1. 거래처 정보 입력 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label className="text-sm font-bold text-secondary" style={{ flexShrink: 0 }}>거래처 정보</label>
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '0.3rem', 
                  justifyContent: 'flex-end',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  flex: 1,
                  marginLeft: '1rem',
                  paddingBottom: '2px'
                }}
                className="hide-scrollbar"
              >
                {clients.slice(0, 3).map(c => (
                  <button 
                    key={c.id} 
                    type="button" 
                    onClick={() => handleRecommendClient(c.name, c.phone, c.contact || c.contactName)} 
                    style={{ ...recommendationButtonStyle, flexShrink: 0 }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 80px', gap: '0.4rem' }}>
                <Input 
                  placeholder="거래처명" 
                  value={formData.clientName} 
                  onChange={e => handleInputChange('clientName', e.target.value)}
                  style={{ fontSize: '0.85rem', padding: '0.52rem 0.75rem', height: '40px' }}
                />
                <Input 
                  placeholder="전화번호" 
                  value={formData.clientPhone} 
                  onChange={e => handleInputChange('clientPhone', e.target.value)}
                  style={{ fontSize: '0.85rem', padding: '0.52rem 0.75rem', height: '40px' }}
                />
                <Input 
                  placeholder="담당자명" 
                  value={formData.clientContact} 
                  onChange={e => handleInputChange('clientContact', e.target.value)}
                  style={{ fontSize: '0.85rem', padding: '0.52rem 0.75rem', height: '40px' }}
                />
                <Button 
                  type="button"
                  variant="secondary" 
                  style={{ padding: '0.45rem', fontSize: '0.8rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                  onClick={() => {
                    setShowClientSearch(true)
                    setClientSearchTerm('')
                    setClientSearchFilter('')
                  }}
                >
                  <Search size={14} /> 검색
                </Button>
              </div>
            </div>
          </div>

          {/* 2. 상/하차지 & 상/하차일시 */}
          <div className="dispatch-registration-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.15rem', marginTop: '0.25rem' }}>
            
            {/* 자주 쓰는 구간 추천 칩 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label className="text-sm font-bold text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                <Route size={14} /> 자주 쓰는 구간
              </label>
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '0.4rem', 
                  justifyContent: 'flex-end',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  flex: 1,
                  marginLeft: '1rem',
                  paddingBottom: '2px'
                }}
                className="hide-scrollbar"
              >
                {topRoutes.length > 0 ? (
                  topRoutes.map((route, i) => {
                    const originShort = route.origin.split(' ').slice(0, 2).join(' ')
                    const destShort = route.destination.split(' ').slice(0, 2).join(' ')
                    return (
                      <button 
                        key={i}
                        type="button" 
                        onClick={() => handleRecommendRoute(route.origin, route.destination)} 
                        style={{ ...recommendationButtonStyle, flexShrink: 0 }}
                      >
                        {originShort} &rarr; {destShort}
                      </button>
                    )
                  })
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', alignSelf: 'center', marginRight: '0.5rem' }}>추천 데이터 없음</span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setActiveLocationListField(activeLocationListField === 'both' ? null : 'both');
                    setShowClientSearch(false);
                    setActivePostcodeField(null);
                  }}
                  style={{ ...recommendationButtonStyle, flexShrink: 0, padding: '0.2rem 0.6rem', fontWeight: 'bold' }}
                  title="상하차지 목록 전체 보기"
                >
                  ...
                </button>
              </div>
            </div>

            {/* 상차지 및 상차일시 */}
            <div className="dispatch-form-row" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <label className="text-sm font-bold text-secondary block">상차지 <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {topOrigins.map((origin, i) => {
                      const short = origin.split(' ').slice(0, 2).join(' ')
                      return (
                        <button key={i} type="button" onClick={() => handleRecommendLocation('origin', origin)} style={recommendationButtonStyle}>{short}</button>
                      )
                    })}
                  </div>
                </div>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Input 
                    style={{ 
                      fontSize: '0.85rem',
                      padding: '0.52rem 0.75rem',
                      height: '40px',
                      borderColor: errors.origin ? 'var(--danger)' : 'transparent',
                      boxShadow: errors.origin ? '0 0 0 2px var(--danger-bg)' : 'none',
                      cursor: 'pointer'
                    }} 
                    placeholder="상차지 주소 검색" 
                    value={formData.origin}
                    onClick={() => setActivePostcodeField(activePostcodeField === 'origin' ? null : 'origin')}
                    readOnly
                  />
                  {activePostcodeField === 'origin' && (
                    <>
                      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} onClick={() => setActivePostcodeField(null)} />
                      <div 
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          height: '350px',
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
                                  setFormData(prev => ({ ...prev, origin: addr }));
                                  setErrors(prev => ({ ...prev, origin: false }));
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
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label className="text-sm font-bold text-secondary block">상차일시</label>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {['월요일', '내일', '오늘', '지금'].map(s => (
                      <button key={s} type="button" onClick={() => handleDateShortcut('originDate', s)} style={dateShortcutStyle}>{s}</button>
                    ))}
                  </div>
                </div>
                <Input 
                  type="datetime-local" 
                  style={{ fontSize: '0.85rem', padding: '0.52rem 0.75rem', height: '40px' }}
                  value={formData.originDate}
                  onChange={e => handleInputChange('originDate', e.target.value)}
                />
              </div>
            </div>

            {/* 하차지 및 하차일시 */}
            <div className="dispatch-form-row" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <label className="text-sm font-bold text-secondary block">하차지 <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {topDestinations.map((dest, i) => {
                      const short = dest.split(' ').slice(0, 2).join(' ')
                      return (
                        <button key={i} type="button" onClick={() => handleRecommendLocation('destination', dest)} style={recommendationButtonStyle}>{short}</button>
                      )
                    })}
                  </div>
                </div>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Input 
                    style={{ 
                      fontSize: '0.85rem',
                      padding: '0.52rem 0.75rem',
                      height: '40px',
                      borderColor: errors.destination ? 'var(--danger)' : 'transparent',
                      boxShadow: errors.destination ? '0 0 0 2px var(--danger-bg)' : 'none',
                      cursor: 'pointer'
                    }} 
                    placeholder="하차지 주소 검색" 
                    value={formData.destination}
                    onClick={() => setActivePostcodeField(activePostcodeField === 'destination' ? null : 'destination')}
                    readOnly
                  />
                  {activePostcodeField === 'destination' && (
                    <>
                      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} onClick={() => setActivePostcodeField(null)} />
                      <div 
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          height: '350px',
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
                                  setFormData(prev => ({ ...prev, destination: addr }));
                                  setErrors(prev => ({ ...prev, destination: false }));
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

                {/* Compact Waypoint row block aligned below destination address input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.35rem' }}>
                  {formData.waypoints && formData.waypoints.map((wp: string, idx: number) => (
                    <div key={idx} style={{ position: 'relative', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: 'var(--primary)',
                          backgroundColor: 'var(--primary-light)',
                          borderRadius: '4px',
                          padding: '0.1rem 0.25rem',
                          flexShrink: 0
                        }}>
                          경유 {idx + 1}
                        </span>
                        <Input
                          style={{ fontSize: '0.8rem', cursor: 'pointer', flex: 1, padding: '0.35rem 0.5rem', height: '30px' }}
                          placeholder={`경유지 ${idx + 1} 주소 검색`}
                          value={wp}
                          onClick={() => setActivePostcodeField(activePostcodeField === `waypoint_${idx}` ? null : `waypoint_${idx}`)}
                          readOnly
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => {
                              const wps = [...(prev.waypoints || [])];
                              wps.splice(idx, 1);
                              return { ...prev, waypoints: wps };
                            });
                          }}
                          style={{
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-secondary)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0 0.4rem',
                            fontSize: '0.68rem',
                            cursor: 'pointer',
                            height: '30px'
                          }}
                        >
                          삭제
                        </button>
                      </div>
                      
                      {activePostcodeField === `waypoint_${idx}` && (
                        <>
                          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} onClick={() => setActivePostcodeField(null)} />
                          <div 
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              right: 0,
                              height: '350px',
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
                                      setFormData(prev => {
                                        const wps = [...(prev.waypoints || [])];
                                        wps[idx] = addr;
                                        return { ...prev, waypoints: wps };
                                      });
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
                  ))}
                  
                  {(!formData.waypoints || formData.waypoints.length < 3) && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          waypoints: [...(prev.waypoints || []), '']
                        }));
                      }}
                      style={{
                        alignSelf: 'flex-start',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'var(--primary)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.15rem',
                        padding: '0.15rem 0'
                      }}
                    >
                      <Plus size={12} /> 경유지 추가 (최대 3개)
                    </button>
                  )}
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label className="text-sm font-bold text-secondary block">하차일시</label>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {['월요일', '내일', '오늘'].map(s => (
                      <button key={s} type="button" onClick={() => handleDateShortcut('destinationDate', s)} style={dateShortcutStyle}>{s}</button>
                    ))}
                  </div>
                </div>
                <Input 
                  type="datetime-local" 
                  style={{ fontSize: '0.85rem', padding: '0.52rem 0.75rem', height: '40px' }}
                  value={formData.destinationDate}
                  onChange={e => handleInputChange('destinationDate', e.target.value)}
                />
              </div>
            </div>



          </div>

          {/* 3. 차량 스펙 */}
          <div className="dispatch-registration-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label className="text-sm font-bold text-secondary" style={{ flexShrink: 0 }}>차량 스펙</label>
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '0.3rem', 
                  justifyContent: 'flex-end',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  flex: 1,
                  marginLeft: '1rem',
                  paddingBottom: '2px'
                }}
                className="hide-scrollbar"
              >
                {topSpecs.map((spec, i) => (
                  <button 
                    key={i} 
                    type="button" 
                    onClick={() => handleRecommendSpec(spec.tonnage, spec.carType, spec.weight)} 
                    style={{ ...recommendationButtonStyle, flexShrink: 0 }}
                  >
                    {spec.tonnage} {spec.carType}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              {/* 톤급 Select Dropdown */}
              <select
                value={formData.tonnage}
                onChange={e => handleInputChange('tonnage', e.target.value)}
                style={selectStyle(errors.tonnage)}
                onFocus={(e) => {
                  if (!errors.tonnage) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                  }
                }}
                onBlur={(e) => {
                  if (!errors.tonnage) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                <option value="">톤급 *</option>
                {tonnages.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* 차종 Select Dropdown */}
              <select
                value={formData.carType}
                onChange={e => handleInputChange('carType', e.target.value)}
                style={selectStyle(errors.carType)}
                onFocus={(e) => {
                  if (!errors.carType) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                  }
                }}
                onBlur={(e) => {
                  if (!errors.carType) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                <option value="">차종 *</option>
                {carTypes.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <Input 
                placeholder="화물실중량" 
                value={formData.weight}
                onChange={e => handleInputChange('weight', e.target.value)}
                style={{ fontSize: '0.85rem', padding: '0.52rem 0.75rem', height: '40px' }}
              />
            </div>
          </div>

          {/* 4. 운임 및 정산 정보 */}
          <div className="dispatch-registration-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Row 1: Settle Method & Settle Date (50% / 50%) */}
            <div className="dispatch-form-row-half" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label className="text-sm font-bold text-secondary mb-1 block" style={{ marginBottom: '0.35rem' }}>정산 방법</label>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  {['인수증', '선불', '착불', '카드'].map(method => (
                    <button 
                      key={method} 
                      type="button" 
                      onClick={() => setFormData({...formData, settleMethod: method})}
                      style={{ ...methodButtonStyle(method), padding: '0.52rem 0.25rem', fontSize: '0.78rem', flex: 1 }}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label className="text-sm font-bold text-secondary block">정산 예정일</label>
                  <div className="date-shortcut-wrapper" style={{ display: 'flex', gap: '0.15rem' }}>
                    {[
                      { label: '미지정', action: () => handleInputChange('settleDate', '') },
                      { label: '바로', action: () => handleInputChange('settleDate', addDaysAndFormat(formData.destinationDate, 0)) },
                      { label: '15일', action: () => handleInputChange('settleDate', addDaysAndFormat(formData.destinationDate, 15)) },
                      { label: '당월말', action: () => handleInputChange('settleDate', formatEndOfMonth(formData.destinationDate, 0)) },
                      { label: '45일', action: () => handleInputChange('settleDate', addDaysAndFormat(formData.destinationDate, 45)) },
                      { label: '익월말', action: () => handleInputChange('settleDate', formatEndOfMonth(formData.destinationDate, 1)) }
                    ].map(btn => (
                      <button 
                        key={btn.label}
                        type="button" 
                        onClick={btn.action} 
                        style={{ ...dateShortcutStyle, padding: '0.12rem 0.25rem', fontSize: '0.66rem' }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Input 
                  type="date" 
                  style={{ fontSize: '0.85rem', padding: '0.52rem 0.75rem', height: '40px' }}
                  value={formData.settleDate}
                  onChange={e => handleInputChange('settleDate', e.target.value)}
                />
              </div>
            </div>

            {/* Row 2: Commission & Fee (50% / 50%) */}
            <div className="dispatch-form-row-half dispatch-form-row-swap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label className="text-sm font-bold text-secondary mb-1 block" style={{ marginBottom: '0.35rem' }}>수수료 (원)</label>
                <Input 
                  type="text" 
                  placeholder="예: 30,000" 
                  disabled={formData.settleMethod === '인수증'}
                  value={formData.settleMethod === '인수증' ? '' : formData.commission}
                  onChange={e => handleInputChange('commission', e.target.value)}
                  style={{ fontSize: '0.85rem', padding: '0.52rem 0.75rem', height: '40px' }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <label className="text-sm font-bold text-secondary block">운임 (원) <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {hasOtherInfo && recentFee && (
                      <button 
                        type="button" 
                        onClick={() => handleInputChange('fee', String(recentFee))} 
                        style={recommendationButtonStyle}
                        title="가장 최근 배차완료된 금액"
                      >
                        최근: {(recentFee / 10000).toFixed(0)}만
                      </button>
                    )}
                    {hasOtherInfo && frequentFee && (
                      <button 
                        type="button" 
                        onClick={() => handleInputChange('fee', String(frequentFee))} 
                        style={recommendationButtonStyle}
                        title="가장 많이 배차된 금액"
                      >
                        최빈: {(frequentFee / 10000).toFixed(0)}만
                      </button>
                    )}
                  </div>
                </div>
                <Input 
                  type="text" 
                  placeholder="예: 300,000" 
                  value={formData.fee}
                  onChange={e => handleInputChange('fee', e.target.value)}
                  style={{
                    fontSize: '0.85rem',
                    padding: '0.52rem 0.75rem',
                    height: '40px',
                    borderColor: errors.fee ? 'var(--danger)' : 'transparent',
                    boxShadow: errors.fee ? '0 0 0 2px var(--danger-bg)' : 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.25rem 0' }} />

            <div className="dispatch-form-row-half dispatch-form-row-swap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label className="text-sm font-bold text-secondary mb-1 block">메모</label>
                <Input 
                  placeholder="추가 요청 사항 입력"
                  value={formData.memo}
                  onChange={e => handleInputChange('memo', e.target.value)}
                  style={{ fontSize: '0.85rem', padding: '0.52rem 0.75rem', height: '40px' }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label className="text-sm font-bold text-secondary block">화물품목</label>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {['철강', '기계', '박스', '빠레트'].map(s => (
                      <button key={s} type="button" onClick={() => handleInputChange('cargoItem', s)} style={recommendationButtonStyle}>{s}</button>
                    ))}
                  </div>
                </div>
                <Input 
                  placeholder="예: 철강, 기계부품 등"
                  value={formData.cargoItem}
                  onChange={e => handleInputChange('cargoItem', e.target.value)}
                  style={{ fontSize: '0.85rem', padding: '0.52rem 0.75rem', height: '40px' }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
            <Button variant="primary" style={{ flex: 1, padding: '0.7rem' }} onClick={handleDispatchSubmit}><Plus size={16} /> 배차 등록</Button>
            <Button 
              variant="secondary" 
              type="button"
              style={{ width: '80px', padding: '0.7rem', fontSize: '0.82rem' }} 
              onClick={handleResetForm}
            >
              초기화
            </Button>
          </div>
        </Card>
          </>
        )}
      </div>

      {/* Right Area: Dispatch History (60% Width) */}
      {showHistoryPanel && (
        <div 
          className="dispatch-right-area animate-fade-slide-up" 
          style={{ display: 'flex', flexDirection: 'column' }}
          onClick={(e) => {
            if (e.target === e.currentTarget && window.innerWidth <= 768) {
              setShowHistoryPanel(false);
            }
          }}
        >
        <Card style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflow: 'hidden', border: 'none' }}>
          <h4 style={{ 
            fontSize: '0.92rem', 
            fontWeight: 700, 
            color: 'var(--text-primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-color)', 
            paddingBottom: '0.5rem', 
            margin: '0 0 -0.25rem 0' 
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '4px', height: '14px', backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-sm)' }}></span>
              {activeLocationListField ? '주요 상하차지 추천 목록' : showClientSearch ? '거래처 검색 및 선택' : '운행 내역'}
            </span>
            <Button
              variant="secondary"
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.74rem' }}
              onClick={() => {
                if (activeLocationListField) setActiveLocationListField(null);
                else if (showClientSearch) setShowClientSearch(false);
                else setShowHistoryPanel(false);
              }}
            >
              {activeLocationListField || showClientSearch ? '닫기' : (window.innerWidth <= 768 ? '닫기' : '접기 ➔')}
            </Button>
          </h4>
          {activeLocationListField ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', height: '100%', overflow: 'hidden' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {formData.clientName.trim() 
                  ? `[${formData.clientName}] 거래처의 주요 상하차지 추천 주소 목록입니다.`
                  : '그동안 등록된 이력을 기반으로 가장 많이 쓰인 상하차지 목록입니다.'}
              </span>
              <div style={{ display: 'grid', gridTemplateRows: '1fr 1.1fr 1.1fr', gap: '0.65rem', flex: 1, overflow: 'hidden' }}>
                
                {/* 1. 주요 구간 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderLeft: '3.5px solid #8b5cf6', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.65rem', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#8b5cf6' }}>⚡ 운행데이터기반 주요구간 (상하차 동시선택)</span>
                  <div style={{ flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {(() => {
                        const routeCounts: Record<string, number> = {};
                        historyPool.forEach(item => {
                          if (item.origin && item.destination) {
                            const key = `${item.origin} === ${item.destination}`;
                            routeCounts[key] = (routeCounts[key] || 0) + 1;
                          }
                        });
                        const topRoutes = Object.entries(routeCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([key]) => {
                          const [origin, destination] = key.split(' === ');
                          return { origin, destination };
                        });
                        return topRoutes.map((route: { origin: string, destination: string }, idx: number) => {
                          const isSelected = formData.origin === route.origin && formData.destination === route.destination;
                          return (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0.55rem', backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                              onClick={() => {
                                setFormData(prev => ({ ...prev, origin: route.origin, destination: route.destination }))
                                setErrors(prev => ({ ...prev, origin: false, destination: false }))
                                setActiveLocationListField(null)
                                triggerNotification(`주요 구간이 선택되었습니다.`)
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', width: '85%' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '15px', height: '15px', fontSize: '0.62rem', fontWeight: 800, backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '50%' }}>{idx + 1}</span>
                                <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                  {route.origin.split(' ').slice(0, 2).join(' ')} &rarr; {route.destination.split(' ').slice(0, 2).join(' ')}
                                </div>
                              </div>
                              <Button variant="secondary" style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem' }}>선택</Button>
                            </div>
                          )
                        })
                      })()}
                    </div>
                  </div>
                </div>

                {/* 2. 주요 상차지 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderLeft: '3.5px solid var(--primary)', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.65rem', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)' }}>📍 거래처 저장기반 주요상차지</span>
                  <div style={{ flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {(() => {
                        const clientName = formData.clientName.trim()
                        let list: string[] = []
                        if (clientName) {
                          const matched = clients.find(c => c.name === clientName)
                          if (matched) list = matched.origins || []
                        }
                        if (list.length === 0) {
                          const counts: Record<string, number> = {};
                          historyPool.forEach(item => {
                            if (item.origin) counts[item.origin] = (counts[item.origin] || 0) + 1
                          })
                          list = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([address]) => address)
                        }
                        return list.map((loc: string, idx: number) => {
                          const isSelected = formData.origin === loc
                          return (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0.55rem', backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                              onClick={() => {
                                setFormData(prev => ({ ...prev, origin: loc }))
                                setErrors(prev => ({ ...prev, origin: false }))
                                setActiveLocationListField(null)
                                triggerNotification(`상차지 선택 완료`)
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', width: '85%' }}>
                                <Badge color="primary">{idx + 1}</Badge>
                                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{loc}</span>
                              </div>
                              <Button variant="secondary" style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem' }}>선택</Button>
                            </div>
                          )
                        })
                      })()}
                    </div>
                  </div>
                </div>

                {/* 3. 주요 하차지 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderLeft: '3.5px solid var(--success)', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.65rem', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--success)' }}>🏁 거래처 저장기반 주요하차지</span>
                  <div style={{ flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {(() => {
                        const clientName = formData.clientName.trim()
                        let list: string[] = []
                        if (clientName) {
                          const matched = clients.find(c => c.name === clientName)
                          if (matched) list = matched.destinations || []
                        }
                        if (list.length === 0) {
                          const counts: Record<string, number> = {};
                          historyPool.forEach(item => {
                            if (item.destination) counts[item.destination] = (counts[item.destination] || 0) + 1
                          })
                          list = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([address]) => address)
                        }
                        return list.map((loc: string, idx: number) => {
                          const isSelected = formData.destination === loc
                          return (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0.55rem', backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                              onClick={() => {
                                setFormData(prev => ({ ...prev, destination: loc }))
                                setErrors(prev => ({ ...prev, destination: false }))
                                setActiveLocationListField(null)
                                triggerNotification(`하차지 선택 완료`)
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', width: '85%' }}>
                                <Badge color="success">{idx + 1}</Badge>
                                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{loc}</span>
                              </div>
                              <Button variant="secondary" style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem' }}>선택</Button>
                            </div>
                          )
                        })
                      })()}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : showClientSearch ? (
            <div className="animate-slide-down" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%', overflow: 'hidden' }}>
              {/* Client Search Header & Filters */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem', flex: 1 }}>
                  <div style={{ position: 'relative', width: '320px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <Input 
                      placeholder="거래처명, 담당자 또는 연락처로 검색..." 
                      style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }} 
                      value={clientSearchTerm} 
                      onChange={e => setClientSearchTerm(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') setClientSearchFilter(clientSearchTerm)
                      }}
                    />
                  </div>
                  <Button 
                    variant="secondary" 
                    style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}
                    onClick={() => setClientSearchFilter(clientSearchTerm)}
                  >
                    검색
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}
                  onClick={() => setShowClientSearch(false)}
                >
                  운행내역 보기
                </Button>
              </div>

              {/* Client List Table */}
              <div style={{ flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '1rem 0.75rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>거래처명</th>
                      <th style={{ padding: '1rem 0.75rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>사업자번호</th>
                      <th style={{ padding: '1rem 0.75rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>담당자</th>
                      <th style={{ padding: '1rem 0.75rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>연락처</th>
                      <th style={{ padding: '1rem 0.75rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)', width: '80px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients
                      .filter(client => {
                        const term = clientSearchFilter.toLowerCase().trim()
                        if (!term) return true
                        return (
                          client.name.toLowerCase().includes(term) ||
                          client.contact.toLowerCase().includes(term) ||
                          client.phone.includes(term) ||
                          client.businessNo.includes(term)
                        )
                      })
                      .map(client => (
                        <tr 
                          key={client.id} 
                          style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color var(--transition-fast)', cursor: 'pointer' }}
                          onClick={() => handleSelectClient(client)}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td style={{ padding: '1rem 0.75rem', fontWeight: 700 }}>{client.name}</td>
                          <td style={{ padding: '1rem 0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{client.businessNo}</td>
                          <td style={{ padding: '1rem 0.75rem', fontWeight: 600 }}>{client.contact}</td>
                          <td style={{ padding: '1rem 0.75rem', color: 'var(--text-secondary)' }}>{client.phone}</td>
                          <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                            <Button
                              variant="primary"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSelectClient(client)
                              }}
                            >
                              선택
                            </Button>
                          </td>
                        </tr>
                      ))}
                    {clients.filter(client => {
                      const term = clientSearchFilter.toLowerCase().trim()
                      if (!term) return true
                      return (
                        client.name.toLowerCase().includes(term) ||
                        client.contact.toLowerCase().includes(term) ||
                        client.phone.includes(term) ||
                        client.businessNo.includes(term)
                      )
                    }).length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                          검색 조건에 부합하는 거래처가 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeLocationListField ? null : (
            <>

          
          {/* Filters and Controls (Inside Card) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            
            {/* Date Filter Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginRight: '0.25rem' }}>날짜 필터:</span>
              {['전체', '오늘', '이번주', '지난주', '이번달', '지난달', '직접선택'].map(t => (
                <button key={t} type="button" onClick={() => setDateFilterType(t)} style={filterTabStyle(dateFilterType === t)}>
                  {t} ({getDateCount(t)})
                </button>
              ))}
              
              {/* Custom Date Range Inputs */}
              {dateFilterType === '직접선택' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: '0.5rem', animation: 'fadeIn var(--transition-fast)' }}>
                  <Input 
                    type="date" 
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: '120px' }} 
                    value={customStartDate} 
                    onChange={e => setCustomStartDate(e.target.value)} 
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>~</span>
                  <Input 
                    type="date" 
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: '120px' }} 
                    value={customEndDate} 
                    onChange={e => setCustomEndDate(e.target.value)} 
                  />
                </div>
              )}
            </div>

            {/* Status Filter & Search (Same Line) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'nowrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '2px', flex: 1 }} className="hide-scrollbar">
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginRight: '0.25rem', flexShrink: 0 }}>배차 상태:</span>
                {['전체', '배차중', '배차완료', '배차취소', '상차완료', '하차완료', '운행완료'].map(s => (
                  <button key={s} type="button" onClick={() => setStatusFilter(s)} style={{ ...filterTabStyle(statusFilter === s), flexShrink: 0 }}>
                    {s} ({getStatusCount(s)})
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.3rem', marginLeft: 'auto', flexShrink: 0 }}>
                <Input 
                  placeholder="검색어..." 
                  style={{ width: '130px', padding: '0.4rem 0.6rem', fontSize: '0.82rem' }} 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') setSearchFilter(searchTerm)
                  }}
                />
                <Button 
                  variant="secondary" 
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                  onClick={() => setSearchFilter(searchTerm)}
                >
                  <Search size={12} /> 검색
                </Button>
                <Button 
                  variant="outline" 
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.82rem' }}
                  onClick={handleResetFilters}
                >
                  초기화
                </Button>
              </div>
            </div>
          </div>

          {/* Table Container (Scrollable, inside Card) */}
          <div style={{ flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '85px' }} />
                <col style={{ width: '90px' }} />
                <col style={{ width: '150px' }} />
                <col style={{ width: '115px' }} />
                <col style={{ width: '165px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '40px' }} />
              </colgroup>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>상태</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>화주</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>노선 (상차 &rarr; 하차)</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>차량스펙</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>차주 정보</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>운임</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-tertiary)', width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredDispatches.map(dispatch => {
                  const isExpanded = expandedId === dispatch.id
                  const hasDriver = dispatch.status !== 'dispatching' && dispatch.status !== 'cancelled'
                  
                  return (
                    <React.Fragment key={dispatch.id}>
                      {/* Main Row */}
                      <tr 
                        className={blinkRow && blinkRow.id === dispatch.id ? 'blink-row-active' : undefined}
                        style={{ 
                          borderBottom: isExpanded ? 'none' : '1px solid var(--border-color)', 
                          transition: 'background-color var(--transition-fast)',
                          cursor: 'pointer',
                          backgroundColor: isExpanded ? 'var(--bg-tertiary)' : 'transparent',
                          animation: blinkRow && blinkRow.id === dispatch.id ? `blink-${blinkRow.status} 1.0s ease-out forwards` : undefined
                        }} 
                        onClick={() => {
                          if (isExpanded) {
                            setExpandedId(null)
                          } else {
                            setExpandedId(dispatch.id)
                            setDriverInput({
                              carNumber: dispatch.carNumber || '',
                              driverName: dispatch.driverName || '',
                              driverPhone: dispatch.driverPhone || ''
                            })
                          }
                        }}
                        onMouseEnter={e => {
                          if (!isExpanded) e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'
                        }} 
                        onMouseLeave={e => {
                          if (!isExpanded) e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          {dispatch.status === 'dispatching' && (
                            <>
                              <Badge color="warning">배차중</Badge>
                              <DispatchTrafficLight dispatch={dispatch} />
                            </>
                          )}
                          {dispatch.status === 'dispatched' && <Badge color="primary">배차완료</Badge>}
                          {dispatch.status === 'cancelled' && <Badge color="danger">배차취소</Badge>}
                          {dispatch.status === 'loaded' && <Badge color="success">상차완료</Badge>}
                          {dispatch.status === 'unloaded' && <Badge color="gray">하차완료</Badge>}
                          {dispatch.status === 'completed' && <Badge color="success">운행완료</Badge>}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, fontSize: '0.88rem' }}>{dispatch.client}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            {/* Line 1: Origin */}
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {dispatch.origin.split(' ').slice(0, 2).join(' ')}
                            </span>
                            {/* Line 2: Waypoint indicator -> Destination */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 700 }}>
                              {dispatch.waypoints && dispatch.waypoints.length > 0 ? (
                                <span style={{ 
                                  fontSize: '0.72rem', 
                                  backgroundColor: 'var(--primary-light)', 
                                  color: 'var(--primary)', 
                                  padding: '0.05rem 0.35rem', 
                                  borderRadius: '4px',
                                  fontWeight: 700
                                }}>
                                  경유지{dispatch.waypoints.length}
                                </span>
                              ) : null}
                              <span style={{ color: 'var(--primary)', fontWeight: 800 }}>&rarr;</span>
                              <span style={{ color: 'var(--text-secondary)' }}>
                                {dispatch.destination.split(' ').slice(0, 2).join(' ')}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{dispatch.spec}</td>
                        <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.82rem' }}>
                          {hasDriver ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{dispatch.carNumber}</span>
                              <span style={{ color: 'var(--text-secondary)' }}>{dispatch.driverName} ({dispatch.driverPhone})</span>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                              {dispatch.status === 'cancelled' ? '배차 취소됨' : '차주 미지정'}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, fontSize: '0.92rem', color: 'var(--primary)' }}>{dispatch.fee.toLocaleString()}원</td>
                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </td>
                      </tr>

                      {/* Expanded Detail Panel */}
                      {isExpanded && (
                        <tr id={`expanded-row-${dispatch.id}`} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                          <td colSpan={7} style={{ padding: '0.5rem 1rem 1rem 1rem' }}>
                            <div style={{
                              borderRadius: 'var(--radius-md)',
                              overflow: 'hidden',
                              animation: blinkRow && blinkRow.id === dispatch.id ? `blink-${blinkRow.status} 1.0s ease-out forwards` : undefined
                            }}>
                              <div 
                                className="animate-slide-down"
                                style={{
                                  padding: '1.25rem',
                                  backgroundColor: 'var(--bg-primary)',
                                  borderRadius: 'var(--radius-md)',
                                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '1.25rem'
                                }}
                              >
                              {/* AI Advisor for Dispatch Traffic Light */}
                              {dispatch.status === 'dispatching' && (() => {
                                const baseDiff = dispatch.id % 3;
                                const diffInFee = dispatch.fee - (dispatch.originalFee || dispatch.fee);

                                let difficulty = baseDiff;
                                if (baseDiff === 1) {
                                  if (diffInFee >= 10000) {
                                    difficulty = 0;
                                  }
                                } else if (baseDiff === 2) {
                                  if (diffInFee >= 25000) {
                                    difficulty = 0;
                                  } else if (diffInFee >= 10000) {
                                    difficulty = 1;
                                  }
                                }

                                const baseFee = dispatch.originalFee || dispatch.fee;
                                const avgFee = baseDiff === 0 
                                  ? Math.round((baseFee * 0.96) / 10000) * 10000
                                  : baseDiff === 1
                                  ? Math.round((baseFee * 1.03) / 10000) * 10000
                                  : Math.round((baseFee * 1.09) / 10000) * 10000;

                                const alertColors = [
                                  { border: '#10B981', bg: 'rgba(16, 185, 129, 0.04)', text: '#059669', label: '배차 신호등: 원활 (녹색) 🟢', desc: '현재 조건으로 배차가 신속하게 진행될 것으로 분석됩니다.' },
                                  { border: '#F59E0B', bg: 'rgba(245, 158, 11, 0.04)', text: '#D97706', label: '배차 신호등: 주의 (황색) 🟡', desc: '경쟁 화물이 다수 포착되어 매칭 대기 시간이 다소 지연될 수 있습니다.' },
                                  { border: '#EF4444', bg: 'rgba(239, 68, 68, 0.04)', text: '#DC2626', label: '배차 신호등: 지연 우려 (적색) 🔴', desc: '인근 가용 차주 수 대비 동일 시간대 경쟁 화물이 집중되어 배차 지연 확률이 높습니다.' }
                                ][difficulty];

                                return (
                                  <div style={{
                                    backgroundColor: alertColors.bg,
                                    border: '1px solid var(--border-color)',
                                    borderLeft: `4px solid ${alertColors.border}`,
                                    borderRadius: 'var(--radius-md)',
                                    padding: '0.75rem 1rem',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.01)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.45rem'
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 800, color: alertColors.text }}>
                                        <span>{difficulty === 0 ? '🟢 배차 원활' : difficulty === 1 ? '🟡 배차 지연 주의' : '🔴 배차 지연 우려'}</span>
                                      </div>
                                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>AI 실시간 배차 분석 어드바이저</span>
                                    </div>
                                    
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 600, lineHeight: 1.45 }}>
                                      {difficulty === 0 && '현재 주변 가용 차주가 충분하여 원활하게 배차될 것으로 보입니다. 현재 운임을 유지하셔도 좋습니다.'}
                                      {difficulty === 1 && '인근 경쟁 화물들로 인해 매칭 지연 주의가 감지됩니다. 운임을 1~2만 원 가량 보강하시거나 상차 대기 시간을 연장해 보세요.'}
                                      {difficulty === 2 && '공차 대비 주변의 경쟁 화물이 매우 집중된 심각 상태입니다. 원활한 배차 성사를 위해 운임을 평균 권장 수준으로 긴급 보강하십시오.'}
                                    </p>

                                    <div style={{ 
                                      display: 'flex', 
                                      flexWrap: 'wrap',
                                      columnGap: '1rem', 
                                      rowGap: '0.2rem',
                                      marginTop: '0.1rem', 
                                      paddingTop: '0.45rem',
                                      borderTop: '1px dashed var(--border-color)',
                                      fontSize: '0.72rem', 
                                      color: 'var(--text-tertiary)', 
                                      fontWeight: 500 
                                    }}>
                                      <span>• 대기 차주: <strong style={{ color: 'var(--text-primary)' }}>{difficulty === 0 ? '인근 22명 공차 대기' : difficulty === 1 ? '인근 12명 공차 대기' : '인근 3명 미만 대기'}</strong></span>
                                      <span>• 경쟁 화물: <strong style={{ color: 'var(--text-primary)' }}>{difficulty === 0 ? '경쟁 화물 없음' : difficulty === 1 ? '경쟁 화물 약 8건' : '동일 조건 화물 30개 이상'}</strong></span>
                                      <span>• 구간 평균 운임: <strong style={{ color: 'var(--text-primary)' }}>{avgFee.toLocaleString()}원</strong> ({difficulty === 0 ? '적정' : difficulty === 1 ? '유사' : '평균 이하'})</span>
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* Layout Details (55% left, 45% right) */}
                              <div className="dispatch-detail-grid" style={{ gap: '1.25rem' }}>
                                
                                {/* Left Side: Dispatch Detail Info (Wrapped in white box: bg-secondary) */}
                                <div style={{ 
                                  backgroundColor: 'var(--bg-secondary)', 
                                  border: '1px solid var(--border-color)', 
                                  borderRadius: 'var(--radius-md)', 
                                  padding: '0.85rem 1rem',
                                  display: 'flex', 
                                  flexDirection: 'column', 
                                  gap: '0.85rem',
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                  height: '100%'
                                }}>
                                  <h4 style={{ 
                                     fontSize: '0.92rem',
                                     fontWeight: 700, 
                                     color: 'var(--text-primary)', 
                                     display: 'flex', 
                                     alignItems: 'center', 
                                     justifyContent: 'space-between',
                                     gap: '0.35rem',
                                     borderBottom: '1px solid var(--border-color)', 
                                     paddingBottom: '0.5rem',
                                     margin: 0
                                   }}>
                                     <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                       <span style={{ width: '4px', height: '14px', backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-sm)' }}></span>
                                       상세 정보
                                     </span>
                                     <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 500, fontSize: '0.8rem' }}>
                                       <span style={{ color: 'var(--text-secondary)' }}>거래처: <strong style={{ color: 'var(--text-primary)' }}>{dispatch.client}</strong></span>
                                       <Button
                                         variant="outline"
                                         style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', borderColor: 'var(--primary)', color: 'var(--primary)', height: '24px', display: 'flex', alignItems: 'center' }}
                                         onClick={(e: any) => {
                                           e.stopPropagation();
                                           loadOrCreateChatRoom(dispatch.client, 'client', '02-8877-2233');
                                         }}
                                       >
                                         대화방
                                       </Button>
                                     </span>
                                   </h4>
                                  
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                                    
                                    {/* 1. Route Timeline */}
                                    <div style={{ 
                                      display: 'grid',
                                      gridTemplateColumns: '1fr 1fr',
                                      gap: '1rem',
                                      position: 'relative',
                                      padding: '0.25rem 0'
                                    }}>
                                      {/* Origin Block */}
                                      <div>
                                        <span style={{ 
                                          display: 'inline-block', 
                                          fontSize: '0.72rem', 
                                          fontWeight: 700, 
                                          color: 'var(--primary)', 
                                          backgroundColor: 'var(--primary-light)',
                                          padding: '0.15rem 0.4rem',
                                          borderRadius: 'var(--radius-sm)',
                                          marginBottom: '0.35rem'
                                        }}>상차지</span>
                                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)', wordBreak: 'break-all', lineHeight: 1.3 }}>
                                          {dispatch.origin}
                                        </div>
                                        <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                          📅 {dispatch.originDate ? new Date(dispatch.originDate).toLocaleString() : '미기재'}
                                        </div>
                                      </div>

                                      {/* Destination Block */}
                                      <div style={{ paddingLeft: '0.5rem', borderLeft: '1px dashed var(--border-color)' }}>
                                        <span style={{ 
                                          display: 'inline-block', 
                                          fontSize: '0.72rem', 
                                          fontWeight: 700, 
                                          color: 'var(--success)', 
                                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                          padding: '0.15rem 0.4rem',
                                          borderRadius: 'var(--radius-sm)',
                                          marginBottom: '0.35rem'
                                        }}>하차지</span>
                                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)', wordBreak: 'break-all', lineHeight: 1.3 }}>
                                          {dispatch.destination}
                                        </div>
                                        <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                          📅 {dispatch.destinationDate ? new Date(dispatch.destinationDate).toLocaleString() : '미기재'}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Waypoints Manager Card */}
                                    <div style={{
                                      marginTop: '0.5rem',
                                      padding: '0.75rem',
                                      backgroundColor: 'var(--bg-primary)',
                                      borderRadius: 'var(--radius-md)',
                                      border: '1px solid var(--border-color)',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '0.5rem'
                                    }} onClick={e => e.stopPropagation()}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)' }}>경유지 정보 및 관리</span>
                                        {editingWaypointsId !== dispatch.id ? (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setEditingWaypointsId(dispatch.id);
                                              setEditWaypoints(dispatch.waypoints || []);
                                            }}
                                            style={{ border: 'none', backgroundColor: 'transparent', color: 'var(--primary)', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                                          >
                                            수정
                                          </button>
                                        ) : (
                                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const saved = localStorage.getItem('dispatches');
                                                let items = [];
                                                if (saved) { items = JSON.parse(saved); }
                                                const updatedItems = items.map((d: any) => {
                                                  if (d.id === dispatch.id) {
                                                    return { ...d, waypoints: editWaypoints.filter(w => w.trim() !== '') };
                                                  }
                                                  return d;
                                                });
                                                setDispatches(updatedItems);
                                                localStorage.setItem('dispatches', JSON.stringify(updatedItems));
                                                setEditingWaypointsId(null);
                                              }}
                                              style={{ border: 'none', backgroundColor: 'transparent', color: 'var(--primary)', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                                            >
                                              저장
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => setEditingWaypointsId(null)}
                                              style={{ border: 'none', backgroundColor: 'transparent', color: 'var(--text-tertiary)', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                                            >
                                              취소
                                            </button>
                                          </div>
                                        )}
                                      </div>

                                      {editingWaypointsId === dispatch.id ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                          {editWaypoints.map((wp, wIdx) => (
                                            <div key={wIdx} style={{ position: 'relative', width: '100%' }}>
                                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fff', backgroundColor: 'var(--primary)', borderRadius: '4px', padding: '0.1rem 0.3rem', flexShrink: 0 }}>경유 {wIdx + 1}</span>
                                                <Input
                                                  style={{ fontSize: '0.82rem', cursor: 'pointer', flex: 1, padding: '0.3rem 0.5rem' }}
                                                  placeholder={`경유지 ${wIdx + 1} 주소 검색`}
                                                  value={wp}
                                                  onClick={() => setActivePostcodeField(activePostcodeField === `edit_waypoint_${wIdx}` ? null : `edit_waypoint_${wIdx}`)}
                                                  readOnly
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    const nextWps = [...editWaypoints];
                                                    nextWps.splice(wIdx, 1);
                                                    setEditWaypoints(nextWps);
                                                  }}
                                                  style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '0.25rem 0.45rem', fontSize: '0.72rem', cursor: 'pointer' }}
                                                >
                                                  삭제
                                                </button>
                                              </div>
                                              {activePostcodeField === `edit_waypoint_${wIdx}` && (
                                                <>
                                                  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} onClick={() => setActivePostcodeField(null)} />
                                                  <div 
                                                    style={{
                                                      position: 'absolute',
                                                      top: '100%',
                                                      left: 0,
                                                      right: 0,
                                                      height: '350px',
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
                                                              const nextWps = [...editWaypoints];
                                                              nextWps[wIdx] = addr;
                                                              setEditWaypoints(nextWps);
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
                                          ))}
                                          {editWaypoints.length < 3 && (
                                            <button
                                              type="button"
                                              onClick={() => setEditWaypoints([...editWaypoints, ''])}
                                              style={{ border: '1px dashed var(--primary)', backgroundColor: 'transparent', color: 'var(--primary)', borderRadius: 'var(--radius-sm)', padding: '0.3rem', fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                                            >
                                              <Plus size={12} /> 경유지 추가
                                            </button>
                                          )}
                                        </div>
                                      ) : (
                                        <div>
                                          {dispatch.waypoints && dispatch.waypoints.length > 0 ? (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                                              {dispatch.waypoints.map((wp: string, wIdx: number) => (
                                                <div key={wIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                  {wIdx > 0 && <span style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem' }}>&rarr;</span>}
                                                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', backgroundColor: 'var(--bg-secondary)', padding: '0.15rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>
                                                    {wp}
                                                  </span>
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            <span style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>등록된 경유지가 없습니다.</span>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    <div style={{ borderBottom: '1px solid var(--border-color)', opacity: 0.6, margin: '0.1rem 0' }} />

                                    {/* 2. Billing & Cargo Details */}
                                    <div style={{ 
                                      display: 'grid',
                                      gridTemplateColumns: '1fr 1fr',
                                      gap: '0.75rem 1rem',
                                      padding: '0.25rem 0'
                                    }}>
                                      <div>
                                        <span style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.15rem' }}>정산 수단 / 수수료</span>
                                        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                          {dispatch.settleMethod} {dispatch.commission ? "(수수료: " + Number(dispatch.commission).toLocaleString() + "원)" : "(수수료 없음)"}
                                        </span>
                                      </div>
                                      <div>
                                        <span style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.15rem' }}>정산 예정일</span>
                                        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                          {dispatch.settleDate || '미정'}
                                        </span>
                                      </div>
                                      <div style={{ gridColumn: 'span 2', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem', marginTop: '0.15rem' }}>
                                        <span style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.15rem' }}>화물품목</span>
                                        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary)' }}>
                                          {(dispatch as any).cargoItem || '일반화물'}
                                        </span>
                                      </div>
                                    </div>

                                    <div style={{ borderBottom: '1px solid var(--border-color)', opacity: 0.6, margin: '0.1rem 0' }} />

                                    {/* 3. Memo Box */}
                                    <div style={{ 
                                      borderLeft: '3.5px solid var(--primary)', 
                                      padding: '0.25rem 0.85rem',
                                      fontSize: '0.82rem'
                                    }}>
                                      <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.15rem' }}>기사 전달사항 및 메모</span>
                                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', lineHeight: '1.4' }}>
                                        {(dispatch as any).memo || '특이사항 없음'}
                                      </span>
                                    </div>

                                  </div>
                                </div>

                                {/* Right Side: Console Cards */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', height: '100%' }}>
                                  
                                  {/* 1. 운임 및 수수료 정보 수정 Card (White background: bg-secondary) */}
                                  <div style={{ 
                                    backgroundColor: 'var(--bg-secondary)', 
                                    border: '1px solid var(--border-color)', 
                                    borderRadius: 'var(--radius-md)', 
                                    padding: '0.85rem 1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                                  }} onClick={e => e.stopPropagation()}>
                                    <h4 style={{ 
                                      fontSize: '0.92rem', 
                                      fontWeight: 700, 
                                      color: 'var(--text-primary)', 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      gap: '0.35rem',
                                      borderBottom: '1px solid var(--border-color)', 
                                      paddingBottom: '0.5rem',
                                      margin: 0
                                    }}>
                                      <span style={{ width: '4px', height: '14px', backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-sm)' }}></span>
                                      운임 및 수수료 정보 수정
                                      <span style={{ fontSize: '0.74rem', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '0.4rem' }}>
                                        (정산방법: {dispatch.settleMethod})
                                      </span>
                                    </h4>

                                    {/* Quick adjust function defined inline inside loop */}
                                    {(() => {
                                      const currentTarget = adjustTargetMap[dispatch.id] || 'fee';
                                      const adjustAmount = (delta: number) => {
                                        if (editingFeeId !== dispatch.id) {
                                          setEditingFeeId(dispatch.id);
                                          const currentFee = dispatch.fee;
                                          const currentComm = dispatch.commission ? Number(dispatch.commission) : 0;
                                          if (currentTarget === 'fee') {
                                            const newVal = Math.max(0, currentFee + delta);
                                            setEditingFeeValue(newVal.toLocaleString());
                                            setEditingCommissionValue(currentComm ? currentComm.toLocaleString() : '');
                                          } else {
                                            const newVal = Math.max(0, currentComm + delta);
                                            setEditingFeeValue(currentFee.toLocaleString());
                                            setEditingCommissionValue(newVal ? newVal.toLocaleString() : '');
                                          }
                                        } else {
                                          if (currentTarget === 'fee') {
                                            const current = Number(editingFeeValue.replace(/,/g, '')) || 0;
                                            const newVal = Math.max(0, current + delta);
                                            setEditingFeeValue(newVal.toLocaleString());
                                          } else {
                                            const current = Number(editingCommissionValue.replace(/,/g, '')) || 0;
                                            const newVal = Math.max(0, current + delta);
                                            setEditingCommissionValue(newVal ? newVal.toLocaleString() : '');
                                          }
                                        }
                                      };

                                      return (
                                        <div className="fee-correction-grid-wrapper" style={{ overflowX: 'auto', paddingBottom: '4px' }} onClick={e => e.stopPropagation()}>
                                          <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'auto 1.1fr auto auto auto auto auto', 
                                            gap: '0.4rem 0.5rem', 
                                            alignItems: 'center', 
                                            marginTop: '0.25rem',
                                            minWidth: '345px'
                                          }}>
                                            {/* Row 1 */}
                                            <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', textAlign: 'right' }}>운임:</span>
                                            <Input 
                                              type="text" 
                                              style={{ padding: '0.35rem 0.5rem', fontSize: '0.82rem', width: '100%' }}
                                              placeholder="운임 입력"
                                              value={(editingFeeId === dispatch.id ? editingFeeValue : dispatch.fee.toLocaleString()) || ''}
                                              onChange={e => {
                                                setEditingFeeId(dispatch.id)
                                                setEditingFeeValue(formatAmount(e.target.value))
                                              }}
                                              onFocus={() => {
                                                if (editingFeeId !== dispatch.id) {
                                                  setEditingFeeId(dispatch.id)
                                                  setEditingFeeValue(dispatch.fee.toLocaleString())
                                                  setEditingCommissionValue(dispatch.commission ? Number(dispatch.commission).toLocaleString() : '')
                                                }
                                              }}
                                            />
                                            
                                            {/* Toggle Switch (Spans 2 Rows) */}
                                            <div style={{ 
                                              gridRow: 'span 2', 
                                              display: 'flex', 
                                              flexDirection: 'column', 
                                              border: '1px solid var(--border-color)', 
                                              borderRadius: 'var(--radius-sm)', 
                                              overflow: 'hidden', 
                                              height: '100%',
                                              width: '32px',
                                              backgroundColor: 'var(--bg-primary)'
                                            }}>
                                              <button 
                                                type="button" 
                                                onClick={() => setAdjustTargetMap(prev => ({ ...prev, [dispatch.id]: 'fee' }))}
                                                style={{ 
                                                  flex: 1, 
                                                  border: 'none', 
                                                  borderBottom: '1px solid var(--border-color)',
                                                  backgroundColor: currentTarget === 'fee' ? 'var(--primary)' : 'transparent',
                                                  color: currentTarget === 'fee' ? 'white' : 'var(--text-secondary)',
                                                  fontSize: '0.76rem',
                                                  fontWeight: 700,
                                                  cursor: 'pointer',
                                                  padding: '2px 0',
                                                  transition: 'all var(--transition-fast)'
                                                }}
                                              >
                                                운
                                              </button>
                                              <button 
                                                type="button" 
                                                onClick={() => setAdjustTargetMap(prev => ({ ...prev, [dispatch.id]: 'commission' }))}
                                                disabled={dispatch.settleMethod === '인수증'}
                                                style={{ 
                                                  flex: 1, 
                                                  border: 'none', 
                                                  backgroundColor: currentTarget === 'commission' ? 'var(--primary)' : 'transparent',
                                                  color: currentTarget === 'commission' ? 'white' : 'var(--text-secondary)',
                                                  fontSize: '0.76rem',
                                                  fontWeight: 700,
                                                  cursor: 'pointer',
                                                  padding: '2px 0',
                                                  transition: 'all var(--transition-fast)',
                                                  opacity: dispatch.settleMethod === '인수증' ? 0.4 : 1
                                                }}
                                              >
                                                수
                                              </button>
                                            </div>

                                            {/* Row 1 adjustment buttons */}
                                            <button type="button" onClick={() => adjustAmount(10000)} style={adjustButtonStyle('var(--danger-bg)', 'var(--danger)')}>+1만</button>
                                            <button type="button" onClick={() => adjustAmount(5000)} style={adjustButtonStyle('var(--danger-bg)', 'var(--danger)')}>+5천</button>
                                            <button type="button" onClick={() => adjustAmount(1000)} style={adjustButtonStyle('var(--danger-bg)', 'var(--danger)')}>+1천</button>

                                            {/* Save Button (Spans 2 Rows) */}
                                            <Button 
                                              variant="primary" 
                                              style={{ 
                                                gridRow: 'span 2', 
                                                padding: '0.35rem 0.75rem', 
                                                fontSize: '0.82rem', 
                                                height: '100%', 
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                whiteSpace: 'nowrap'
                                              }}
                                              onClick={() => handleQuickFeeSave(dispatch.id)}
                                              disabled={editingFeeId !== dispatch.id}
                                            >
                                              수정
                                            </Button>

                                            {/* Row 2 */}
                                            <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', textAlign: 'right' }}>수수료:</span>
                                            <Input 
                                              type="text" 
                                              style={{ padding: '0.35rem 0.5rem', fontSize: '0.82rem', width: '100%' }}
                                              placeholder="수수료 입력"
                                              disabled={dispatch.settleMethod === '인수증'}
                                              value={(editingFeeId === dispatch.id ? editingCommissionValue : (dispatch.commission ? Number(dispatch.commission).toLocaleString() : '')) || ''}
                                              onChange={e => {
                                                setEditingFeeId(dispatch.id)
                                                setEditingCommissionValue(formatAmount(e.target.value))
                                              }}
                                              onFocus={() => {
                                                if (editingFeeId !== dispatch.id) {
                                                  setEditingFeeId(dispatch.id)
                                                  setEditingFeeValue(dispatch.fee.toLocaleString())
                                                  setEditingCommissionValue(dispatch.commission ? Number(dispatch.commission).toLocaleString() : '')
                                                }
                                              }}
                                            />

                                            {/* Row 2 adjustment buttons */}
                                            <button type="button" onClick={() => adjustAmount(-10000)} style={adjustButtonStyle('var(--primary-light)', 'var(--primary)')}>-1만</button>
                                            <button type="button" onClick={() => adjustAmount(-5000)} style={adjustButtonStyle('var(--primary-light)', 'var(--primary)')}>-5천</button>
                                            <button type="button" onClick={() => adjustAmount(-1000)} style={adjustButtonStyle('var(--primary-light)', 'var(--primary)')}>-1천</button>
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </div>

                                  {/* 2. 차주 배정 및 상태 제어 Card (White background: bg-secondary, expanded height) */}
                                  <div style={{ 
                                    backgroundColor: 'var(--bg-secondary)', 
                                    border: '1px solid var(--border-color)', 
                                    borderRadius: 'var(--radius-md)', 
                                    padding: '0.85rem 1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                    flex: 1
                                  }} onClick={e => e.stopPropagation()}>
                                    <h4 style={{ 
                                       fontSize: '0.92rem', 
                                       fontWeight: 700, 
                                       color: 'var(--text-primary)', 
                                       display: 'flex', 
                                       alignItems: 'center', 
                                       gap: '0.35rem',
                                       borderBottom: '1px solid var(--border-color)', 
                                       paddingBottom: '0.5rem',
                                       margin: '0 0 0.25rem 0'
                                     }}>
                                       <span style={{ width: '4px', height: '14px', backgroundColor: 'var(--success)', borderRadius: 'var(--radius-sm)' }}></span>
                                       차주 배정 및 상태 제어
                                     </h4>
                                    
                                    {/* Driver Info Inputs (CSS Grid) */}
                                    <div style={{ 
                                      display: 'grid', 
                                      gridTemplateColumns: '1fr 1.2fr 85px', 
                                      gap: '0.45rem 0.5rem',
                                      alignItems: 'center'
                                    }}>
                                      {/* Row 1 */}
                                      <div style={{ gridColumn: 'span 2' }}>
                                        <Input 
                                          placeholder="차량번호 (예: 서울 12가 3456)" 
                                          style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }} 
                                          value={driverInput.carNumber}
                                          onChange={e => setDriverInput({...driverInput, carNumber: e.target.value})}
                                        />
                                      </div>
                                      <Button
                                        variant="primary"
                                        style={{ width: '100%', padding: '0.5rem 0', fontSize: '0.82rem', whiteSpace: 'nowrap', textAlign: 'center' }}
                                        onClick={() => setAssigningDispatchId(dispatch.id)}
                                      >
                                        차량배정
                                      </Button>

                                      {/* Row 2 */}
                                      <Input 
                                        placeholder="차주명" 
                                        style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }} 
                                        value={driverInput.driverName}
                                        onChange={e => setDriverInput({...driverInput, driverName: e.target.value})}
                                      />
                                      <Input 
                                        placeholder="연락처 (예: 010-0000-0000)" 
                                        style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }} 
                                        value={driverInput.driverPhone}
                                        onChange={e => setDriverInput({...driverInput, driverPhone: formatPhone(e.target.value)})}
                                      />
                                      {dispatch.driverName ? (
                                        <Button
                                          variant="outline"
                                          style={{ width: '100%', padding: '0.5rem 0', fontSize: '0.82rem', whiteSpace: 'nowrap', borderColor: 'var(--primary)', color: 'var(--primary)', textAlign: 'center' }}
                                          onClick={() => {
                                            loadOrCreateChatRoom(dispatch.driverName, 'driver', dispatch.driverPhone, dispatch.carNumber);
                                          }}
                                        >
                                          대화방
                                        </Button>
                                      ) : (
                                        <div />
                                      )}
                                    </div>

                                    {/* Action Buttons for Status Setting (Segment Control Toggle Type) */}
                                    <div className="status-segment-bar" style={{ 
                                      display: 'flex', 
                                      flexDirection: 'row', 
                                      border: '1px solid var(--border-color)', 
                                      borderRadius: 'var(--radius-sm)', 
                                      overflow: 'hidden', 
                                      marginTop: '0.65rem'
                                    }}>
                                      {[
                                        { key: 'dispatched', label: '배차완료', activeBg: 'var(--primary)' },
                                        { key: 'loaded', label: '상차완료', activeBg: '#10B981' },
                                        { key: 'unloaded', label: '하차완료', activeBg: 'var(--text-secondary)' },
                                        { key: 'completed', label: '운행완료', activeBg: '#10B981' },
                                        { key: 'dispatching', label: '배차대기', activeBg: '#F59E0B' },
                                        { key: 'cancelled', label: '배차취소', activeBg: '#EF4444' }
                                      ].map((item, idx, arr) => {
                                        const isActive = dispatch.status === item.key;
                                        const isLast = idx === arr.length - 1;
                                        return (
                                          <button
                                            key={item.key}
                                            type="button"
                                            onClick={() => {
                                              let next = item.key;
                                              if (isActive) {
                                                if (item.key === 'dispatched') next = 'dispatching';
                                                else if (item.key === 'loaded') next = 'dispatched';
                                                else if (item.key === 'unloaded') next = 'loaded';
                                                else if (item.key === 'completed') next = 'unloaded';
                                                else if (item.key === 'cancelled') next = 'dispatching';
                                                else if (item.key === 'dispatching') next = 'dispatched';
                                              }
                                              handleUpdateDriverAndStatus(dispatch.id, next as DispatchStatus);
                                            }}
                                            style={{
                                              flex: 1,
                                              border: 'none',
                                              borderRight: isLast ? 'none' : '1.5px solid var(--border-color)',
                                              backgroundColor: isActive ? item.activeBg : 'var(--bg-primary)',
                                              color: isActive ? '#ffffff' : 'var(--text-secondary)',
                                              padding: '0.55rem 0.25rem',
                                              fontSize: '0.74rem',
                                              fontWeight: isActive ? 800 : 500,
                                              cursor: 'pointer',
                                              transition: 'all var(--transition-fast)',
                                              outline: 'none',
                                              whiteSpace: 'nowrap',
                                              display: 'inline-flex',
                                              alignItems: 'center',
                                              justifyContent: 'center'
                                            }}
                                          >
                                            {item.label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>

                              </div>

                            </div>
                          </div>
                          </td>
                        </tr>
                    )}</React.Fragment>
                )
              })}
              {filteredDispatches.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                    검색 조건 또는 날짜 필터에 부합하는 운행 내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


            </>
          )}      </Card>
    </div>
  )}


  {/* Floating toggle button for history panel */}
  {!showHistoryPanel && (
    <button
      type="button"
      onClick={() => setShowHistoryPanel(true)}
      style={{
        position: 'fixed',
        right: 0,
        top: '55%',
        transform: 'translateY(-50%)',
        zIndex: 99,
        backgroundColor: 'var(--primary)',
        color: '#ffffff',
        border: 'none',
        borderTopLeftRadius: 'var(--radius-md)',
        borderBottomLeftRadius: 'var(--radius-md)',
        padding: '1.2rem 0.65rem',
        fontSize: '0.85rem',
        fontWeight: 700,
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        transition: 'all var(--transition-fast)'
      }}
    >
      <Route size={16} style={{ transform: 'rotate(90deg)' }} /> 운행 내역 펼치기
    </button>
  )}

  {/* Major Location List Modal Popup */}
  {activeLocationListField && window.innerWidth <= 768 && (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="animate-fade-slide-up" style={{
        width: '90%',
        maxWidth: '750px',
        height: '80vh',
        maxHeight: '750px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-2xl)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '4px', height: '14px', backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-sm)' }}></span>
            주요 상하차지 추천 목록
          </h4>
          <Button 
            variant="outline" 
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
            onClick={() => setActiveLocationListField(null)}
          >
            닫기
          </Button>
        </div>
        <div style={{ flex: 1, overflow: 'hidden', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            {formData.clientName.trim() 
              ? `[${formData.clientName}] 거래처의 주요 상하차지 추천 주소 목록입니다.`
              : '그동안 등록된 이력을 기반으로 가장 많이 쓰인 상하차지 목록입니다.'}
          </span>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr 1fr', gap: '0.75rem', flex: 1, overflow: 'hidden' }}>
            
            {/* 1. 주요 구간 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderLeft: '3.5px solid #8b5cf6', borderRadius: 'var(--radius-md)', padding: '0.65rem 0.75rem', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem', marginBottom: '0.15rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>⚡ 운행데이터기반 주요구간 (상하차 동시선택)</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {(() => {
                    const routeCounts: Record<string, number> = {};
                    historyPool.forEach(item => {
                      if (item.origin && item.destination) {
                        const key = `${item.origin} === ${item.destination}`;
                        routeCounts[key] = (routeCounts[key] || 0) + 1;
                      }
                    });
                    const topRoutes = Object.entries(routeCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([key]) => {
                      const [origin, destination] = key.split(' === ');
                      return { origin, destination };
                    });
                    return topRoutes.map((route: { origin: string, destination: string }, idx: number) => {
                      const isSelected = formData.origin === route.origin && formData.destination === route.destination;
                      return (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0.75rem', backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, origin: route.origin, destination: route.destination }))
                            setErrors(prev => ({ ...prev, origin: false, destination: false }))
                            setActiveLocationListField(null)
                            triggerNotification(`주요 구간이 선택되었습니다: ${route.origin.split(' ').slice(0, 2).join(' ')} → ${route.destination.split(' ').slice(0, 2).join(' ')}`)
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '85%' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '18px', height: '18px', fontSize: '0.68rem', fontWeight: 800, padding: '0.1rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '50%' }}>{idx + 1}</span>
                            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              {route.origin.split(' ').slice(0, 2).join(' ')} <span style={{ color: '#8b5cf6', fontWeight: 800 }}>&rarr;</span> {route.destination.split(' ').slice(0, 2).join(' ')}
                            </div>
                          </div>
                          <Button variant="secondary" style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}>선택</Button>
                        </div>
                      )
                    })
                  })()}
                </div>
              </div>
            </div>

            {/* 2. 주요 상차지 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderLeft: '3.5px solid var(--primary)', borderRadius: 'var(--radius-md)', padding: '0.65rem 0.75rem', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem', marginBottom: '0.15rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>📍 거래처관리 저장기반 주요상차지</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {(() => {
                    const clientName = formData.clientName.trim()
                    let list: string[] = []
                    if (clientName) {
                      const matched = clients.find(c => c.name === clientName)
                      if (matched) list = matched.origins || []
                    }
                    if (list.length === 0) {
                      const counts: Record<string, number> = {};
                      historyPool.forEach(item => {
                        if (item.origin) counts[item.origin] = (counts[item.origin] || 0) + 1
                      })
                      list = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([address]) => address)
                    }
                    return list.map((loc: string, idx: number) => {
                      const isSelected = formData.origin === loc
                      return (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0.75rem', backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, origin: loc }))
                            setErrors(prev => ({ ...prev, origin: false }))
                            setActiveLocationListField(null)
                            triggerNotification(`상차지가 선택되었습니다: ${loc}`)
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '85%' }}>
                            <Badge color="primary">{idx + 1}</Badge>
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{loc}</span>
                          </div>
                          <Button variant="secondary" style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}>선택</Button>
                        </div>
                      )
                    })
                  })()}
                </div>
              </div>
            </div>

            {/* 3. 주요 하차지 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderLeft: '3.5px solid var(--success)', borderRadius: 'var(--radius-md)', padding: '0.65rem 0.75rem', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem', marginBottom: '0.15rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>🏁 거래처관리 저장기반 주요하차지</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {(() => {
                    const clientName = formData.clientName.trim()
                    let list: string[] = []
                    if (clientName) {
                      const matched = clients.find(c => c.name === clientName)
                      if (matched) list = matched.destinations || []
                    }
                    if (list.length === 0) {
                      const counts: Record<string, number> = {};
                      historyPool.forEach(item => {
                        if (item.destination) counts[item.destination] = (counts[item.destination] || 0) + 1
                      })
                      list = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([address]) => address)
                    }
                    return list.map((loc: string, idx: number) => {
                      const isSelected = formData.destination === loc
                      return (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0.75rem', backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, destination: loc }))
                            setErrors(prev => ({ ...prev, destination: false }))
                            setActiveLocationListField(null)
                            triggerNotification(`하차지가 선택되었습니다: ${loc}`)
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '85%' }}>
                            <Badge color="success">{idx + 1}</Badge>
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{loc}</span>
                          </div>
                          <Button variant="secondary" style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}>선택</Button>
                        </div>
                      )
                    })
                  })()}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )}
    </div>
  )
}
