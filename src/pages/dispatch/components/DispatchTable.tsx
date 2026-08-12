import React from 'react';
import { Button, Input, Badge } from '../../../components/ui';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import type { Dispatch, DispatchStatus } from '../types';

export interface DispatchTableProps {
  filteredDispatches: Dispatch[];
  expandedId: number | null;
  setExpandedId: (id: number | null) => void;
  blinkRow: { id: number; status: string } | null;
  driverInput: { carNumber: string; driverName: string; driverPhone: string };
  setDriverInput: (input: { carNumber: string; driverName: string; driverPhone: string }) => void;
  editingWaypointsId: number | null;
  setEditingWaypointsId: (id: number | null) => void;
  editWaypoints: string[];
  setEditWaypoints: (wps: string[]) => void;
  activePostcodeField: string | null;
  setActivePostcodeField: (field: string | null) => void;
  adjustTargetMap: Record<number, 'fee' | 'commission'>;
  setAdjustTargetMap: React.Dispatch<React.SetStateAction<Record<number, 'fee' | 'commission'>>>;
  editingFeeId: number | null;
  setEditingFeeId: (id: number | null) => void;
  editingFeeValue: string;
  setEditingFeeValue: (val: string) => void;
  editingCommissionValue: string;
  setEditingCommissionValue: (val: string) => void;
  assigningDispatchId: number | null;
  setAssigningDispatchId: (id: number | null) => void;
  
  setDispatches: React.Dispatch<React.SetStateAction<any[]>>;
  loadOrCreateChatRoom: (name: string, type: 'driver' | 'client', phone: string, carNumber?: string) => void;
  handleUpdateDriverAndStatus: (id: number, status: DispatchStatus) => void;
  handleQuickFeeSave: (id: number) => void;
  formatAmount: (val: string) => string;
  formatPhone: (val: string) => string;
}

const adjustButtonStyle = (bg: string, color: string): React.CSSProperties => ({
  padding: '0.15rem 0.35rem',
  backgroundColor: bg,
  color: color,
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all var(--transition-fast)'
});

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

