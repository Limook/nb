import React from 'react';
import { Input, Button } from '../../../components/ui';
import { Route, Search, Plus } from 'lucide-react';
import type { Client } from '../types';

export interface StandardRegisterFormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  errors: Record<string, boolean>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  clients: Client[];
  activeLocationListField: 'origin' | 'destination' | 'both' | null;
  setActiveLocationListField: (field: 'origin' | 'destination' | 'both' | null) => void;
  activePostcodeField: string | null;
  setActivePostcodeField: (field: string | null) => void;
  setShowClientSearch: (show: boolean) => void;
  setClientSearchTerm: (term: string) => void;
  setClientSearchFilter: (filter: string) => void;
  showWaypoints: boolean;
  setShowWaypoints: (show: boolean) => void;

  topRoutes: any[];
  topOrigins: string[];
  topDestinations: string[];
  topSpecs: { count: number; tonnage: string; carType: string; weight: string; isClientSpec?: boolean }[];
  recentFee: number | null;
  frequentFee: number | null;

  handleInputChange: (field: string, val: string) => void;
  handleRecommendClient: (name: string, phone: string, contact: string) => void;
  handleRecommendSpec: (tonnage: string, type: string, weight: string) => void;
  handleRecommendLocation: (field: 'origin' | 'destination', val: string) => void;
  handleRecommendRoute: (origin: string, destination: string) => void;
  handleDateShortcut: (field: 'originDate' | 'destinationDate' | 'settleDate', shortcut: string) => void;
}

const recommendationButtonStyle: React.CSSProperties = {
  padding: '0.2rem 0.5rem',
  fontSize: '0.72rem',
  backgroundColor: 'var(--bg-primary)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  fontWeight: 'bold',
  color: 'var(--text-secondary)'
};

const dateShortcutStyle: React.CSSProperties = {
  padding: '0.15rem 0.4rem',
  fontSize: '0.7rem',
  backgroundColor: 'var(--bg-secondary)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  color: 'var(--text-secondary)'
};

