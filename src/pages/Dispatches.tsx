import React, { useState, useMemo, useEffect } from 'react'
import { Card, Button, Input, Badge } from '../components/ui'
import { Plus, Search, Check, Route } from 'lucide-react'
import type { DispatchStatus, Dispatch } from './dispatch/types'
import { initialHistoricalDispatches, dummyDrivers, initialClientsList } from './dispatch/constants'
import { DispatchChatDrawer } from './dispatch/components/DispatchChatDrawer'
import { KeyboardRegisterPanel } from './dispatch/components/KeyboardRegisterPanel'
import { StandardRegisterForm } from './dispatch/components/StandardRegisterForm'
import { DispatchFilters } from './dispatch/components/DispatchFilters'
import { DispatchTable } from './dispatch/components/DispatchTable'
import {
  useDispatchKeyboard,
  getShortcutDateValue,
  formatPhone
} from './dispatch/hooks/useDispatchKeyboard'

export default function Dispatches() {
  const [notification, setNotification] = useState<string | null>(null);
  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Dispatches state (Database representation in memory)
  const [dispatches, setDispatches] = useState<Dispatch[]>(() => {
    const saved = localStorage.getItem('dispatches');
    if (saved) return JSON.parse(saved);
    return initialHistoricalDispatches.map((item: any, index: number) => ({
      id: index + 1,
      client: item.client,
      origin: item.origin,
      originDate: item.originDate || item.date || '2026-07-01T11:00:00',
      destination: item.destination,
      destinationDate: item.destinationDate || item.date || '2026-07-01T16:00:00',
      spec: item.spec || `${item.tonnage || '5톤'} ${item.carType || '윙바디'}`,
      status: item.status || (index % 5 === 0 ? 'dispatching' : index % 5 === 1 ? 'dispatched' : index % 5 === 2 ? 'loaded' : index % 5 === 3 ? 'completed' : 'cancelled'),
      fee: item.fee,
      originalFee: item.fee,
      settleMethod: item.settleMethod || '인수증',
      commission: item.commission || '0',
      settleDate: item.settleDate || '2026-07-15',
      cargoItem: item.cargoItem || '철강',
      memo: item.memo || '특이사항 없음',
      date: item.date ? item.date.substring(0, 10) : '2026-07-01',
      waypoints: item.waypoints || []
    }));
  });

  useEffect(() => {
    localStorage.setItem('dispatches', JSON.stringify(dispatches));
  }, [dispatches]);

  // Recommendations data source state
  const [historyPool] = useState(initialHistoricalDispatches);

  const [clients, setClients] = useState<any[]>(() => {
    const saved = localStorage.getItem('clients');
    let initialList = saved ? JSON.parse(saved) : initialClientsList;
    if (saved && initialList.length < 40) {
      initialList = initialClientsList;
      localStorage.setItem('clients', JSON.stringify(initialClientsList));
    }
    const candidateItems = ['철강', '기계부품', '박스화물', '화학제품', '목재', '플라스틱', '의류', '가구', '식품', '전자제품'];
    return initialList.map((c: any, index: number) => {
      let items = c.items || [];
      if (items.length === 0) {
        const count = 2 + (index % 3);
        const selected: string[] = [];
        for (let i = 0; i < count; i++) {
          const item = candidateItems[(index * 3 + i) % candidateItems.length];
          if (!selected.includes(item)) {
            selected.push(item);
          }
        }
        items = selected;
      }
      return { ...c, items };
    });
  });

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  // Client save modal state
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientModalData, setClientModalData] = useState({
    name: '',
    phone: '',
    address: '',
    businessNo: '',
    ceoName: '',
    contactName: '',
    contactPhone: ''
  });

  // Table & Driver state
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [driverInput, setDriverInput] = useState({
    carNumber: '',
    driverName: '',
    driverPhone: ''
  });
  const [blinkRow, setBlinkRow] = useState<{ id: number; status: string } | null>(null);
  const [editingFeeId, setEditingFeeId] = useState<number | null>(null);
  const [editingFeeValue, setEditingFeeValue] = useState('');
  const [editingCommissionValue, setEditingCommissionValue] = useState('');
  const [editingWaypointsId, setEditingWaypointsId] = useState<number | null>(null);
  const [editWaypoints, setEditWaypoints] = useState<string[]>([]);
  const [adjustTargetMap, setAdjustTargetMap] = useState<Record<number, 'fee' | 'commission'>>({});
  const [assigningDispatchId, setAssigningDispatchId] = useState<number | null>(null);
  const [activePostcodeField, setActivePostcodeField] = useState<string | null>(null);

  // Filters state
  const [showHistoryPanel, setShowHistoryPanel] = useState(true);
  const [dateFilterType, setDateFilterType] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Client search in history panel
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [clientSearchFilter, setClientSearchFilter] = useState('');

  // Chat Drawer states
  const [activeLeftPanel, setActiveLeftPanel] = useState<'form' | 'chat'>('form');
  const [chatRoomRecipient, setChatRoomRecipient] = useState<{
    partnerName: string;
    partnerType: 'driver' | 'client';
    phone: string;
    vehicleNo?: string;
  } | null>(null);
  const [chatRooms, setChatRooms] = useState<any[]>(() => {
    const saved = localStorage.getItem('dispatch_chat_rooms');
    return saved ? JSON.parse(saved) : [];
  });

  const [registerMode, setRegisterMode] = useState<'normal' | 'keyboard'>('normal');

  // useDispatchKeyboard hook integration
  const {
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
    jusoResults
  } = useDispatchKeyboard({
    clients,
    dispatches,
    setDispatches,
    historyPool,
    setHistoryPool: () => {},
    triggerNotification,
    registerMode
  });

  // Helper Methods
  const getFeeRecommendations = () => {
    const client = formData.clientName.trim();
    const origin = formData.origin.trim();
    const destination = formData.destination.trim();

    let recentFee = 0;
    let frequentFee = 0;

    const saved = localStorage.getItem('dispatches');
    let pool = historyPool;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          pool = parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (client) {
      const clientPool = pool.filter(d => d.client === client);
      if (clientPool.length > 0) {
        recentFee = clientPool[clientPool.length - 1].fee;
        const feeCounts: Record<number, number> = {};
        clientPool.forEach(d => {
          feeCounts[d.fee] = (feeCounts[d.fee] || 0) + 1;
        });
        const sortedFees = Object.entries(feeCounts).sort((a, b) => b[1] - a[1]);
        frequentFee = Number(sortedFees[0][0]);
      }
    }

    if ((!recentFee || !frequentFee) && origin && destination) {
      const originDong = origin.split(' ').slice(0, 2).join(' ');
      const destDong = destination.split(' ').slice(0, 2).join(' ');
      const routePool = pool.filter(d => 
        d.origin.includes(originDong) && d.destination.includes(destDong)
      );

      if (routePool.length > 0) {
        if (!recentFee) recentFee = routePool[routePool.length - 1].fee;
        if (!frequentFee) {
          const feeCounts: Record<number, number> = {};
          routePool.forEach(d => {
            feeCounts[d.fee] = (feeCounts[d.fee] || 0) + 1;
          });
          const sortedFees = Object.entries(feeCounts).sort((a, b) => b[1] - a[1]);
          frequentFee = Number(sortedFees[0][0]);
        }
      }
    }

    return { recentFee, frequentFee };
  };

  const { recentFee, frequentFee } = getFeeRecommendations();

  const formatAmount = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (!digits) return '';
    return Number(digits).toLocaleString();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleRecommendClient = (name: string, phone: string, contact: string) => {
    setFormData(prev => ({
      ...prev,
      clientName: name,
      clientPhone: phone,
      clientContact: contact
    }));
    setErrors(prev => ({ ...prev, clientName: false }));
    triggerNotification(`거래처 [${name}] 정보가 자동 추천되었습니다.`);
  };

  const handleRecommendSpec = (tonnage: string, carType: string, weight: string) => {
    setFormData(prev => ({
      ...prev,
      tonnage,
      carType,
      weight
    }));
    triggerNotification(`차량 스펙 [${tonnage} ${carType} (${weight})]이 추천되었습니다.`);
  };

  const handleRecommendLocation = (field: 'origin' | 'destination', loc: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: loc
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
    triggerNotification(`${field === 'origin' ? '상차지' : '하차지'}로 [${loc}] 주소가 자동 지정되었습니다.`);
  };

  const handleRecommendRoute = (origin: string, destination: string) => {
    setFormData(prev => ({
      ...prev,
      origin,
      destination
    }));
    setErrors(prev => ({ ...prev, origin: false, destination: false }));
    triggerNotification(`추천 구간 주소가 상하차지에 입력되었습니다.`);
  };

  const handleDateShortcut = (field: 'originDate' | 'destinationDate' | 'settleDate', type: string) => {
    const formatted = getShortcutDateValue(type);
    if (formatted) {
      handleInputChange(field, formatted);
    }
  };

  const loadOrCreateChatRoom = (name: string, type: 'driver' | 'client', phone: string, carNumber = '') => {
    const existing = chatRooms.find(r => r.recipientName === name && r.type === type);
    const recipientObj = {
      partnerName: name,
      partnerType: type,
      phone: phone,
      vehicleNo: carNumber
    };
    if (existing) {
      setChatRoomRecipient(recipientObj);
      setActiveLeftPanel('chat');
    } else {
      const newRoom = {
        id: Date.now(),
        recipientName: name,
        type,
        phone,
        carNumber,
        messages: [
          {
            id: 1,
            sender: 'system',
            text: `${name}님과의 대화방이 개설되었습니다.`,
            time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            unread: false
          }
        ]
      };
      const updated = [...chatRooms, newRoom];
      setChatRooms(updated);
      localStorage.setItem('dispatch_chat_rooms', JSON.stringify(updated));
      setChatRoomRecipient(recipientObj);
      setActiveLeftPanel('chat');
    }
  };

  const handleUpdateDriverAndStatus = (id: number, status: DispatchStatus) => {
    const original = dispatches.find(d => d.id === id);
    if (!original) return;

    let updatedDriver = {};
    if (status !== 'dispatching' && status !== 'cancelled') {
      updatedDriver = {
        carNumber: driverInput.carNumber || original.carNumber,
        driverName: driverInput.driverName || original.driverName,
        driverPhone: driverInput.driverPhone || original.driverPhone
      };
    } else {
      updatedDriver = {
        carNumber: '',
        driverName: '',
        driverPhone: ''
      };
    }

    const updated = dispatches.map(d => {
      if (d.id === id) {
        return {
          ...d,
          ...updatedDriver,
          status
        };
      }
      return d;
    });

    setDispatches(updated);
    setBlinkRow({ id, status });
    setTimeout(() => setBlinkRow(null), 1000);
    triggerNotification(`배차 상태가 [${
      status === 'dispatching' ? '배차대기' : 
      status === 'dispatched' ? '배차완료' : 
      status === 'cancelled' ? '배차취소' : 
      status === 'loaded' ? '상차완료' : 
      status === 'unloaded' ? '하차완료' : '운행완료'
    }] 상태로 업데이트되었습니다.`);
  };

  const handleQuickFeeSave = (id: number) => {
    const target = dispatches.find(d => d.id === id);
    if (!target) return;

    const fee = Number(editingFeeValue.replace(/,/g, '')) || 0;
    const commission = editingCommissionValue ? String(Number(editingCommissionValue.replace(/,/g, '')) || 0) : '0';

    const updated = dispatches.map(d => {
      if (d.id === id) {
        return {
          ...d,
          fee,
          commission
        };
      }
      return d;
    });

    setDispatches(updated);
    setEditingFeeId(null);
    setBlinkRow({ id, status: 'fee-update' });
    setTimeout(() => setBlinkRow(null), 1000);
    triggerNotification('운임 및 수수료가 수정되었습니다.');
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientModalData.name.trim()) return;

    const newClient = {
      id: Date.now(),
      name: clientModalData.name.trim(),
      phone: clientModalData.phone.trim(),
      contact: clientModalData.contactName.trim(),
      businessNo: clientModalData.businessNo.trim(),
      origins: [clientModalData.address.trim()].filter(Boolean),
      destinations: []
    };

    const updated = [...clients, newClient];
    setClients(updated);
    localStorage.setItem('clients', JSON.stringify(updated));

    // autofill
    setFormData(prev => ({
      ...prev,
      clientName: newClient.name,
      clientPhone: newClient.phone,
      clientContact: newClient.contact
    }));

    setShowClientModal(false);
    setClientModalData({
      name: '',
      phone: '',
      address: '',
      businessNo: '',
      ceoName: '',
      contactName: '',
      contactPhone: ''
    });

    triggerNotification(`신규 거래처 [${newClient.name}]가 저장 및 선택되었습니다.`);
  };

  // Memos & Recommendations
  const topRoutes = useMemo(() => {
    const routeCounts: Record<string, number> = {};
    historyPool.forEach(item => {
      if (item.origin && item.destination) {
        const key = `${item.origin} === ${item.destination}`;
        routeCounts[key] = (routeCounts[key] || 0) + 1;
      }
    });
    return Object.entries(routeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key]) => {
        const [origin, destination] = key.split(' === ');
        return { origin, destination };
      });
  }, [historyPool]);

  const topOrigins = useMemo(() => {
    const clientName = formData.clientName.trim();
    let list: string[] = [];
    if (clientName) {
      const matched = clients.find(c => c.name === clientName);
      if (matched) list = matched.origins || [];
    }
    if (list.length === 0) {
      const counts: Record<string, number> = {};
      historyPool.forEach(item => {
        if (item.origin) counts[item.origin] = (counts[item.origin] || 0) + 1;
      });
      list = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([address]) => address);
    }
    return list.slice(0, 5);
  }, [formData.clientName, clients, historyPool]);

  const topDestinations = useMemo(() => {
    const clientName = formData.clientName.trim();
    let list: string[] = [];
    if (clientName) {
      const matched = clients.find(c => c.name === clientName);
      if (matched) list = matched.destinations || [];
    }
    if (list.length === 0) {
      const counts: Record<string, number> = {};
      historyPool.forEach(item => {
        if (item.destination) counts[item.destination] = (counts[item.destination] || 0) + 1;
      });
      list = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([address]) => address);
    }
    return list.slice(0, 5);
  }, [formData.clientName, clients, historyPool]);

  const topSpecs = useMemo(() => {
    const clientName = formData.clientName.trim();
    let specCounts: Record<string, number> = {};

    if (clientName) {
      const clientDispatches = dispatches.filter(d => d.client === clientName);
      clientDispatches.forEach(d => {
        if (d.spec) specCounts[d.spec] = (specCounts[d.spec] || 0) + 1;
      });
    }

    if (Object.keys(specCounts).length === 0) {
      historyPool.forEach(d => {
        const specKey = (d as any).spec || `${d.tonnage || '5톤'} ${d.carType || '윙바디'}`;
        specCounts[specKey] = (specCounts[specKey] || 0) + 1;
      });
    }

    return Object.entries(specCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([spec, count]) => {
        const [tonnage, carType] = spec.split(' ');
        return {
          count,
          tonnage: tonnage || '5톤',
          carType: carType || '윙바디',
          weight: '5T',
          isClientSpec: !!clientName
        };
      });
  }, [formData.clientName, dispatches, historyPool]);

  const getLocalDateOnly = (dateStr: string) => {
    return dateStr.substring(0, 10);
  };

  const matchesDateFilter = (dateStr: string, type: string) => {
    if (type === '전체') return true;
    const targetDate = getLocalDateOnly(dateStr);
    const today = new Date();
    const todayStr = today.toISOString().substring(0, 10);

    if (type === '오늘') {
      return targetDate === todayStr;
    }

    if (type === '이번주') {
      const currentDay = today.getDay();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
      const startStr = startOfWeek.toISOString().substring(0, 10);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      const endStr = endOfWeek.toISOString().substring(0, 10);
      return targetDate >= startStr && targetDate <= endStr;
    }

    if (type === '지난주') {
      const currentDay = today.getDay();
      const startOfLastWeek = new Date(today);
      startOfLastWeek.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1) - 7);
      const startStr = startOfLastWeek.toISOString().substring(0, 10);
      const endOfLastWeek = new Date(startOfLastWeek);
      endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
      const endStr = endOfLastWeek.toISOString().substring(0, 10);
      return targetDate >= startStr && targetDate <= endStr;
    }

    if (type === '이번달') {
      const startStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const endStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(endOfMonth.getDate()).padStart(2, '0')}`;
      return targetDate >= startStr && targetDate <= endStr;
    }

    if (type === '지난달') {
      const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const startStr = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}-01`;
      const endOfMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
      const endStr = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}-${String(endOfMonth.getDate()).padStart(2, '0')}`;
      return targetDate >= startStr && targetDate <= endStr;
    }

    if (type === '직접선택') {
      if (!customStartDate || !customEndDate) return true;
      return targetDate >= customStartDate && targetDate <= customEndDate;
    }

    return true;
  };

  const filteredDispatches = useMemo(() => {
    return dispatches.filter(dispatch => {
      const originDate = dispatch.originDate || dispatch.date;
      const matchesDate = matchesDateFilter(originDate, dateFilterType);

      const matchesStatus = statusFilter === '전체' || (
        (statusFilter === '배차중' && dispatch.status === 'dispatching') ||
        (statusFilter === '배차완료' && dispatch.status === 'dispatched') ||
        (statusFilter === '배차취소' && dispatch.status === 'cancelled') ||
        (statusFilter === '상차완료' && dispatch.status === 'loaded') ||
        (statusFilter === '하차완료' && dispatch.status === 'unloaded') ||
        (statusFilter === '운행완료' && dispatch.status === 'completed')
      );

      const lowerSearch = searchFilter.toLowerCase().trim();
      const matchesSearch = !lowerSearch || (
        (dispatch.client || '').toLowerCase().includes(lowerSearch) ||
        (dispatch.origin || '').toLowerCase().includes(lowerSearch) ||
        (dispatch.destination || '').toLowerCase().includes(lowerSearch) ||
        (dispatch.driverName || '').toLowerCase().includes(lowerSearch) ||
        (dispatch.carNumber || '').toLowerCase().includes(lowerSearch) ||
        (dispatch.spec || '').toLowerCase().includes(lowerSearch)
      );

      return matchesDate && matchesStatus && matchesSearch;
    });
  }, [dispatches, dateFilterType, statusFilter, searchFilter, customStartDate, customEndDate]);

  const getDateCount = (type: string) => {
    return dispatches.filter(dispatch => {
      const originDate = dispatch.originDate || dispatch.date;
      return matchesDateFilter(originDate, type);
    }).length;
  };

  const getStatusCount = (statusType: string) => {
    return dispatches.filter(dispatch => {
      return statusType === '전체' || (
        (statusType === '배차중' && dispatch.status === 'dispatching') ||
        (statusType === '배차완료' && dispatch.status === 'dispatched') ||
        (statusType === '배차취소' && dispatch.status === 'cancelled') ||
        (statusType === '상차완료' && dispatch.status === 'loaded') ||
        (statusType === '하차완료' && dispatch.status === 'unloaded') ||
        (statusType === '운행완료' && dispatch.status === 'completed')
      );
    }).length;
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSearchFilter('');
    setDateFilterType('전체');
    setStatusFilter('전체');
    setCustomStartDate('');
    setCustomEndDate('');
    triggerNotification('필터 조건이 모두 초기화되었습니다!');
  };

  // Render Driver list in assignment panel
  const renderDriverCard = (driver: any, hasActive: boolean) => {
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

    const getDriverMonthlyEarnings = (drv: any) => {
      const completedFee = dispatches
        .filter(d => (d.carNumber === drv.vNumber || d.driverName === drv.name) && d.status === 'completed')
        .reduce((sum, d) => sum + (Number(d.fee) || 0), 0);
      const base = drv.spec.includes('11톤') || drv.spec.includes('25톤') ? 3500000 : drv.spec.includes('5톤') ? 2200000 : 1200000;
      return base + completedFee;
    };

    const getDriverRecentDispatchesCount = (drv: any) => {
      return dispatches.filter(d => (d.carNumber === drv.vNumber || d.driverName === drv.name)).length;
    };

    const getRecommendationReason = (drv: any, targetSpec: string, dist: number, isActive: boolean) => {
      const reasons: string[] = [];
      const hasExp = dispatches.some(d => 
        (d.carNumber === drv.vNumber || d.driverName === drv.name) && 
        d.spec === targetSpec
      );
      if (hasExp) reasons.push('동일 스펙 운행 이력 다수');
      if (dist < 15) reasons.push('상차지 인근 대기 공차');
      if (isActive) reasons.push('현재 즉시 배차 협의 가능');
      if (reasons.length === 0) reasons.push('가용 차량 매칭 추천');
      return reasons.join(', ');
    };

    const home = driverHomeLocations[driver.id] || '경기 시흥시';
    const distance = getDistanceInKm(target.origin, home);
    const reason = getRecommendationReason(driver, target.spec, distance, hasActive);
    const earnings = getDriverMonthlyEarnings(driver);
    const totalCount = getDriverRecentDispatchesCount(driver);

    const isMatchSpec = target.spec === driver.spec;

    return (
      <div 
        key={driver.id} 
        style={{ 
          padding: '0.85rem', 
          backgroundColor: 'var(--bg-secondary)', 
          border: '1.5px solid ' + (isMatchSpec ? 'var(--primary)' : 'var(--border-color)'), 
          borderRadius: 'var(--radius-md)', 
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)'
        }}
        onClick={() => {
          setDriverInput({
            carNumber: driver.vNumber,
            driverName: driver.name,
            driverPhone: driver.phone
          });
          triggerNotification(`차주 [${driver.name}] 정보가 지정되었습니다. 배정 버튼을 누르시면 완료됩니다.`);
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontWeight: 800, fontSize: '0.86rem' }}>{driver.name}</span>
            <Badge color={isMatchSpec ? 'primary' : 'gray'}>{driver.spec}</Badge>
            {hasActive && <span style={{ width: '6px', height: '6px', backgroundColor: '#10B981', borderRadius: '50%' }} title="즉시 배차 협의 가능" />}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{driver.phone}</span>
        </div>
        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
          📍 차고지: <strong style={{ color: 'var(--text-primary)' }}>{home}</strong> ({distance.toFixed(1)}km 대기)
        </div>
        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.75rem' }}>
          <span>• 당월 운송: {totalCount}건</span>
          <span>• 누적 매출: {earnings.toLocaleString()}원</span>
        </div>
        <div style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 700, borderTop: '1px dashed var(--border-color)', paddingTop: '0.35rem', marginTop: '0.1rem' }}>
          ✨ 추천 사유: {reason}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%', overflow: 'hidden' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '1.25rem',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(23, 23, 23, 0.95)',
          color: '#ffffff',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-full)',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 9999,
          fontSize: '0.85rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'slideDown var(--transition-fast)'
        }}>
          <Check size={14} style={{ color: 'var(--primary)' }} /> {notification}
        </div>
      )}


      {/* Client Modal Popup */}
      {showClientModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <Card className="animate-fade-slide-up" style={{ width: '420px', padding: '1.5rem', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', margin: '0 0 1rem 0' }}>
              <span style={{ width: '4px', height: '14px', backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-sm)' }}></span>
              신규 거래처 등록
            </h4>
            <form onSubmit={handleSaveClient} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label className="text-xs font-bold text-secondary" style={{ display: 'block', marginBottom: '0.3rem' }}>거래처명</label>
                <Input 
                  placeholder="예: 현대유통" 
                  value={clientModalData.name} 
                  onChange={e => setClientModalData({...clientModalData, name: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-secondary" style={{ display: 'block', marginBottom: '0.3rem' }}>대표 연락처</label>
                <Input 
                  placeholder="예: 02-123-4567" 
                  value={clientModalData.phone} 
                  onChange={e => setClientModalData({...clientModalData, phone: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-secondary" style={{ display: 'block', marginBottom: '0.3rem' }}>담당자 명</label>
                <Input 
                  placeholder="예: 홍길동 과장" 
                  value={clientModalData.contactName} 
                  onChange={e => setClientModalData({...clientModalData, contactName: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-secondary" style={{ display: 'block', marginBottom: '0.3rem' }}>사업자번호</label>
                <Input 
                  placeholder="예: 120-00-00000" 
                  value={clientModalData.businessNo} 
                  onChange={e => setClientModalData({...clientModalData, businessNo: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-secondary" style={{ display: 'block', marginBottom: '0.3rem' }}>주요 상차 주소</label>
                <Input 
                  placeholder="예: 경기 화성시 동탄산단로" 
                  value={clientModalData.address} 
                  onChange={e => setClientModalData({...clientModalData, address: e.target.value})} 
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Button type="button" variant="secondary" style={{ flex: 1 }} onClick={() => setShowClientModal(false)}>취소</Button>
                <Button type="submit" variant="primary" style={{ flex: 1 }}>저장하기</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Main Body Layout */}
      <div style={{ display: 'flex', gap: '0.85rem', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Area (40% Width) */}
        <div className="dispatch-left-area" style={{ flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
          {activeLeftPanel === 'chat' && chatRoomRecipient ? (
            <DispatchChatDrawer
              chatRoomRecipient={chatRoomRecipient}
              activeLeftPanel={activeLeftPanel}
              setActiveLeftPanel={setActiveLeftPanel}
            />
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
                    const target = dispatches.find(d => d.id === assigningDispatchId);
                    if (!target) return null;
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
                    );
                  })()}
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                  {(() => {
                    const target = dispatches.find(d => d.id === assigningDispatchId);
                    if (!target) return null;

                    const sortedDrivers = [...dummyDrivers].sort((a, b) => {
                      const specMatchA = target.spec === a.spec ? 1 : 0;
                      const specMatchB = target.spec === b.spec ? 1 : 0;
                      return specMatchB - specMatchA;
                    });

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>차주 자동추천 목록</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          {sortedDrivers.map(driver => renderDriverCard(driver, false))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="dispatch-registration-card" style={{ flex: 1, padding: '0.85rem 1rem', overflowY: registerMode === 'keyboard' ? 'hidden' : 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', border: 'none', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', margin: '0 0 -0.25rem 0' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem', margin: 0 }}>
                  <span style={{ width: '4px', height: '14px', backgroundColor: 'var(--primary)', borderRadius: 'var(--radius-sm)' }}></span>
                  {registerMode === 'keyboard' ? '운행 등록 (키보드)' : '운행 등록'}
                </h4>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setRegisterMode('normal');
                      setShowWaypoints(false);
                    }}
                    style={{
                      padding: '0.2rem 0.5rem',
                      fontSize: '0.74rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      border: '1px solid ' + (registerMode === 'normal' ? 'var(--primary)' : 'var(--border-color)'),
                      backgroundColor: registerMode === 'normal' ? 'var(--primary-light)' : 'transparent',
                      color: registerMode === 'normal' ? 'var(--primary)' : 'var(--text-secondary)',
                      fontWeight: registerMode === 'normal' ? 700 : 500,
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    일반
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRegisterMode('keyboard');
                      setKeyboardStep(0);
                      setKeyboardInputValue('');
                      setKeyboardShortcutHighlightIndex(-1);
                      setTimeout(() => {
                        const inputEl = document.getElementById('keyboard-mode-input');
                        if (inputEl) inputEl.focus();
                      }, 50);
                    }}
                    style={{
                      padding: '0.2rem 0.5rem',
                      fontSize: '0.74rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      border: '1px solid ' + (registerMode === 'keyboard' ? 'var(--primary)' : 'var(--border-color)'),
                      backgroundColor: registerMode === 'keyboard' ? 'var(--primary-light)' : 'transparent',
                      color: registerMode === 'keyboard' ? 'var(--primary)' : 'var(--text-secondary)',
                      fontWeight: registerMode === 'keyboard' ? 700 : 500,
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    키보드
                  </button>
                </div>
              </div>

              {registerMode === 'keyboard' ? (
                <KeyboardRegisterPanel
                  formData={formData}
                  keyboardStep={keyboardStep}
                  setKeyboardStep={setKeyboardStep}
                  keyboardInputValue={keyboardInputValue}
                  setKeyboardInputValue={setKeyboardInputValue}
                  keyboardShortcutHighlightIndex={keyboardShortcutHighlightIndex}
                  keyboardSteps={keyboardSteps}
                  isAddressField={isAddressField}
                  getShortcutsData={getShortcutsData}
                  handleSelectShortcutByIndex={handleSelectShortcutByIndex}
                  handleKeyboardStepEnter={handleKeyboardStepEnter}
                  handleKeyboardInputKeyDown={handleKeyboardInputKeyDown}
                  getStepValueString={getStepValueString}
                  jusoResults={jusoResults}
                />
              ) : (
                <>
                  <StandardRegisterForm
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                    clients={clients}
                    activeLocationListField={activeLocationListField}
                    setActiveLocationListField={setActiveLocationListField}
                    activePostcodeField={activePostcodeField}
                    setActivePostcodeField={setActivePostcodeField}
                    setShowClientSearch={setShowClientSearch}
                    setClientSearchTerm={setClientSearchTerm}
                    setClientSearchFilter={setClientSearchFilter}
                    showWaypoints={showWaypoints}
                    setShowWaypoints={setShowWaypoints}
                    topRoutes={topRoutes}
                    topOrigins={topOrigins}
                    topDestinations={topDestinations}
                    topSpecs={topSpecs}
                    recentFee={recentFee}
                    frequentFee={frequentFee}
                    handleInputChange={handleInputChange}
                    handleRecommendClient={handleRecommendClient}
                    handleRecommendSpec={handleRecommendSpec}
                    handleRecommendLocation={handleRecommendLocation}
                    handleRecommendRoute={handleRecommendRoute}
                    handleDateShortcut={handleDateShortcut}
                    setShowClientModal={setShowClientModal}
                  />
                  <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    <Button variant="primary" style={{ flex: 1, padding: '0.7rem' }} onClick={handleDispatchSubmit}>
                      <Plus size={16} /> 배차 등록
                    </Button>
                    <Button 
                      variant="secondary" 
                      type="button"
                      style={{ padding: '0.7rem' }}
                      onClick={handleResetForm}
                    >
                      초기화
                    </Button>
                  </div>
                </>
              )}
            </Card>
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
                          {topRoutes.map((route: { origin: string, destination: string }, idx: number) => {
                            const isSelected = formData.origin === route.origin && formData.destination === route.destination;
                            return (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0.55rem', backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, origin: route.origin, destination: route.destination }));
                                  setErrors(prev => ({ ...prev, origin: false, destination: false }));
                                  setActiveLocationListField(null);
                                  triggerNotification(`주요 구간이 선택되었습니다.`);
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', width: '85%' }}>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '15px', height: '15px', fontSize: '0.62rem', fontWeight: 800, backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '50%' }}>{idx + 1}</span>
                                  <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                    {route.origin.split(' ').slice(0, 2).join(' ')} &rarr; {route.destination.split(' ').slice(0, 2).join(' ')}
                                  </div>
                                </div>
                                <Button variant="secondary" style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem' }}>선택</Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* 2. 주요 상차지 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderLeft: '3.5px solid var(--primary)', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.65rem', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)' }}>📍 거래처 저장기반 주요상차지</span>
                      <div style={{ flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          {topOrigins.map((loc: string, idx: number) => {
                            const isSelected = formData.origin === loc;
                            return (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0.55rem', backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, origin: loc }));
                                  setErrors(prev => ({ ...prev, origin: false }));
                                  setActiveLocationListField(null);
                                  triggerNotification(`상차지 선택 완료`);
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', width: '85%' }}>
                                  <Badge color="primary">{idx + 1}</Badge>
                                  <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{loc}</span>
                                </div>
                                <Button variant="secondary" style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem' }}>선택</Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* 3. 주요 하차지 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderLeft: '3.5px solid var(--success)', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.65rem', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--success)' }}>🏁 거래처 저장기반 주요하차지</span>
                      <div style={{ flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          {topDestinations.map((loc: string, idx: number) => {
                            const isSelected = formData.destination === loc;
                            return (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0.55rem', backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, destination: loc }));
                                  setErrors(prev => ({ ...prev, destination: false }));
                                  setActiveLocationListField(null);
                                  triggerNotification(`하차지 선택 완료`);
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', width: '85%' }}>
                                  <Badge color="success">{idx + 1}</Badge>
                                  <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{loc}</span>
                                </div>
                                <Button variant="secondary" style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem' }}>선택</Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ) : showClientSearch ? (
                <div className="animate-slide-down" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%', overflow: 'hidden' }}>
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
                            if (e.key === 'Enter') setClientSearchFilter(clientSearchTerm);
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
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <th style={{ padding: '0.5rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>거래처명</th>
                          <th style={{ padding: '0.5rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>담당자</th>
                          <th style={{ padding: '0.5rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>연락처</th>
                          <th style={{ padding: '0.5rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>사업자번호</th>
                          <th style={{ padding: '0.5rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>선택</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.filter(c => {
                          const keyword = clientSearchFilter.trim().toLowerCase();
                          if (!keyword) return true;
                          return c.name.toLowerCase().includes(keyword) || 
                                 c.contact.toLowerCase().includes(keyword) || 
                                 c.phone.toLowerCase().includes(keyword) ||
                                 (c.businessNo || '').toLowerCase().includes(keyword);
                        }).map(c => (
                          <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '0.65rem 0.5rem', fontSize: '0.85rem', fontWeight: 700 }}>{c.name}</td>
                            <td style={{ padding: '0.65rem 0.5rem', fontSize: '0.85rem' }}>{c.contact}</td>
                            <td style={{ padding: '0.65rem 0.5rem', fontSize: '0.85rem' }}>{c.phone}</td>
                            <td style={{ padding: '0.65rem 0.5rem', fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>{c.businessNo || '미기재'}</td>
                            <td style={{ padding: '0.65rem 0.5rem' }}>
                              <Button 
                                variant="secondary" 
                                style={{ padding: '0.2rem 0.45rem', fontSize: '0.74rem' }}
                                onClick={() => {
                                  handleRecommendClient(c.name, c.phone, c.contact);
                                  setShowClientSearch(false);
                                }}
                              >
                                선택
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <>
                  <DispatchFilters
                    dateFilterType={dateFilterType}
                    setDateFilterType={setDateFilterType}
                    customStartDate={customStartDate}
                    setCustomStartDate={setCustomStartDate}
                    customEndDate={customEndDate}
                    setCustomEndDate={setCustomEndDate}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    setSearchFilter={setSearchFilter}
                    getDateCount={getDateCount}
                    getStatusCount={getStatusCount}
                    handleResetFilters={handleResetFilters}
                  />

                  <DispatchTable
                    filteredDispatches={filteredDispatches}
                    expandedId={expandedId}
                    setExpandedId={setExpandedId}
                    blinkRow={blinkRow}
                    driverInput={driverInput}
                    setDriverInput={setDriverInput}
                    editingWaypointsId={editingWaypointsId}
                    setEditingWaypointsId={setEditingWaypointsId}
                    editWaypoints={editWaypoints}
                    setEditWaypoints={setEditWaypoints}
                    activePostcodeField={activePostcodeField}
                    setActivePostcodeField={setActivePostcodeField}
                    adjustTargetMap={adjustTargetMap}
                    setAdjustTargetMap={setAdjustTargetMap}
                    editingFeeId={editingFeeId}
                    setEditingFeeId={setEditingFeeId}
                    editingFeeValue={editingFeeValue}
                    setEditingFeeValue={setEditingFeeValue}
                    editingCommissionValue={editingCommissionValue}
                    setEditingCommissionValue={setEditingCommissionValue}
                    assigningDispatchId={assigningDispatchId}
                    setAssigningDispatchId={setAssigningDispatchId}
                    setDispatches={setDispatches}
                    loadOrCreateChatRoom={loadOrCreateChatRoom}
                    handleUpdateDriverAndStatus={handleUpdateDriverAndStatus}
                    handleQuickFeeSave={handleQuickFeeSave}
                    formatAmount={formatAmount}
                    formatPhone={formatPhone}
                  />
                </>
              )}
            </Card>
          </div>
        )}
      </div>

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

      {/* Major Location List Modal Popup for Mobile */}
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
                      {topRoutes.map((route: { origin: string, destination: string }, idx: number) => {
                        const isSelected = formData.origin === route.origin && formData.destination === route.destination;
                        return (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0.75rem', backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, origin: route.origin, destination: route.destination }));
                              setErrors(prev => ({ ...prev, origin: false, destination: false }));
                              setActiveLocationListField(null);
                              triggerNotification(`주요 구간이 선택되었습니다: ${route.origin.split(' ').slice(0, 2).join(' ')} → ${route.destination.split(' ').slice(0, 2).join(' ')}`);
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
                        );
                      })}
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
                      {topOrigins.map((loc: string, idx: number) => {
                        const isSelected = formData.origin === loc;
                        return (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0.75rem', backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, origin: loc }));
                              setErrors(prev => ({ ...prev, origin: false }));
                              setActiveLocationListField(null);
                              triggerNotification(`상차지가 선택되었습니다: ${loc}`);
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '85%' }}>
                              <Badge color="primary">{idx + 1}</Badge>
                              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{loc}</span>
                            </div>
                            <Button variant="secondary" style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}>선택</Button>
                          </div>
                        );
                      })}
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
                      {topDestinations.map((loc: string, idx: number) => {
                        const isSelected = formData.destination === loc;
                        return (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0.75rem', backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, destination: loc }));
                              setErrors(prev => ({ ...prev, destination: false }));
                              setActiveLocationListField(null);
                              triggerNotification(`하차지가 선택되었습니다: ${loc}`);
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '85%' }}>
                              <Badge color="success">{idx + 1}</Badge>
                              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{loc}</span>
                            </div>
                            <Button variant="secondary" style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}>선택</Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
