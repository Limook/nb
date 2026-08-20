import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import type { Dispatch, Client, KeyboardStep, FormDataState, DispatchStatus } from '../types';
import { tonnages, carTypes } from '../constants';

export interface UseDispatchKeyboardProps {
  clients: Client[];
  dispatches: Dispatch[];
  setDispatches: React.Dispatch<React.SetStateAction<Dispatch[]>>;
  historyPool: any[];
  setHistoryPool: React.Dispatch<React.SetStateAction<any[]>>;
  triggerNotification: (msg: string) => void;
  registerMode: 'normal' | 'keyboard';
}

export const formatPhone = (val: string) => {
  const digits = val.replace(/\D/g, '');
  if (digits.startsWith('02')) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`.replace('-\?', '-');
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  } else {
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length <= 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }
};

export const getLocalDateTimeString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const getInitialDates = () => {
  const now = new Date();
  const originDate = getLocalDateTimeString(now);
  const destinationDate = getLocalDateTimeString(new Date(now.getTime() + 4 * 60 * 60 * 1000));
  return { originDate, destinationDate };
};

export const getEndOfCurrentMonth = () => {
  const d = new Date();
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const yyyy = lastDay.getFullYear();
  const mm = String(lastDay.getMonth() + 1).padStart(2, '0');
  const dd = String(lastDay.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const getEndOfNextMonth = () => {
  const d = new Date();
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 2, 0);
  const yyyy = lastDay.getFullYear();
  const mm = String(lastDay.getMonth() + 1).padStart(2, '0');
  const dd = String(lastDay.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const getShortcutDateValue = (shortcut: string) => {
  const now = new Date();
  const targetDate = new Date();
  if (shortcut === '지금') {
    return getLocalDateTimeString(now);
  }
  if (shortcut === '오늘') {
    targetDate.setHours(12, 0, 0, 0);
  } else if (shortcut === '내일') {
    targetDate.setDate(now.getDate() + 1);
    targetDate.setHours(12, 0, 0, 0);
  } else if (shortcut === '월요일') {
    const day = now.getDay();
    const distance = (8 - day) % 7 || 7;
    targetDate.setDate(now.getDate() + distance);
    targetDate.setHours(12, 0, 0, 0);
  } else {
    const hourMatch = shortcut.match(/(\d+)시간뒤/);
    if (hourMatch) {
      const hours = parseInt(hourMatch[1], 10);
      targetDate.setHours(now.getHours() + hours);
    }
  }
  return getLocalDateTimeString(targetDate);
};

const parseKoreanTime = (timeStr: string): string | null => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const datePrefix = `${yyyy}-${mm}-${dd}`;
  const clean = timeStr.trim();

  const kornTimeRegex = /^(오전|오후)?\s*(\d+)\s*시\s*(?:(\d+)\s*분?)?$/;
  const matchKorn = clean.match(kornTimeRegex);
  if (matchKorn) {
    const meridiem = matchKorn[1];
    let hour = parseInt(matchKorn[2], 10);
    const min = matchKorn[3] ? parseInt(matchKorn[3], 10) : 0;
    if (meridiem === '오후' && hour < 12) {
      hour += 12;
    } else if (meridiem === '오전' && hour === 12) {
      hour = 0;
    }
    const hhStr = String(hour).padStart(2, '0');
    const mmStr = String(min).padStart(2, '0');
    return `${datePrefix}T${hhStr}:${mmStr}`;
  }

  const hourOnlyRegex = /^(\d+)\s*시$/;
  const matchHour = clean.match(hourOnlyRegex);
  if (matchHour) {
    const hour = parseInt(matchHour[1], 10);
    if (hour >= 0 && hour <= 23) {
      const hhStr = String(hour).padStart(2, '0');
      return `${datePrefix}T${hhStr}:00`;
    }
  }

  const colonRegex = /^(\d{1,2}):(\d{2})$/;
  const matchColon = clean.match(colonRegex);
  if (matchColon) {
    const hour = parseInt(matchColon[1], 10);
    const min = parseInt(matchColon[2], 10);
    if (hour >= 0 && hour <= 23 && min >= 0 && min <= 59) {
      const hhStr = String(hour).padStart(2, '0');
      const mmStr = String(min).padStart(2, '0');
      return `${datePrefix}T${hhStr}:${mmStr}`;
    }
  }
  return null;
};

export const useDispatchKeyboard = ({
  clients,
  dispatches,
  setDispatches,
  historyPool,
  setHistoryPool,
  triggerNotification,
  registerMode
}: UseDispatchKeyboardProps) => {
  const dates = getInitialDates();
  const [formData, setFormData] = useState<FormDataState>({
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
    settleMethod: '인수증',
    fee: '',
    commission: '',
    settleDate: '',
    cargoItem: '',
    memo: ''
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [showWaypoints, setShowWaypoints] = useState<boolean>(false);
  const [keyboardStep, setKeyboardStep] = useState<number>(0);
  const [keyboardInputValue, setKeyboardInputValue] = useState<string>('');
  const [keyboardShortcutHighlightIndex, setKeyboardShortcutHighlightIndex] = useState<number>(-1);
  const [dateDisplayLabels, setDateDisplayLabels] = useState<{ originDate?: string; destinationDate?: string }>({});
  const [activeLocationListField, setActiveLocationListField] = useState<'origin' | 'destination' | 'both' | null>(null);
  
  // Juso search states
  const [jusoResults, setJusoResults] = useState<any[]>([]);
  const [isSearchingJuso, setIsSearchingJuso] = useState<boolean>(false);
  const [searchJusoError, setSearchJusoError] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const lastStepTimeRef = useRef<number>(0);

  useEffect(() => {
    setKeyboardShortcutHighlightIndex(-1);
  }, [keyboardStep, registerMode]);

  const keyboardSteps = useMemo<KeyboardStep[]>(() => [
    { name: '거래처명', field: 'clientName', guide: '거래처명을 입력하세요 (또는 우측 거래처 번호 입력)', optional: true, defaultValue: '일반화주' },
    { name: '상차지', field: 'origin', guide: '상차지 주소를 입력하세요 (또는 우측 최근 주소 번호 입력)', optional: false, defaultValue: '' },
    { name: '상차일시', field: 'originDate', guide: '상차일시를 입력하세요 (또는 우측 번호 입력, 예: YYYY-MM-DD 09:00 - 경유지 입력 시 Shift+Enter 입력)', optional: true, defaultValue: '' },
    ...(showWaypoints ? [
      { name: '경유지 1', field: 'waypoint_0', guide: '첫 번째 경유지 주소를 입력하세요 (없으면 엔터)', optional: true, defaultValue: '' },
      { name: '경유지 2', field: 'waypoint_1', guide: '두 번째 경유지 주소를 입력하세요 (없으면 엔터)', optional: true, defaultValue: '' },
      { name: '경유지 3', field: 'waypoint_2', guide: '세 번째 경유지 주소를 입력하세요 (없으면 엔터)', optional: true, defaultValue: '' }
    ] : []),
    { name: '하차지', field: 'destination', guide: '하차지 주소를 입력하세요 (또는 우측 최근 주소 번호 입력)', optional: false, defaultValue: '' },
    { name: '하차일시', field: 'destinationDate', guide: '하차일시를 입력하세요 (또는 우측 번호 입력, 예: YYYY-MM-DD 17:00)', optional: true, defaultValue: '' },
    { name: '차량톤수', field: 'tonnage', guide: '차량톤수를 선택하세요 (우측 단축키 슬롯 번호 입력)', optional: false, defaultValue: '' },
    { name: '차종', field: 'carType', guide: '차종을 선택하세요 (우측 단축키 슬롯 번호 입력)', optional: false, defaultValue: '' },
    { name: '중량', field: 'weight', guide: '중량을 입력하세요 (우측 번호 입력, 예: 5톤 또는 5T - 생략 시 0 입력)', optional: true, defaultValue: '0톤 (스킵)' },
    { name: '정산방법', field: 'settleMethod', guide: '정산방법을 선택하세요 (1: 인수증, 2: 선불, 3: 착불, 4: 카드)', optional: false, defaultValue: '인수증' },
    ...(formData.settleMethod !== '인수증' ? [
      { name: '수수료', field: 'commission', guide: '수수료 금액을 입력하세요 (없으면 0 입력)', optional: true, defaultValue: '' }
    ] : []),
    { name: '운임', field: 'fee', guide: '운임을 입력하세요 (숫자만 입력 또는 우측 추천 운임 번호 입력)', optional: false, defaultValue: '' },
    { name: '청구일자', field: 'settleDate', guide: '정산 청구(수금) 예정일을 입력하세요 (또는 우측 번호 입력)', optional: true, defaultValue: '' },
    { name: '화물품목', field: 'cargoItem', guide: '화물품목을 입력하세요 (또는 우측 번호 입력)', optional: false, defaultValue: '' },
    { name: '메모', field: 'memo', guide: '메모를 입력하세요 (없으면 엔터)', optional: true, defaultValue: '' },
    { name: '최종확인', field: 'confirm', guide: '입력 내용을 확인하고 Enter를 누르면 등록됩니다.', optional: true, defaultValue: '' }
  ], [showWaypoints, formData.settleMethod, formData.waypoints]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(keyboardInputValue);
    }, 250);
    return () => clearTimeout(handler);
  }, [keyboardInputValue]);

  useEffect(() => {
    setDebouncedSearchQuery(keyboardInputValue);
    setJusoResults([]);
    setSearchJusoError('');
  }, [keyboardStep]);

  useEffect(() => {
    const currentStepObj = keyboardSteps[keyboardStep];
    const field = currentStepObj ? currentStepObj.field : '';
    const isAddr = field === 'origin' || field === 'destination' || field.startsWith('waypoint_');

    if (!isAddr || debouncedSearchQuery.trim().length < 2) {
      setJusoResults([]);
      setIsSearchingJuso(false);
      setSearchJusoError('');
      return;
    }

    setIsSearchingJuso(true);
    setSearchJusoError('');

    const callbackName = `jusoCallback_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    const cleanup = () => {
      delete (window as any)[callbackName];
      const script = document.getElementById(callbackName);
      if (script) script.remove();
    };

    (window as any)[callbackName] = (data: any) => {
      cleanup();
      setIsSearchingJuso(false);
      const errCode = data?.results?.common?.errorCode;
      const errMsg = data?.results?.common?.errorMessage;
      if (errCode === '0') {
        setJusoResults(data?.results?.juso || []);
      } else {
        if (errCode === 'E0006') {
          setJusoResults([]);
        } else {
          setSearchJusoError(errMsg || '검색 중 오류가 발생했습니다.');
          setJusoResults([]);
        }
      }
    };

    const script = document.createElement('script');
    script.id = callbackName;
    const confmKey = import.meta.env.VITE_JUSO_CONFIRM_KEY || 'TESTJUSOGOKR';
    script.src = `https://business.juso.go.kr/addrlink/addrLinkApiJsonp.do?confmKey=${confmKey}&keyword=${encodeURIComponent(debouncedSearchQuery.trim())}&resultType=json&callback=${callbackName}`;
    script.async = true;
    script.onerror = () => {
      cleanup();
      setIsSearchingJuso(false);
      setSearchJusoError('네트워크 오류가 발생했습니다.');
    };

    document.body.appendChild(script);

    return () => {
      cleanup();
    };
  }, [debouncedSearchQuery, keyboardStep, keyboardSteps]);

  const isAddressField = useCallback((stepIdx: number) => {
    if (stepIdx < 0 || stepIdx >= keyboardSteps.length) return false;
    const f = keyboardSteps[stepIdx].field;
    return f === 'origin' || f === 'destination' || f.startsWith('waypoint_');
  }, [keyboardSteps]);

  const getShortcutsData = useCallback((stepField: string): any[] => {
    if (stepField === 'clientName') {
      const query = keyboardInputValue.trim();
      if (!query) {
        return clients;
      }
      return clients.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
    }
    if (stepField === 'origin' || stepField.startsWith('waypoint_')) {
      return Array.from(new Set([
        ...dispatches.map(d => d.origin),
        ...dispatches.map(d => d.destination),
        ...(dispatches.flatMap(d => d.waypoints || []))
      ])).filter(Boolean).slice(0, 6);
    }
    if (stepField === 'originDate') {
      return ['지금', '오늘', '내일', '월요일', '1시간뒤', '2시간뒤', '3시간뒤'];
    }
    if (stepField === 'destination') {
      return Array.from(new Set(dispatches.map(d => d.destination))).slice(0, 6);
    }
    if (stepField === 'destinationDate') {
      return ['오늘', '내일', '월요일', '3시간뒤', '4시간뒤', '5시간뒤', '6시간뒤'];
    }
    if (stepField === 'tonnage') {
      return tonnages;
    }
    if (stepField === 'carType') {
      return carTypes;
    }
    if (stepField === 'weight') {
      return ['0톤 (스킵)', '1톤', '5톤', '8톤', '10톤', '15톤', '20톤', '25톤'];
    }
    if (stepField === 'settleMethod') {
      return ['인수증', '선불', '착불', '카드'];
    }
    if (stepField === 'settleDate') {
      return ['당월말', '익월말'];
    }
    if (stepField === 'commission') {
      return ['수수료 없음 (0원)', '10,000원', '20,000원', '30,000원', '50,000원'];
    }
    if (stepField === 'fee') {
      return ['100,000원', '150,000원', '200,000원', '250,000원', '300,000원', '350,000원', '400,000원'];
    }
    if (stepField === 'cargoItem') {
      const selectedClient = clients.find(c => c.name.trim() === formData.clientName.trim());
      const clientItems = selectedClient && selectedClient.items ? selectedClient.items : [];
      if (clientItems.length > 0) {
        const merged = [...clientItems];
        const defaults = ['일반화물', '철강', '기계부품', '박스화물', '화학제품', '목재'];
        for (const d of defaults) {
          if (merged.length >= 6) break;
          if (!merged.includes(d)) merged.push(d);
        }
        return merged;
      }
      return ['일반화물', '철강', '기계부품', '박스화물', '화학제품', '목재'];
    }
    if (stepField === 'memo') {
      return [
        '안전운전 부탁드립니다.',
        '상하차지 대기 시간 발생 시 연락 필수.',
        '수수료 세금계산서 발행 요망.',
        '인수증 빠른 우편 발송 필요.'
      ];
    }
    return [];
  }, [clients, dispatches, formData.clientName, keyboardInputValue]);

  const handleResetForm = useCallback(() => {
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
    });
    setErrors({});
    setActiveLocationListField(null);
    setDateDisplayLabels({});
  }, []);

  const handleDispatchSubmit = useCallback((e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const requiredFields = {
      origin: '상차지',
      destination: '하차지',
      tonnage: '톤급',
      carType: '차종',
      fee: '운임'
    };
    const missingFields: string[] = [];
    const newErrors: Record<string, boolean> = {};

    Object.entries(requiredFields).forEach(([field, label]) => {
      const val = formData[field as keyof typeof formData];
      if (typeof val === 'string' && !val.trim()) {
        missingFields.push(label);
        newErrors[field] = true;
      }
    });

    if (missingFields.length > 0) {
      setErrors(newErrors);
      alert(`필수 입력 값이 누락되었습니다:\n- ${missingFields.join('\n- ')}`);
      return;
    }

    const newId = dispatches.length > 0 ? Math.max(...dispatches.map(d => d.id)) + 1 : 1;
    const registeredDispatch: Dispatch = {
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
    };

    setDispatches(prev => [registeredDispatch, ...prev]);

    const poolItem = {
      client: formData.clientName.trim() || '일반화주',
      origin: formData.origin,
      destination: formData.destination,
      tonnage: formData.tonnage,
      carType: formData.carType,
      weight: formData.weight || '0T',
      fee: Number(formData.fee.replace(/,/g, '')),
      date: new Date().toISOString()
    };
    setHistoryPool(prev => [poolItem, ...prev]);
    triggerNotification('배차가 성공적으로 등록되었습니다!');
    handleResetForm();
  }, [formData, dispatches, setDispatches, setHistoryPool, triggerNotification, handleResetForm]);

  const handleSelectShortcutByIndex = useCallback((idx: number, isShiftPressed = false) => {
    const currentStepObj = keyboardSteps[keyboardStep];
    if (!currentStepObj) return;
    const field = currentStepObj.field;
    let resolvedValue = '';

    if (field === 'clientName') {
      const shortcuts = getShortcutsData('clientName');
      const client = shortcuts[idx];
      if (client) {
        setFormData(prev => ({
          ...prev,
          clientName: client.name,
          clientPhone: client.phone || '',
          clientContact: client.contactName || ''
        }));
        resolvedValue = client.name;
      }
    } else if (field === 'origin') {
      if (jusoResults && jusoResults.length > 0) {
        const selected = jusoResults[idx]?.roadAddr;
        if (selected) {
          setFormData(prev => ({ ...prev, origin: selected }));
          resolvedValue = selected;
        }
      } else {
        const recentOrigins = Array.from(new Set(dispatches.map(d => d.origin))).slice(0, 6);
        const selected = recentOrigins[idx];
        if (selected) {
          setFormData(prev => ({ ...prev, origin: selected }));
          resolvedValue = selected;
        }
      }
    } else if (field === 'originDate') {
      const shortcuts = ['지금', '오늘', '내일', '월요일', '1시간뒤', '2시간뒤', '3시간뒤'];
      const selected = shortcuts[idx];
      if (selected) {
        const dateStr = getShortcutDateValue(selected);
        setFormData(prev => ({ ...prev, originDate: dateStr }));
        resolvedValue = dateStr;
        if (['지금', '오늘', '내일', '월요일'].includes(selected)) {
          setDateDisplayLabels(prev => ({ ...prev, originDate: selected }));
        } else {
          setDateDisplayLabels(prev => ({ ...prev, originDate: undefined }));
        }
      }
    } else if (field.startsWith('waypoint_')) {
      const wIdx = parseInt(field.split('_')[1], 10);
      if (jusoResults && jusoResults.length > 0) {
        const selected = jusoResults[idx]?.roadAddr;
        if (selected) {
          setFormData(prev => {
            const wps = [...(prev.waypoints || [])];
            wps[wIdx] = selected;
            return { ...prev, waypoints: wps };
          });
          resolvedValue = selected;
        }
      } else {
        const recentLocations = Array.from(new Set([
          ...dispatches.map(d => d.origin),
          ...dispatches.map(d => d.destination),
          ...(dispatches.flatMap(d => d.waypoints || []))
        ])).filter(Boolean).slice(0, 6);
        const selected = recentLocations[idx];
        if (selected) {
          setFormData(prev => {
            const wps = [...(prev.waypoints || [])];
            wps[wIdx] = selected;
            return { ...prev, waypoints: wps };
          });
          resolvedValue = selected;
        }
      }
    } else if (field === 'destination') {
      if (jusoResults && jusoResults.length > 0) {
        const selected = jusoResults[idx]?.roadAddr;
        if (selected) {
          setFormData(prev => ({ ...prev, destination: selected }));
          resolvedValue = selected;
        }
      } else {
        const recentDests = Array.from(new Set(dispatches.map(d => d.destination))).slice(0, 6);
        const selected = recentDests[idx];
        if (selected) {
          setFormData(prev => ({ ...prev, destination: selected }));
          resolvedValue = selected;
        }
      }
    } else if (field === 'destinationDate') {
      const shortcuts = ['오늘', '내일', '월요일', '3시간뒤', '4시간뒤', '5시간뒤', '6시간뒤'];
      const selected = shortcuts[idx];
      if (selected) {
        const dateStr = getShortcutDateValue(selected);
        setFormData(prev => ({ ...prev, destinationDate: dateStr }));
        resolvedValue = dateStr;
        if (['오늘', '내일', '월요일'].includes(selected)) {
          setDateDisplayLabels(prev => ({ ...prev, destinationDate: selected }));
        } else {
          setDateDisplayLabels(prev => ({ ...prev, destinationDate: undefined }));
        }
      }
    } else if (field === 'tonnage') {
      const selected = tonnages[idx];
      if (selected) {
        setFormData(prev => ({ ...prev, tonnage: selected }));
        resolvedValue = selected;
      }
    } else if (field === 'carType') {
      const selected = carTypes[idx];
      if (selected) {
        setFormData(prev => ({ ...prev, carType: selected }));
        resolvedValue = selected;
      }
    } else if (field === 'weight') {
      const weights = ['0톤 (스킵)', '1톤', '5톤', '8톤', '10톤', '15톤', '20톤', '25톤'];
      const selected = weights[idx];
      if (selected) {
        setFormData(prev => ({ ...prev, weight: selected }));
        resolvedValue = selected;
      }
    } else if (field === 'settleMethod') {
      const methods = ['인수증', '선불', '착불', '카드'];
      const selected = methods[idx];
      if (selected) {
        setFormData(prev => ({ ...prev, settleMethod: selected }));
        resolvedValue = selected;
      }
    } else if (field === 'settleDate') {
      if (idx === 0) {
        const date = getEndOfCurrentMonth();
        setFormData(prev => ({ ...prev, settleDate: date }));
        resolvedValue = date;
      } else if (idx === 1) {
        const date = getEndOfNextMonth();
        setFormData(prev => ({ ...prev, settleDate: date }));
        resolvedValue = date;
      }
    } else if (field === 'commission') {
      const comms = ['0', '10000', '20000', '30000', '50000'];
      const selected = comms[idx];
      if (selected) {
        const formatted = Number(selected).toLocaleString();
        setFormData(prev => ({ ...prev, commission: formatted }));
        resolvedValue = formatted;
      }
    } else if (field === 'fee') {
      const commonFees = [100000, 150000, 200000, 250000, 300000, 350000, 400000];
      const selected = commonFees[idx];
      if (selected) {
        const formatted = selected.toLocaleString();
        setFormData(prev => ({ ...prev, fee: formatted }));
        resolvedValue = formatted;
      }
    } else if (field === 'cargoItem') {
      const items = getShortcutsData('cargoItem');
      const selected = items[idx];
      if (selected) {
        setFormData(prev => ({ ...prev, cargoItem: selected }));
        resolvedValue = selected;
      }
    } else if (field === 'memo') {
      const memos = [
        '안전운전 부탁드립니다.',
        '상하차지 대기 시간 발생 시 연락 필수.',
        '수수료 세금계산서 발행 요망.',
        '인수증 빠른 우편 발송 필요.'
      ];
      const selected = memos[idx];
      if (selected) {
        setFormData(prev => ({ ...prev, memo: selected }));
        resolvedValue = selected;
      }
    }

    if (!resolvedValue) return;

    if (field === 'originDate') {
      if (isShiftPressed) {
        setShowWaypoints(true);
      } else {
        setShowWaypoints(false);
        setFormData(prev => ({ ...prev, waypoints: [] }));
      }
    }

    if (keyboardStep === keyboardSteps.length - 1) {
      const newId = dispatches.length > 0 ? Math.max(...dispatches.map(d => d.id)) + 1 : 1;
      let finalTonnage = formData.tonnage;
      let finalCarType = formData.carType;
      if (field === 'tonnage') finalTonnage = resolvedValue;
      if (field === 'carType') finalCarType = resolvedValue;
      let finalClient = formData.clientName.trim();
      if (field === 'clientName') finalClient = resolvedValue;
      if (!finalClient) finalClient = '일반화주';
      let finalOrigin = formData.origin;
      if (field === 'origin') finalOrigin = resolvedValue;
      let finalDest = formData.destination;
      if (field === 'destination') finalDest = resolvedValue;
      let finalFeeStr = formData.fee;
      if (field === 'fee') finalFeeStr = resolvedValue;
      const finalFee = Number(finalFeeStr.replace(/,/g, '')) || 0;
      let finalSettleMethod = formData.settleMethod;
      if (field === 'settleMethod') finalSettleMethod = resolvedValue;
      let finalCommissionStr = formData.commission;
      if (field === 'commission') finalCommissionStr = resolvedValue;
      const finalCommission = finalCommissionStr.replace(/,/g, '');
      let finalSettleDate = formData.settleDate;
      if (field === 'settleDate') finalSettleDate = resolvedValue;
      let finalCargoItem = formData.cargoItem;
      if (field === 'cargoItem') finalCargoItem = resolvedValue;
      let finalMemo = formData.memo;
      if (field === 'memo') finalMemo = resolvedValue;

      const registeredDispatch: Dispatch = {
        id: newId,
        client: finalClient,
        origin: finalOrigin,
        originDate: formData.originDate,
        destination: finalDest,
        destinationDate: formData.destinationDate,
        waypoints: (formData.waypoints || []).filter((w: string) => w.trim() !== ''),
        spec: `${finalTonnage} ${finalCarType} ${formData.weight ? `(${formData.weight})` : ''}`.trim(),
        status: 'dispatching' as DispatchStatus,
        fee: finalFee,
        originalFee: finalFee,
        settleMethod: finalSettleMethod,
        commission: finalCommission,
        settleDate: finalSettleDate,
        cargoItem: finalCargoItem,
        memo: finalMemo,
        date: new Date().toISOString(),
        driverName: '',
        driverPhone: '',
        carNumber: ''
      };
      setDispatches(prev => [registeredDispatch, ...prev]);

      const poolItem = {
        client: finalClient,
        origin: finalOrigin,
        destination: finalDest,
        tonnage: finalTonnage,
        carType: finalCarType,
        weight: formData.weight || '0T',
        fee: finalFee,
        date: new Date().toISOString()
      };
      setHistoryPool(prev => [poolItem, ...prev]);
      triggerNotification('배차가 성공적으로 등록되었습니다!');
      lastStepTimeRef.current = Date.now();
      setKeyboardStep(0);
      setKeyboardInputValue('');
      setShowWaypoints(false);
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
      });
      setErrors({});
      setDateDisplayLabels({});
    } else {
      lastStepTimeRef.current = Date.now();
      let nextStep = keyboardStep + 1;
      
      const currentStepObj = keyboardSteps[keyboardStep];
      if (currentStepObj.field === 'waypoint_0') {
        if (isShiftPressed) {
          nextStep = keyboardSteps.findIndex(s => s.field === 'waypoint_1');
        } else {
          nextStep = keyboardSteps.findIndex(s => s.field === 'destination');
        }
      } else if (currentStepObj.field === 'waypoint_1') {
        if (isShiftPressed) {
          nextStep = keyboardSteps.findIndex(s => s.field === 'waypoint_2');
        } else {
          nextStep = keyboardSteps.findIndex(s => s.field === 'destination');
        }
      } else if (currentStepObj.field === 'waypoint_2') {
        nextStep = keyboardSteps.findIndex(s => s.field === 'destination');
      }

      const nextStepObj = keyboardSteps[nextStep];
      if (nextStepObj && nextStepObj.field === 'commission' && formData.settleMethod === '인수증') {
        setFormData(prev => ({ ...prev, commission: '0' }));
        nextStep = keyboardSteps.findIndex(s => s.field === 'fee');
      }

      setKeyboardStep(nextStep);
      setKeyboardInputValue('');
      
      setTimeout(() => {
        const input = document.getElementById('keyboard-mode-input');
        if (input) input.focus();
      }, 50);
    }
  }, [keyboardStep, keyboardSteps, clients, dispatches, formData, setDispatches, setHistoryPool, triggerNotification, getShortcutsData, jusoResults]);

  const handleKeyboardStepEnter = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentStepObj = keyboardSteps[keyboardStep];
    if (!currentStepObj) return;
    const field = currentStepObj.field;

    if (field === 'confirm') {
      const newId = dispatches.length > 0 ? Math.max(...dispatches.map(d => d.id)) + 1 : 1;
      const finalFee = Number(formData.fee.replace(/,/g, '')) || 0;
      const finalClient = formData.clientName.trim() || '일반화주';
      
      const registeredDispatch: Dispatch = {
        id: newId,
        client: finalClient,
        origin: formData.origin,
        originDate: formData.originDate,
        destination: formData.destination,
        destinationDate: formData.destinationDate,
        waypoints: (formData.waypoints || []).filter((w: string) => w.trim() !== ''),
        spec: `${formData.tonnage} ${formData.carType} ${formData.weight ? `(${formData.weight})` : ''}`.trim(),
        status: 'dispatching' as DispatchStatus,
        fee: finalFee,
        originalFee: finalFee,
        settleMethod: formData.settleMethod,
        commission: formData.commission.replace(/,/g, ''),
        settleDate: formData.settleDate,
        cargoItem: formData.cargoItem,
        memo: formData.memo,
        date: new Date().toISOString(),
        driverName: '',
        driverPhone: '',
        carNumber: ''
      };
      
      const updatedDispatches = [registeredDispatch, ...dispatches];
      setDispatches(updatedDispatches);
      localStorage.setItem('dispatches', JSON.stringify(updatedDispatches));
      
      const poolItem = {
        client: finalClient,
        origin: formData.origin,
        destination: formData.destination,
        tonnage: formData.tonnage,
        carType: formData.carType,
        weight: formData.weight || '0T',
        fee: finalFee,
        date: new Date().toISOString()
      };
      setHistoryPool([poolItem, ...historyPool]);
      triggerNotification('배차가 성공적으로 등록되었습니다!');
      
      lastStepTimeRef.current = Date.now();
      setKeyboardStep(0);
      setKeyboardInputValue('');
      setShowWaypoints(false);
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
      });
      setErrors({});
      setDateDisplayLabels({});
      return;
    }

    const isAddr = field === 'origin' || field === 'destination' || field.startsWith('waypoint_');

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const items = (isAddr && jusoResults && jusoResults.length > 0) ? jusoResults : getShortcutsData(field);
      if (items.length > 0) {
        e.preventDefault();
        setKeyboardShortcutHighlightIndex(prev => {
          if (e.key === 'ArrowDown') {
            return prev < items.length - 1 ? prev + 1 : 0;
          } else {
            return prev > 0 ? prev - 1 : items.length - 1;
          }
        });
        return;
      }
    }

    if (e.key !== 'Enter') return;
    e.preventDefault();

    if (keyboardShortcutHighlightIndex >= 0) {
      handleSelectShortcutByIndex(keyboardShortcutHighlightIndex, e.shiftKey);
      return;
    }

    if (isAddr && jusoResults && jusoResults.length > 0) {
      handleSelectShortcutByIndex(0, e.shiftKey);
      return;
    }

    const val = keyboardInputValue.trim();
    
    if (field === 'originDate') {
      if (e.shiftKey) {
        setShowWaypoints(true);
      } else {
        setShowWaypoints(false);
        setFormData(prev => ({ ...prev, waypoints: [] }));
      }
    }

    let resolvedValue = val;
    const shortcutNum = parseInt(val, 10);
    if (!isNaN(shortcutNum) && shortcutNum > 0 && /^\d+$/.test(val)) {
      if (field === 'clientName') {
        if (shortcutNum <= 9) {
          const shortcuts = getShortcutsData('clientName');
          const client = shortcuts[shortcutNum - 1];
          if (client) {
            setFormData(prev => ({
              ...prev,
              clientName: client.name,
              clientPhone: client.phone || '',
              clientContact: client.contactName || ''
            }));
            resolvedValue = client.name;
          }
        }
      } else if (field === 'origin') {
        const recentOrigins = Array.from(new Set(dispatches.map(d => d.origin))).slice(0, 6);
        const selected = recentOrigins[shortcutNum - 1];
        if (selected) {
          setFormData(prev => ({ ...prev, origin: selected }));
          resolvedValue = selected;
        }
      } else if (field === 'originDate') {
        const shortcuts = ['지금', '오늘', '내일', '월요일', '1시간뒤', '2시간뒤', '3시간뒤'];
        const selected = shortcuts[shortcutNum - 1];
        if (selected) {
          const dateStr = getShortcutDateValue(selected);
          setFormData(prev => ({ ...prev, originDate: dateStr }));
          resolvedValue = dateStr;
          if (['지금', '오늘', '내일', '월요일'].includes(selected)) {
            setDateDisplayLabels(prev => ({ ...prev, originDate: selected }));
          } else {
            setDateDisplayLabels(prev => ({ ...prev, originDate: undefined }));
          }
        }
      } else if (field.startsWith('waypoint_')) {
        const wIdx = parseInt(field.split('_')[1], 10);
        const recentLocations = Array.from(new Set([
          ...dispatches.map(d => d.origin),
          ...dispatches.map(d => d.destination),
          ...(dispatches.flatMap(d => d.waypoints || []))
        ])).filter(Boolean).slice(0, 6);
        const selected = recentLocations[shortcutNum - 1];
        if (selected) {
          setFormData(prev => {
            const wps = [...(prev.waypoints || [])];
            wps[wIdx] = selected;
            return { ...prev, waypoints: wps };
          });
          resolvedValue = selected;
        }
      } else if (field === 'destination') {
        const recentDests = Array.from(new Set(dispatches.map(d => d.destination))).slice(0, 6);
        const selected = recentDests[shortcutNum - 1];
        if (selected) {
          setFormData(prev => ({ ...prev, destination: selected }));
          resolvedValue = selected;
        }
      } else if (field === 'destinationDate') {
        const shortcuts = ['오늘', '내일', '월요일', '3시간뒤', '4시간뒤', '5시간뒤', '6시간뒤'];
        const selected = shortcuts[shortcutNum - 1];
        if (selected) {
          const dateStr = getShortcutDateValue(selected);
          setFormData(prev => ({ ...prev, destinationDate: dateStr }));
          resolvedValue = dateStr;
          if (['오늘', '내일', '월요일'].includes(selected)) {
            setDateDisplayLabels(prev => ({ ...prev, destinationDate: selected }));
          } else {
            setDateDisplayLabels(prev => ({ ...prev, destinationDate: undefined }));
          }
        }
      } else if (field === 'tonnage') {
        const selected = tonnages[shortcutNum - 1];
        if (selected) {
          setFormData(prev => ({ ...prev, tonnage: selected }));
          resolvedValue = selected;
        }
      } else if (field === 'carType') {
        const selected = carTypes[shortcutNum - 1];
        if (selected) {
          setFormData(prev => ({ ...prev, carType: selected }));
          resolvedValue = selected;
        }
      } else if (field === 'weight') {
        const weights = ['0톤 (스킵)', '1톤', '5톤', '8톤', '10톤', '15톤', '20톤', '25톤'];
        const selected = weights[shortcutNum - 1];
        if (selected) {
          setFormData(prev => ({ ...prev, weight: selected }));
          resolvedValue = selected;
        }
      } else if (field === 'settleMethod') {
        const methods = ['인수증', '선불', '착불', '카드'];
        const selected = methods[shortcutNum - 1];
        if (selected) {
          setFormData(prev => ({ ...prev, settleMethod: selected }));
          resolvedValue = selected;
        }
      } else if (field === 'settleDate') {
        if (shortcutNum === 1) {
          const date = getEndOfCurrentMonth();
          setFormData(prev => ({ ...prev, settleDate: date }));
          resolvedValue = date;
        } else if (shortcutNum === 2) {
          const date = getEndOfNextMonth();
          setFormData(prev => ({ ...prev, settleDate: date }));
          resolvedValue = date;
        }
      } else if (field === 'commission') {
        const comms = ['0', '10000', '20000', '30000', '50000'];
        const selected = comms[shortcutNum - 1];
        if (selected) {
          const formatted = Number(selected).toLocaleString();
          setFormData(prev => ({ ...prev, commission: formatted }));
          resolvedValue = formatted;
        }
      } else if (field === 'fee') {
        const commonFees = [100000, 150000, 200000, 250000, 300000, 350000, 400000];
        const selected = commonFees[shortcutNum - 1];
        if (selected) {
          const formatted = selected.toLocaleString();
          setFormData(prev => ({ ...prev, fee: formatted }));
          resolvedValue = formatted;
        }
      } else if (field === 'cargoItem') {
        const items = getShortcutsData('cargoItem');
        const selected = items[shortcutNum - 1];
        if (selected) {
          setFormData(prev => ({ ...prev, cargoItem: selected }));
          resolvedValue = selected;
        }
      } else if (field === 'memo') {
        const memos = [
          '안전운전 부탁드립니다.',
          '상하차지 대기 시간 발생 시 연락 필수.',
          '수수료 세금계산서 발행 요망.',
          '인수증 빠른 우편 발송 필요.'
        ];
        const selected = memos[shortcutNum - 1];
        if (selected) {
          setFormData(prev => ({ ...prev, memo: selected }));
          resolvedValue = selected;
        }
      }
    }
    if (resolvedValue === val) {
      if (val === '') {
        if (!currentStepObj.optional) {
          alert(`'${currentStepObj.name}'은(는) 필수 입력 항목입니다.`);
          return;
        } else {
          let defVal = currentStepObj.defaultValue;
          if (field === 'originDate') defVal = getInitialDates().originDate;
          if (field === 'destinationDate') defVal = getInitialDates().destinationDate;
          if (field !== 'confirm') {
            if (field.startsWith('waypoint_')) {
              const wIdx = parseInt(field.split('_')[1], 10);
              setFormData(prev => {
                const wps = [...(prev.waypoints || [])];
                wps[wIdx] = defVal;
                return { ...prev, waypoints: wps };
              });
            } else {
              setFormData(prev => ({ ...prev, [field]: defVal }));
            }
          }
          resolvedValue = defVal;
        }
      } else {
        if (field === 'tonnage') {
          let resolvedTonnage = val;
          if (/^\d+(\.\d+)?$/.test(val)) {
            resolvedTonnage = `${val}톤`;
          }
          setFormData(prev => ({ ...prev, tonnage: resolvedTonnage }));
          resolvedValue = resolvedTonnage;
        } else if (field === 'carType') {
          setFormData(prev => ({ ...prev, carType: val }));
          resolvedValue = val;
        } else if (field === 'weight') {
          let resolvedWeight = val.replace(/T/gi, '톤');
          if (resolvedWeight && !resolvedWeight.includes('톤')) {
            resolvedWeight = `${resolvedWeight}톤`;
          }
          setFormData(prev => ({ ...prev, weight: resolvedWeight }));
          resolvedValue = resolvedWeight;
        } else if (field === 'fee' || field === 'commission') {
          const numeric = val.replace(/[^0-9]/g, '');
          const formatted = numeric ? Number(numeric).toLocaleString() : '';
          setFormData(prev => ({ ...prev, [field]: formatted }));
        } else if (field === 'originDate' || field === 'destinationDate') {
          if (['지금', '오늘', '내일', '월요일'].includes(val)) {
            const dateStr = getShortcutDateValue(val);
            setFormData(prev => ({ ...prev, [field]: dateStr }));
            resolvedValue = dateStr;
            setDateDisplayLabels(prev => ({ ...prev, [field]: val }));
          } else {
            setDateDisplayLabels(prev => ({ ...prev, [field]: undefined }));
            const parsedTime = parseKoreanTime(val);
            if (parsedTime) {
              setFormData(prev => ({ ...prev, [field]: parsedTime }));
              resolvedValue = parsedTime;
            } else {
              let cleanedDate = val.replace(' ', 'T');
              if (cleanedDate.length === 10) {
                cleanedDate += 'T12:00';
              }
              setFormData(prev => ({ ...prev, [field]: cleanedDate }));
              resolvedValue = cleanedDate;
            }
          }
        } else if (field.startsWith('waypoint_')) {
          const wIdx = parseInt(field.split('_')[1], 10);
          setFormData(prev => {
            const wps = [...(prev.waypoints || [])];
            wps[wIdx] = val;
            return { ...prev, waypoints: wps };
          });
        } else if (field !== 'confirm') {
          setFormData(prev => ({ ...prev, [field]: val }));
        }
      }
    }
    lastStepTimeRef.current = Date.now();
    let nextStep = keyboardStep + 1;
    
    if (currentStepObj.field === 'waypoint_0') {
      if (e.shiftKey) {
        nextStep = keyboardSteps.findIndex(s => s.field === 'waypoint_1');
      } else {
        nextStep = keyboardSteps.findIndex(s => s.field === 'destination');
      }
    } else if (currentStepObj.field === 'waypoint_1') {
      if (e.shiftKey) {
        nextStep = keyboardSteps.findIndex(s => s.field === 'waypoint_2');
      } else {
        nextStep = keyboardSteps.findIndex(s => s.field === 'destination');
      }
    } else if (currentStepObj.field === 'waypoint_2') {
      nextStep = keyboardSteps.findIndex(s => s.field === 'destination');
    }

    const nextStepObj = keyboardSteps[nextStep];
    if (nextStepObj && nextStepObj.field === 'commission' && formData.settleMethod === '인수증') {
      setFormData(prev => ({ ...prev, commission: '0' }));
      nextStep = keyboardSteps.findIndex(s => s.field === 'fee');
    }

    setKeyboardStep(nextStep);
    setKeyboardInputValue('');
    
    setTimeout(() => {
      const input = document.getElementById('keyboard-mode-input');
      if (input) input.focus();
    }, 50);
  }, [keyboardStep, keyboardSteps, clients, dispatches, formData, setDispatches, setHistoryPool, triggerNotification, handleSelectShortcutByIndex, getShortcutsData, keyboardShortcutHighlightIndex, keyboardInputValue, jusoResults, historyPool]);

  const handleKeyboardInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && e.shiftKey && keyboardInputValue === '') {
      const now = Date.now();
      if (now - lastStepTimeRef.current < 450) {
        e.preventDefault();
        return;
      }
      if (keyboardStep > 0) {
        e.preventDefault();
        lastStepTimeRef.current = now;
        let prevStep = keyboardStep - 1;
        
        const currentStepObj = keyboardSteps[keyboardStep];
        if (currentStepObj.field === 'destination') {
          if (!showWaypoints) {
            prevStep = keyboardSteps.findIndex(s => s.field === 'originDate');
          } else {
            if (formData.waypoints && formData.waypoints[2]) {
              prevStep = keyboardSteps.findIndex(s => s.field === 'waypoint_2');
            } else if (formData.waypoints && formData.waypoints[1]) {
              prevStep = keyboardSteps.findIndex(s => s.field === 'waypoint_1');
            } else {
              prevStep = keyboardSteps.findIndex(s => s.field === 'waypoint_0');
            }
          }
        } else if (currentStepObj.field === 'waypoint_2') {
          prevStep = keyboardSteps.findIndex(s => s.field === 'waypoint_1');
        } else if (currentStepObj.field === 'waypoint_1') {
          prevStep = keyboardSteps.findIndex(s => s.field === 'waypoint_0');
        }
        
        setKeyboardStep(prevStep);
      }
    }
  }, [keyboardStep, keyboardInputValue, showWaypoints, formData.waypoints, formData.settleMethod, keyboardSteps]);

  const getStepValueString = useCallback((field: string) => {
    if (field === 'tonnage') {
      return formData.tonnage || '';
    }
    if (field === 'carType') {
      return formData.carType || '';
    }
    if (field.startsWith('waypoint_')) {
      const wIdx = parseInt(field.split('_')[1], 10);
      return (formData.waypoints && formData.waypoints[wIdx]) || '';
    }
    if (field === 'originDate' || field === 'destinationDate') {
      if (dateDisplayLabels[field as 'originDate' | 'destinationDate']) {
        return dateDisplayLabels[field as 'originDate' | 'destinationDate']!;
      }
      const val = formData[field as keyof typeof formData];
      return typeof val === 'string' ? val.replace('T', ' ') : '';
    }
    if (field === 'fee' || field === 'commission') {
      const val = formData[field as keyof typeof formData];
      return typeof val === 'string' && val ? `${val}원` : '';
    }
    if (field === 'weight') {
      const val = formData.weight;
      if (typeof val === 'string' && val) {
        return val;
      }
      return '';
    }
    const val = formData[field as keyof typeof formData];
    return typeof val === 'string' ? val : '';
  }, [formData, dateDisplayLabels]);

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    showWaypoints,
    setShowWaypoints,
    keyboardStep,
    setKeyboardStep,
    keyboardInputValue,
    setKeyboardInputValue,
    keyboardShortcutHighlightIndex,
    setKeyboardShortcutHighlightIndex,
    dateDisplayLabels,
    setDateDisplayLabels,
    activeLocationListField,
    setActiveLocationListField,
    keyboardSteps,
    isAddressField,
    getShortcutsData,
    handleResetForm,
    handleDispatchSubmit,
    handleSelectShortcutByIndex,
    handleKeyboardStepEnter,
    handleKeyboardInputKeyDown,
    getStepValueString,
    jusoResults,
    isSearchingJuso,
    searchJusoError
  };
};

export default useDispatchKeyboard;
