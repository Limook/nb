import React from 'react';
import { Input } from '../../../components/ui';
import { Check } from 'lucide-react';
import type { Dispatch, KeyboardStep } from '../types';

export interface KeyboardRegisterPanelProps {
  // From useDispatchKeyboard hook
  formData: any;
  keyboardStep: number;
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
  dispatches: Dispatch[];
}

export const KeyboardRegisterPanel: React.FC<KeyboardRegisterPanelProps> = ({
  formData,
  keyboardStep,
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
  dispatches
}) => {
  const currentStep = keyboardSteps[keyboardStep];
  const stepField = currentStep ? currentStep.field : '';



  const renderShortcutWrapper = (idx: number, children: React.ReactNode, justify = 'space-between') => {
    const isHighlighted = idx === keyboardShortcutHighlightIndex;
    return (
      <div
        key={idx}
        className="keyboard-shortcut-item"
        onClick={() => handleSelectShortcutByIndex(idx)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: justify,
          padding: '0.55rem 0.75rem',
          backgroundColor: isHighlighted ? 'rgba(49, 130, 246, 0.12)' : 'var(--bg-secondary)',
          border: isHighlighted ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          boxShadow: isHighlighted ? '0 2px 6px rgba(49, 130, 246, 0.15)' : 'none',
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
                <span style={{ color: 'var(--primary)', marginRight: '0.5rem', fontWeight: 900 }}>{idx + 1}</span>
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
    if (field === 'origin' || field.startsWith('waypoint_')) {
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
      const recentOrigins = Array.from(new Set([
        ...dispatches.map(d => d.origin),
        ...dispatches.map(d => d.destination),
        ...(dispatches.flatMap(d => d.waypoints || []))
      ])).filter(Boolean).slice(0, 6);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {recentOrigins.map((loc, idx) => renderShortcutWrapper(idx, (
            <span key={idx} style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              <span style={{ color: 'var(--primary)', marginRight: '0.5rem', fontWeight: 900 }}>{idx + 1}</span>
              {loc}
            </span>
          ), 'flex-start'))}
          {recentOrigins.length === 0 && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
              최근 이용 주소 없음
            </div>
          )}
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
    if (field === 'destination') {
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
      const recentDests = Array.from(new Set(dispatches.map(d => d.destination))).slice(0, 6);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {recentDests.map((loc, idx) => renderShortcutWrapper(idx, (
            <span key={idx} style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              <span style={{ color: 'var(--primary)', marginRight: '0.5rem', fontWeight: 900 }}>{idx + 1}</span>
              {loc}
            </span>
          ), 'flex-start'))}
          {recentDests.length === 0 && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
              최근 이용 하차지 없음
            </div>
          )}
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
                    const isCompleted = idx < keyboardStep;
                    const stepValue = getStepValueString(step.field);

                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.14rem 0.35rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                          border: isActive ? '1px solid var(--primary)' : '1px solid transparent',
                          transition: 'all var(--transition-fast)',
                          opacity: isActive || isCompleted ? 1 : 0.5
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
                            {isCompleted ? (
                              <Check size={12} style={{ color: 'var(--success)', flexShrink: 0 }} />
                            ) : isActive ? (
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', boxShadow: '0 0 4px var(--primary)', flexShrink: 0 }} />
                            ) : (
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1.5px solid var(--text-tertiary)', flexShrink: 0 }} />
                            )}
                            <span style={{
                              fontSize: '0.74rem',
                              fontWeight: isActive ? 800 : 600,
                              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                              whiteSpace: 'nowrap'
                            }}>
                              {step.name}
                            </span>
                          </div>
                          {isCompleted && stepValue && (
                            <span style={{
                              fontSize: '0.72rem',
                              color: 'var(--text-primary)',
                              fontWeight: 700,
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
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem',
          backgroundColor: 'var(--bg-secondary)',
          overflowY: 'auto'
        }} className="hide-scrollbar">
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
            👉 {currentStep ? currentStep.name : ''} 입력 차례
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
            (이전 단계로 가려면 Shift+Backspace 입력)
          </span>
        </div>
        <Input
          id="keyboard-mode-input"
          type="text"
          placeholder={currentStep ? currentStep.guide : ''}
          value={keyboardInputValue}
          onChange={(e) => setKeyboardInputValue(e.target.value)}
          onKeyDown={handleKeyboardStepEnter}
          onKeyUp={handleKeyboardInputKeyDown}
          style={{
            height: '40px',
            fontSize: '0.9rem',
            fontWeight: 700,
            borderColor: 'var(--primary)',
            boxShadow: '0 0 0 2px var(--primary-light)'
          }}
          autoComplete="off"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
          <span>{currentStep && currentStep.optional ? '✨ 이 항목은 필수값이 아닙니다. (엔터 시 스킵 가능)' : '⚠️ 이 항목은 필수입니다. (값을 반드시 입력하세요)'}</span>
          <span>완료: {keyboardStep}/{keyboardSteps.length}</span>
        </div>
      </div>

      {/* 2-Column Helper Panel */}
      {renderKeyboardHelper()}
    </div>
  );
};