export const StandardRegisterForm: React.FC<StandardRegisterFormProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
  clients,
  activeLocationListField,
  setActiveLocationListField,
  activePostcodeField,
  setActivePostcodeField,
  setShowClientSearch,
  setClientSearchTerm,
  setClientSearchFilter,
  showWaypoints,
  setShowWaypoints,
  topRoutes,
  topOrigins,
  topDestinations,
  topSpecs,
  recentFee,
  frequentFee,
  handleInputChange,
  handleRecommendClient,
  handleRecommendSpec,
  handleRecommendLocation,
  handleRecommendRoute,
  handleDateShortcut
}) => {
  const embedPostcode = (el: HTMLDivElement | null, field: string) => {
    if (!el) return;
    const daum = (window as any).daum;
    if (daum && daum.Postcode) {
      new daum.Postcode({
        oncomplete: (data: any) => {
          const addr = data.roadAddress || data.address;
          if (field.startsWith('waypoint_')) {
            const wIdx = parseInt(field.split('_')[1], 10);
            setFormData((prev: any) => {
              const wps = [...(prev.waypoints || [])];
              wps[wIdx] = addr;
              return { ...prev, waypoints: wps };
            });
          } else {
            setFormData((prev: any) => ({ ...prev, [field]: addr }));
            setErrors((prev: any) => ({ ...prev, [field]: false }));
          }
          setActivePostcodeField(null);
        },
        width: '100%',
        height: '100%'
      }).embed(el);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
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
                onClick={() => handleRecommendClient(c.name, c.phone, c.contactName || '')} 
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
                    ref={(el) => embedPostcode(el, 'origin')}
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
              value={formData.originDate}
              onChange={e => handleInputChange('originDate', e.target.value)}
              style={{ fontSize: '0.85rem', padding: '0.52rem 0.75rem', height: '40px' }}
            />
          </div>
        </div>

        {/* Waypoints (경유지) Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '-0.3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
              📍 경유지 목록 {(formData.waypoints || []).length > 0 && `(${(formData.waypoints || []).length}개)`}
            </span>
            <Button
              type="button"
              variant="secondary"
              style={{ padding: '0.15rem 0.45rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.2rem', height: 'auto' }}
              onClick={() => {
                if (!showWaypoints) {
                  setShowWaypoints(true);
                } else if ((formData.waypoints || []).length < 3) {
                  setFormData((prev: any) => ({ ...prev, waypoints: [...(prev.waypoints || []), ''] }));
                }
              }}
              disabled={showWaypoints && (formData.waypoints || []).length >= 3}
            >
              <Plus size={12} /> 경유지 추가 (최대 3개)
            </Button>
          </div>

          {showWaypoints && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', backgroundColor: 'var(--bg-secondary)', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              {((formData.waypoints || []).length === 0 ? [''] : formData.waypoints).map((wp: string, wpIdx: number) => (
                <div key={wpIdx} style={{ display: 'grid', gridTemplateColumns: '1fr 32px', gap: '0.4rem', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <Input
                      style={{ fontSize: '0.8rem', padding: '0.45rem 0.65rem', height: '36px', cursor: 'pointer' }}
                      placeholder={`경유지 ${wpIdx + 1} 검색`}
                      value={wp}
                      onClick={() => setActivePostcodeField(`waypoint_${wpIdx}`)}
                      readOnly
                    />
                    {activePostcodeField === `waypoint_${wpIdx}` && (
                      <>
                        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} onClick={() => setActivePostcodeField(null)} />
                        <div 
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            height: '250px',
                            border: '1.5px solid var(--primary)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-lg)',
                            backgroundColor: 'var(--bg-secondary)',
                            zIndex: 1000,
                            marginTop: '0.25rem',
                            overflow: 'hidden'
                          }}
                          ref={(el) => embedPostcode(el, `waypoint_${wpIdx}`)}
                        />
                      </>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    style={{ padding: 0, height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                    onClick={() => {
                      setFormData((prev: any) => {
                        const updated = (prev.waypoints || []).filter((_: any, idx: number) => idx !== wpIdx);
                        return { ...prev, waypoints: updated };
                      });
                      if ((formData.waypoints || []).length <= 1) {
                        setShowWaypoints(false);
                      }
                    }}
                  >
                    &times;
                  </Button>
                </div>
              ))}
            </div>
          )}
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
                    ref={(el) => embedPostcode(el, 'destination')}
                  />
                </>
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
              value={formData.destinationDate}
              onChange={e => handleInputChange('destinationDate', e.target.value)}
              style={{ fontSize: '0.85rem', padding: '0.52rem 0.75rem', height: '40px' }}
            />
          </div>
        </div>

      </div>

      {/* 3. 차량 정보 */}
      <div className="dispatch-registration-section" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.15rem', marginTop: '0.25rem' }}>
        
        {/* 자주 쓰는 차량 규격 추천 칩 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <label className="text-sm font-bold text-secondary" style={{ flexShrink: 0 }}>자주 쓰는 차량</label>
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
                style={{ 
                  ...recommendationButtonStyle, 
                  flexShrink: 0,
                  border: spec.isClientSpec ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: spec.isClientSpec ? 'var(--primary-light)' : 'var(--bg-primary)',
                  color: spec.isClientSpec ? 'var(--primary)' : 'var(--text-secondary)'
                }}
              >
                {spec.tonnage} {spec.carType}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label className="text-sm font-bold text-secondary block" style={{ marginBottom: '0.25rem' }}>톤급 <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select 
              value={formData.tonnage} 
              onChange={e => handleInputChange('tonnage', e.target.value)}
              style={{ 
                width: '100%', 
                height: '40px', 
                borderRadius: 'var(--radius-md)', 
                border: '1.5px solid ' + (errors.tonnage ? 'var(--danger)' : 'var(--border-color)'), 
                backgroundColor: 'var(--bg-primary)', 
                color: 'var(--text-primary)', 
                padding: '0 0.5rem', 
                fontSize: '0.82rem',
                fontWeight: 700,
                boxShadow: errors.tonnage ? '0 0 0 2px var(--danger-bg)' : 'none'
              }}
            >
              <option value="">선택</option>
              <option value="1톤">1톤</option>
              <option value="1.4톤">1.4톤</option>
              <option value="2.5톤">2.5톤</option>
              <option value="3.5톤">3.5톤</option>
              <option value="5톤">5톤</option>
              <option value="8톤">8톤</option>
              <option value="11톤">11톤</option>
              <option value="15톤">15톤</option>
              <option value="18톤">18톤</option>
              <option value="25톤">25톤</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-secondary block" style={{ marginBottom: '0.25rem' }}>차종 <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select 
              value={formData.carType} 
              onChange={e => handleInputChange('carType', e.target.value)}
              style={{ 
                width: '100%', 
                height: '40px', 
                borderRadius: 'var(--radius-md)', 
                border: '1.5px solid ' + (errors.carType ? 'var(--danger)' : 'var(--border-color)'), 
                backgroundColor: 'var(--bg-primary)', 
                color: 'var(--text-primary)', 
                padding: '0 0.5rem', 
                fontSize: '0.82rem',
                fontWeight: 700,
                boxShadow: errors.carType ? '0 0 0 2px var(--danger-bg)' : 'none'
              }}
            >
              <option value="">선택</option>
              <option value="카고">카고</option>
              <option value="윙바디">윙바디</option>
              <option value="탑">탑</option>
              <option value="리프트">리프트</option>
              <option value="호루">호루</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-secondary block" style={{ marginBottom: '0.25rem' }}>실중량</label>
            <Input 
              placeholder="예: 5톤 또는 5T" 
              value={formData.weight}
              onChange={e => handleInputChange('weight', e.target.value)}
              style={{ fontSize: '0.85rem', padding: '0.52rem 0.75rem', height: '40px' }}
            />
          </div>
        </div>
      </div>

      {/* 4. 운임 및 청구 정산 */}
      <div className="dispatch-registration-section" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.15rem', marginTop: '0.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <label className="text-sm font-bold text-secondary block">운임 <span style={{ color: 'var(--danger)' }}>*</span></label>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {recentFee && (
                  <button type="button" onClick={() => handleInputChange('fee', String(recentFee))} style={recommendationButtonStyle}>최근: {recentFee.toLocaleString()}</button>
                )}
                {frequentFee && (
                  <button type="button" onClick={() => handleInputChange('fee', String(frequentFee))} style={recommendationButtonStyle}>최다: {frequentFee.toLocaleString()}</button>
                )}
              </div>
            </div>
            <Input 
              placeholder="금액 (원)" 
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
          <div>
            <label className="text-sm font-bold text-secondary block" style={{ marginBottom: '0.25rem' }}>정산방법</label>
            <select 
              value={formData.settleMethod} 
              onChange={e => handleInputChange('settleMethod', e.target.value)}
              style={{ width: '100%', height: '40px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '0 0.5rem', fontSize: '0.82rem', fontWeight: 700 }}
            >
              <option value="인수증">인수증</option>
              <option value="선불">선불</option>
              <option value="착불">착불</option>
              <option value="카드">카드</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-secondary block" style={{ marginBottom: '0.25rem' }}>수수료</label>
            <Input 
              placeholder="수수료액 (원)" 
              value={formData.commission}
              onChange={e => handleInputChange('commission', e.target.value)}
              disabled={formData.settleMethod === '인수증'}
              style={{ fontSize: '0.85rem', padding: '0.52rem 0.75rem', height: '40px' }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <label className="text-sm font-bold text-secondary block">정산예정일</label>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {['익월말', '당월말'].map(s => (
                  <button key={s} type="button" onClick={() => handleDateShortcut('settleDate', s)} style={dateShortcutStyle}>{s}</button>
                ))}
              </div>
            </div>
            <Input 
              type="date"
              value={formData.settleDate}
              onChange={e => handleInputChange('settleDate', e.target.value)}
              style={{ fontSize: '0.85rem', padding: '0.52rem 0.75rem', height: '40px' }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <label className="text-sm font-bold text-secondary block">화물품목</label>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {(() => {
                  const selectedClient = clients.find(c => c.name.trim() === formData.clientName.trim());
                  const clientItems = selectedClient && selectedClient.items ? selectedClient.items : [];
                  const suggestions = clientItems.length > 0 
                    ? [...clientItems, ...['철강', '기계', '박스', '빠레트'].filter(d => !clientItems.includes(d))].slice(0, 5)
                    : ['철강', '기계', '박스', '빠레트'];
                  return suggestions.map(s => (
                    <button key={s} type="button" onClick={() => handleInputChange('cargoItem', s)} style={recommendationButtonStyle}>{s}</button>
                  ));
                })()}
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
    </div>
  );
};
