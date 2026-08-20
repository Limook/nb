import React from 'react';
import { Input } from '../../../components/ui';
import { Check } from 'lucide-react';
import type { Client, KeyboardStep } from '../types';

export interface KeyboardRegisterPanelProps {
  // From useDispatchKeyboard hook
  formData: any;
  keyboardStep: number;
  setKeyboardStep: (step: number) => void;
  keyboardInputValue: string;
  setKeyboardInputValue: (val: string) => void;
  keyboardShortcutHighlightIndex: number;
  keyboardSteps: KeyboardStep[];
  isAddressField: (stepIdx: number) => boolean;
  getShortcutsData: (stepField: string) => any[];
  handleSelectShortcutByIndex: (idx: number, isShiftPressed?: boolean) => void;
  handleKeyboardStepEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleKeyboardInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  getStepValueString: (field: string) => string;
  jusoResults?: any[];
  isSearchingJuso?: boolean;
  searchJusoError?: string;

  // From parent page
  clients: Client[];
}

export const KeyboardRegisterPanel: React.FC<KeyboardRegisterPanelProps> = ({
  formData,
  keyboardStep,
  setKeyboardStep,
  keyboardInputValue,
  setKeyboardInputValue,
  keyboardShortcutHighlightIndex,
  keyboardSteps,
  isAddressField,
  getShortcutsData,
  handleSelectShortcutByIndex,
  handleKeyboardStepEnter,
  handleKeyboardInputKeyDown,
  getStepValueString,
  jusoResults = [],
  isSearchingJuso = false,
  searchJusoError = '',
  clients
}) => {
  const currentStep = keyboardSteps[keyboardStep];
  const stepField = currentStep ? currentStep.field : '';

  const isOrigin = stepField === 'origin' || stepField === 'originDate' || stepField.startsWith('waypoint_');
  const isDest = stepField === 'destination' || stepField === 'destinationDate';

  const getStepTheme = () => {
    if (isOrigin) {
      return {
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        border: '2px solid rgba(59, 130, 246, 0.3)'
      };
    }
    if (isDest) {
      return {
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        border: '2px solid rgba(239, 68, 68, 0.3)'
      };
    }
    return {
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)'
    };
  };

  const theme = getStepTheme();



  const renderShortcutWrapper = (idx: number, children: React.ReactNode, justify = 'space-between') => {
    const isHighlighted = idx === keyboardShortcutHighlightIndex;
    
    let highlightBg = 'rgba(49, 130, 246, 0.12)';
    let highlightBorder = '1.5px solid var(--primary)';
    let highlightShadow = '0 2px 6px rgba(49, 130, 246, 0.15)';

    if (isOrigin) {
      highlightBg = 'rgba(59, 130, 246, 0.12)';
      highlightBorder = '2px solid var(--primary)';
      highlightShadow = '0 2px 6px rgba(59, 130, 246, 0.2)';
    } else if (isDest) {
      highlightBg = 'rgba(239, 68, 68, 0.12)';
      highlightBorder = '2px solid #ef4444';
      highlightShadow = '0 2px 6px rgba(239, 68, 68, 0.2)';
    }

    return (
      <div
        key={idx}
        className="keyboard-shortcut-item"
        onClick={() => handleSelectShortcutByIndex(idx)}
        ref={isHighlighted ? (el) => {
          if (el) {
            el.scrollIntoView({
              behavior: 'auto',
              block: 'nearest'
            });
          }
        } : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: justify,
          padding: '0.55rem 0.75rem',
          backgroundColor: isHighlighted ? highlightBg : 'var(--bg-secondary)',
          border: isHighlighted ? highlightBorder : '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          boxShadow: isHighlighted ? highlightShadow : 'none',
          cursor: 'pointer'
        }}
      >
        {children}
      </div>
    );
  };

  const renderKeyboardShortcuts = (field: string) => {
    if (field === 'clientName') {
      const shortcuts = getShortcutsData('clientName');
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {shortcuts.map((client: any, idx: number) => renderShortcutWrapper(idx, (
            <React.Fragment key={client.id}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {idx < 9 ? (
                  <span style={{ color: 'var(--primary)', marginRight: '0.5rem', fontWeight: 900 }}>{idx + 1}</span>
                ) : (
                  <span style={{ marginRight: '0.4rem', width: '12px', display: 'inline-block' }} />
                )}
                {client.name}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
                {client.phone}
              </span>
            </React.Fragment>
          )))}
          {shortcuts.length === 0 && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', padding: '1rem', textAlign: 'center', fontStyle: 'italic' }}>
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      );
    }
    if (field === 'origin' || field.startsWith('waypoint_') || field === 'destination') {
      if (keyboardInputValue.trim() !== '') {
        if (isSearchingJuso) {
          return (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '1rem', textAlign: 'center' }}>
              ⏳ 주소 검색 중...
            </div>
          );
        }
        if (searchJusoError) {
          return (
            <div style={{ fontSize: '0.8rem', color: '#ef4444', padding: '1rem', textAlign: 'center' }}>
              ❌ {searchJusoError}
            </div>
          );
        }
        if (jusoResults.length > 0) {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {jusoResults.map((loc, idx) => {
                const roadAddr = typeof loc === 'string' ? loc : (loc?.roadAddr || '');
                const jibunAddr = typeof loc === 'string' ? '' : (loc?.jibunAddr || '');
                const zipNo = typeof loc === 'string' ? '' : (loc?.zipNo || '');
                return renderShortcutWrapper(idx, (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'left' }}>
                      <span style={{ color: 'var(--primary)', marginRight: '0.5rem', fontWeight: 900 }}>{idx + 1}</span>
                      {roadAddr} {zipNo && <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 'normal' }}>({zipNo})</span>}
                    </span>
                    {jibunAddr && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', marginTop: '0.1rem', textAlign: 'left' }}>
                        [지번] {jibunAddr}
                      </span>
                    )}
                  </div>
                ), 'flex-start');
              })}
            </div>
          );
        }
        return (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', padding: '1rem', textAlign: 'center', fontStyle: 'italic' }}>
            검색 결과가 없습니다.
          </div>
        );
      }

      const items = getShortcutsData(field);
      const clientName = formData.clientName.trim();
      const matchedClient = clients.find(c => c.name.toLowerCase() === clientName.toLowerCase());
      const majorCount = matchedClient 
        ? ((field === 'destination' ? matchedClient.destinations : matchedClient.origins) || []).length 
        : 0;

      const majorItems = items.slice(0, majorCount);
      const recentItems = items.slice(majorCount);
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          height: '100%',
          overflow: 'hidden'
        }}>
          {/* 주요 상하차지 목록 (위쪽 50%) */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            overflowY: 'auto',
            minHeight: 0,
            paddingRight: '0.2rem'
          }} className="hide-scrollbar">
            <div style={{ 
              position: 'sticky', 
              top: 0, 
              backgroundColor: 'transparent', 
              zIndex: 1, 
              paddingBottom: '0.2rem',
              display: 'flex'
            }}>
              <span style={{ 
                fontSize: '0.74rem', 
                fontWeight: 800, 
                color: 'var(--text-secondary)',
                display: 'inline-block'
              }}>
                📍 즐겨찾기 ({formData.clientName || '거래처 전용'})
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {majorItems.map((loc, idx) => {
                const actualIdx = idx;
                return renderShortcutWrapper(actualIdx, (
                  <span key={actualIdx} style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {loc}
                  </span>
                ), 'flex-start');
              })}
              {majorItems.length === 0 && (
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
                  등록된 거래처 주요 상하차지 없음
                </div>
              )}
            </div>
          </div>
          
          {/* Divider */}
          <div style={{ borderTop: '1px dashed var(--border-color)', margin: '0.1rem 0', flexShrink: 0 }} />
          
          {/* 최근 이용 상하차지 목록 (아래쪽 50%) */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            overflowY: 'auto',
            minHeight: 0,
            paddingRight: '0.2rem'
          }} className="hide-scrollbar">
            <div style={{ 
              position: 'sticky', 
              top: 0, 
              backgroundColor: 'transparent',
              zIndex: 1, 
              paddingBottom: '0.2rem',
              display: 'flex'
            }}>
              <span style={{ 
                fontSize: '0.74rem', 
                fontWeight: 800, 
                color: 'var(--text-secondary)',
                display: 'inline-block'
              }}>
                ⚡ {field === 'destination' ? '하차지' : '상차지'} (1~3번)
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {recentItems.map((loc, idx) => {
                const actualIdx = majorCount + idx;
                return renderShortcutWrapper(actualIdx, (
                  <span key={actualIdx} style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    <span style={{ color: 'var(--primary)', marginRight: '0.5rem', fontWeight: 900 }}>{idx + 1}</span>
                    {loc}
                  </span>
                ), 'flex-start');
              })}
              {recentItems.length === 0 && (
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
                  최근 이용 내역 없음
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    if (field === 'originDate' || field === 'destinationDate') {
      const items = getShortcutsData(field);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {items.map((it, idx) => renderShortcutWrapper(idx, (
            <React.Fragment key={idx}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--primary)', marginRight: '0.5rem', fontWeight: 900 }}>{idx + 1}</span>
                {it}
              </span>
              {field === 'originDate' && it === '지금' && (
                <span style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                  (경유지 필요시 Shift+Enter)
                </span>
              )}
            </React.Fragment>
          )))}
        </div>
      );
    }
    if (field === 'tonnage' || field === 'carType' || field === 'weight' || field === 'settleMethod' || field === 'settleDate' || field === 'commission' || field === 'fee' || field === 'cargoItem' || field === 'memo') {
      const items = getShortcutsData(field);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {items.map((it, idx) => renderShortcutWrapper(idx, (
            <span key={idx} style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              <span style={{ color: 'var(--primary)', marginRight: '0.5rem', fontWeight: 900 }}>{idx + 1}</span>
              {it}
            </span>
          ), 'flex-start'))}
        </div>
      );
    }
    return null;
  };

  const renderConfirmScreen = () => {
    const activeWaypoints = (formData.waypoints || []).filter((w: string) => w.trim() !== '');

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        height: '100%'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          paddingBottom: '0.5rem',
          borderBottom: '2px solid var(--primary)'
        }}>
          <Check size={16} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            📝 배차 등록 내용 최종 확인
          </span>
        </div>

        {/* Ticket Box */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          padding: '0.85rem',
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          overflowY: 'auto'
        }} className="hide-scrollbar">
          {/* Client Block */}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.35rem', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>거래처명</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)' }}>{formData.clientName || '일반화주'}</span>
          </div>

          {/* Route Block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', paddingBottom: '0.35rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>상차지</span>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'right', maxWidth: '70%' }}>{formData.origin}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>└ 상차일시</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{formData.originDate || '즉시 상차'}</span>
            </div>

            {/* Waypoints */}
            {activeWaypoints.map((wp: string, idx: number) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '0.4rem' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>📍 경유지 {idx + 1}</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', textAlign: 'right', maxWidth: '70%' }}>{wp}</span>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.1rem' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>하차지</span>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'right', maxWidth: '70%' }}>{formData.destination}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>└ 하차일시</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{formData.destinationDate || '당일 하차'}</span>
            </div>
          </div>

          {/* Vehicle Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.35rem', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>차량 정보</span>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {formData.tonnage} / {formData.carType} {formData.weight ? `(${formData.weight})` : ''}
            </span>
          </div>

          {/* Cargo Item */}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.35rem', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>화물품목</span>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formData.cargoItem}</span>
          </div>

          {/* Fee & Settle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', paddingBottom: '0.35rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>정산방법 / 청구일</span>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formData.settleMethod} {formData.settleDate ? `/ ${formData.settleDate}` : ''}
              </span>
            </div>
            {formData.settleMethod !== '인수증' && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>└ 수수료</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--danger)', fontWeight: 600 }}>{formData.commission || '0'} 원</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.1rem' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)' }}>합계 운임료</span>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--primary)' }}>{formData.fee} 원</span>
            </div>
          </div>

          {/* Memo */}
          {formData.memo && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>메모</span>
              <div style={{
                padding: '0.35rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.68rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.3
              }}>
                {formData.memo}
              </div>
            </div>
          )}
        </div>

        {/* Submit Prompt Banner */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.2rem',
          padding: '0.65rem',
          backgroundColor: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--primary)' }}>
            🚀 등록하려면 Enter 키를 누르세요.
          </span>
          <span style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)' }}>
            (수정하려면 Shift+Backspace로 이전 단계 이동)
          </span>
        </div>
      </div>
    );
  };

  const handleStepClick = (idx: number) => {
    setKeyboardStep(idx);
    setKeyboardInputValue('');
    setTimeout(() => {
      const input = document.getElementById('keyboard-mode-input');
      if (input) input.focus();
    }, 50);
  };

  const renderKeyboardHelper = () => {
    return (
      <div style={{ display: 'flex', gap: '1rem', flex: 1, overflow: 'hidden', marginTop: '0.2rem' }}>
        {/* Left Column: Progress checklist (42% width) */}
        <div style={{
          width: '42%',
          borderRight: '1px solid var(--border-color)',
          paddingRight: '0.5rem',
          paddingTop: '0.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.1rem',
          overflowY: 'auto'
        }} className="hide-scrollbar">
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>📌 등록 단계</span>
          {(() => {
            const groups = [
              {
                name: '의뢰처 정보',
                fields: ['clientName']
              },
              {
                name: '상/하차 및 경로',
                fields: ['origin', 'originDate', 'waypoint_0', 'waypoint_1', 'waypoint_2', 'destination', 'destinationDate']
              },
              {
                name: '차량 및 화물 정보',
                fields: ['tonnage', 'carType', 'weight']
              },
              {
                name: '정산 정보',
                fields: ['settleMethod', 'settleDate', 'commission', 'fee']
              },
              {
                name: '기타 정보',
                fields: ['cargoItem', 'memo', 'confirm']
              }
            ];

            return groups.map((group, gIdx) => {
              const groupSteps = keyboardSteps
                .map((step, idx) => ({ ...step, originalIdx: idx }))
                .filter(step => {
                  if (!group.fields.includes(step.field)) return false;
                  const isActive = step.originalIdx === keyboardStep;
                  if (step.field.startsWith('waypoint_')) {
                    const wIdx = parseInt(step.field.split('_')[1], 10);
                    const hasValue = !!(formData.waypoints && formData.waypoints[wIdx]);
                    if (!isActive && !hasValue) {
                      return false;
                    }
                  }
                  return true;
                });

              if (groupSteps.length === 0) return null;

              return (
                <div key={gIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.08rem', marginBottom: '0.2rem' }}>
                  <div style={{
                    fontSize: '0.64rem',
                    fontWeight: 800,
                    color: 'var(--text-tertiary)',
                    marginTop: '0.05rem',
                    marginBottom: '0.05rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}>
                    <span>{group.name}</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(0,0,0,0.06)' }} />
                  </div>
                  {groupSteps.map((step) => {
                    const idx = step.originalIdx;
                    const isActive = idx === keyboardStep;
                    const stepValue = getStepValueString(step.field);
                    const isFilled = !!stepValue;

                    return (
                      <div
                        key={idx}
                        onClick={() => handleStepClick(idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.14rem 0.35rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                          border: isActive ? '1px solid var(--primary)' : '1px solid transparent',
                          transition: 'all var(--transition-fast)',
                          opacity: isActive || isFilled ? 1 : 0.5,
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%',
                          gap: '0.4rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0, flexShrink: 0 }}>
                            {isFilled ? (
                              <Check size={12} style={{ color: 'var(--success)', flexShrink: 0 }} />
                            ) : isActive ? (
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', boxShadow: '0 0 4px var(--primary)', flexShrink: 0 }} />
                            ) : (
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1.5px solid var(--text-tertiary)', flexShrink: 0 }} />
                            )}
                            <span style={{
                              fontSize: '0.74rem',
                              fontWeight: isActive ? 800 : 600,
                              color: isActive ? 'var(--primary)' : (isFilled ? 'var(--text-primary)' : 'var(--text-secondary)'),
                              whiteSpace: 'nowrap'
                            }}>
                              {step.name}
                            </span>
                          </div>
                          {stepValue && (
                            <span style={{
                              fontSize: '0.72rem',
                              color: isActive ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                              fontWeight: isActive ? 700 : 'normal',
                              textAlign: 'right',
                              marginLeft: 'auto',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              maxWidth: '220px'
                            }} title={stepValue}>
                              {stepValue}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            });
          })()}
        </div>

        {/* Right Column: Shortcuts lists (58% width) */}
        <div style={{
          width: '58%',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          border: theme.border,
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem',
          backgroundColor: theme.backgroundColor,
          overflowY: 'auto'
        }} className="hide-scrollbar">
          {stepField === 'confirm' ? (
            renderConfirmScreen()
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                  ⚡ {stepField === 'clientName' && keyboardInputValue.trim() !== '' 
                    ? `${currentStep.name} 검색 결과` 
                    : (isAddressField(keyboardStep) && keyboardInputValue.trim() !== '' && jusoResults.length > 0 
                      ? `${currentStep.name} 검색 결과` 
                      : (isAddressField(keyboardStep) ? `최근 이용 ${currentStep.name}` : currentStep.name))}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                  (번호 입력 + Enter)
                </span>
              </div>
              {renderKeyboardShortcuts(stepField)}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflow: 'hidden' }}>
      {/* Guided Input Box */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1.5px solid var(--primary)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 0.95rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        boxShadow: '0 4px 12px rgba(49, 130, 246, 0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)' }}>
            {stepField === 'confirm' ? '👉 배차 등록 승인 대기' : `👉 ${currentStep ? currentStep.name : ''} 입력 차례`}
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
            (이전 단계로 가려면 Shift+Backspace 입력)
          </span>
        </div>
        <Input
          id="keyboard-mode-input"
          type="text"
          placeholder={currentStep ? currentStep.guide : ''}
          value={stepField === 'confirm' ? 'ENTER 키를 눌러 배차 등록 완료' : keyboardInputValue}
          onChange={(e) => {
            if (stepField !== 'confirm') {
              setKeyboardInputValue(e.target.value);
            }
          }}
          onKeyDown={handleKeyboardStepEnter}
          onKeyUp={handleKeyboardInputKeyDown}
          readOnly={stepField === 'confirm'}
          style={{
            height: '40px',
            fontSize: '0.9rem',
            fontWeight: 700,
            borderColor: 'var(--primary)',
            boxShadow: '0 0 0 2px var(--primary-light)',
            backgroundColor: stepField === 'confirm' ? 'rgba(59, 130, 246, 0.08)' : undefined,
            color: stepField === 'confirm' ? 'var(--primary)' : undefined,
            textAlign: stepField === 'confirm' ? 'center' : undefined,
            cursor: stepField === 'confirm' ? 'default' : undefined
          }}
          autoComplete="off"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
          <span>
            {stepField === 'confirm' 
              ? '✅ 입력이 모두 끝났습니다. 내용을 검토한 후 등록하세요.'
              : (currentStep && currentStep.optional ? '✨ 이 항목은 필수값이 아닙니다. (엔터 시 스킵 가능)' : '⚠️ 이 항목은 필수입니다. (값을 반드시 입력하세요)')}
          </span>
          <span>완료: {keyboardStep}/{keyboardSteps.length}</span>
        </div>
      </div>

      {/* 2-Column Helper Panel */}
      {renderKeyboardHelper()}
    </div>
  );
};