export const DispatchTable: React.FC<DispatchTableProps> = ({
  filteredDispatches,
  expandedId,
  setExpandedId,
  blinkRow,
  driverInput,
  setDriverInput,
  editingWaypointsId,
  setEditingWaypointsId,
  editWaypoints,
  setEditWaypoints,
  activePostcodeField,
  setActivePostcodeField,
  adjustTargetMap,
  setAdjustTargetMap,
  editingFeeId,
  setEditingFeeId,
  editingFeeValue,
  setEditingFeeValue,
  editingCommissionValue,
  setEditingCommissionValue,
  assigningDispatchId,
  setAssigningDispatchId,
  setDispatches,
  loadOrCreateChatRoom,
  handleUpdateDriverAndStatus,
  handleQuickFeeSave,
  formatAmount,
  formatPhone
}) => {
  return (
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
            const isExpanded = expandedId === dispatch.id;
            const hasDriver = dispatch.status !== 'dispatching' && dispatch.status !== 'cancelled';
            
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
                      setExpandedId(null);
                    } else {
                      setExpandedId(dispatch.id);
                      setDriverInput({
                        carNumber: dispatch.carNumber || '',
                        driverName: dispatch.driverName || '',
                        driverPhone: dispatch.driverPhone || ''
                      });
                    }
                  }}
                  onMouseEnter={e => {
                    if (!isExpanded) e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                  }} 
                  onMouseLeave={e => {
                    if (!isExpanded) e.currentTarget.style.backgroundColor = 'transparent';
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
                        {dispatch.status === 'dispatching' && (() => {
                          const baseDiff = dispatch.id % 3;
                          const feeNum = Number(dispatch.fee) || 0;
                          const originalFeeNum = Number(dispatch.originalFee || dispatch.fee) || 0;
                          const diffInFee = feeNum - originalFeeNum;

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

                          const baseFee = originalFeeNum;
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
                                 {(!dispatch.waypoints || dispatch.waypoints.length === 0) && editingWaypointsId !== dispatch.id && (
                                    <Button
                                      variant="outline"
                                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', borderColor: 'var(--primary)', color: 'var(--primary)', height: '24px', display: 'flex', alignItems: 'center' }}
                                      onClick={(e: any) => {
                                        e.stopPropagation();
                                        setEditingWaypointsId(dispatch.id);
                                        setEditWaypoints(['']);
                                      }}
                                    >
                                      + 경유지 추가
                                    </Button>
                                  )}
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

                              {/* Waypoints Editor (Show only in edit mode) */}
                              {editingWaypointsId === dispatch.id && (
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
                                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)' }}>경유지 정보 편집</span>
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
                                  </div>

                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    {editWaypoints.map((wp, wIdx) => (
                                      <div key={wIdx} style={{ position: 'relative', width: '100%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fff', backgroundColor: 'var(--primary)', borderRadius: '4px', padding: '0.1rem 0.3rem', flexShrink: 0 }}>경유 {wIdx + 1}</span>
                                          <Input
                                            style={{ fontSize: '0.82rem', cursor: 'pointer', flex: 1, padding: '0.3rem 0.5rem', height: '30px' }}
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
                                </div>
                              )}

                              {/* Simple Waypoints List (Show only when not editing and waypoints exist) */}
                              {dispatch.waypoints && dispatch.waypoints.length > 0 && editingWaypointsId !== dispatch.id && (
                                <div style={{
                                  marginTop: '0.5rem',
                                  padding: '0.45rem 0.75rem',
                                  backgroundColor: 'var(--bg-secondary)',
                                  borderRadius: 'var(--radius-md)',
                                  border: '1px solid var(--border-color)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.65rem'
                                }} onClick={e => e.stopPropagation()}>
                                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>📍 경유지:</span>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', alignItems: 'center' }}>
                                    {dispatch.waypoints.map((wp: string, wIdx: number) => (
                                      <div key={wIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        {wIdx > 0 && <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>➔</span>}
                                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>{wp}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingWaypointsId(dispatch.id);
                                      setEditWaypoints(dispatch.waypoints || []);
                                    }}
                                    style={{ marginLeft: 'auto', border: 'none', backgroundColor: 'transparent', color: 'var(--primary)', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
                                  >
                                    수정
                                  </button>
                                </div>
                              )}

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
                                    {dispatch.cargoItem || '일반화물'}
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
                                  {dispatch.memo || '특이사항 없음'}
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
                                    const currentFee = Number(dispatch.fee) || 0;
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
                                          setEditingFeeId(dispatch.id);
                                          setEditingFeeValue(formatAmount(e.target.value));
                                        }}
                                        onFocus={() => {
                                          if (editingFeeId !== dispatch.id) {
                                            setEditingFeeId(dispatch.id);
                                            setEditingFeeValue(dispatch.fee.toLocaleString());
                                            setEditingCommissionValue(dispatch.commission ? Number(dispatch.commission).toLocaleString() : '');
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
                                          setEditingFeeId(dispatch.id);
                                          setEditingCommissionValue(formatAmount(e.target.value));
                                        }}
                                        onFocus={() => {
                                          if (editingFeeId !== dispatch.id) {
                                            setEditingFeeId(dispatch.id);
                                            setEditingFeeValue(dispatch.fee.toLocaleString());
                                            setEditingCommissionValue(dispatch.commission ? Number(dispatch.commission).toLocaleString() : '');
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
                                {(() => {
                                  const isModified = 
                                    (driverInput.carNumber || '') !== (dispatch.carNumber || '') ||
                                    (driverInput.driverName || '') !== (dispatch.driverName || '') ||
                                    (driverInput.driverPhone || '') !== (dispatch.driverPhone || '');
                                  
                                  const showSave = isModified || assigningDispatchId === dispatch.id;
                                  
                                  return (
                                    <>
                                      <div style={{ gridColumn: 'span 2' }}>
                                        <Input 
                                          placeholder="차량번호 (예: 서울 12가 3456)" 
                                          style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }} 
                                          value={driverInput.carNumber}
                                          onChange={e => setDriverInput({...driverInput, carNumber: e.target.value})}
                                        />
                                      </div>
                                      {showSave ? (
                                        <Button
                                          variant="primary"
                                          style={{ 
                                            width: '100%', 
                                            padding: '0.5rem 0', 
                                            fontSize: '0.82rem', 
                                            whiteSpace: 'nowrap', 
                                            textAlign: 'center',
                                            backgroundColor: 'var(--success)',
                                            borderColor: 'var(--success)',
                                            color: '#ffffff',
                                            fontWeight: 800
                                          }}
                                          onClick={(e: any) => {
                                            e.stopPropagation();
                                            const nextStatus = dispatch.status === 'dispatching' ? 'dispatched' : dispatch.status;
                                            handleUpdateDriverAndStatus(dispatch.id, nextStatus as DispatchStatus);
                                            setAssigningDispatchId(null);
                                          }}
                                        >
                                          배정완료
                                        </Button>
                                      ) : (
                                        <Button
                                          variant="primary"
                                          style={{ width: '100%', padding: '0.5rem 0', fontSize: '0.82rem', whiteSpace: 'nowrap', textAlign: 'center' }}
                                          onClick={(e: any) => {
                                            e.stopPropagation();
                                            setAssigningDispatchId(dispatch.id);
                                          }}
                                        >
                                          차량배정
                                        </Button>
                                      )}
                                    </>
                                  );
                                })()}

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
                                      loadOrCreateChatRoom(dispatch.driverName || '', 'driver', dispatch.driverPhone || '', dispatch.carNumber || '');
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
                )}
              </React.Fragment>
            );
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
  );
};
