import React from 'react';
import { Input, Button } from '../../../components/ui';
import { Search } from 'lucide-react';

export interface DispatchFiltersProps {
  dateFilterType: string;
  setDateFilterType: (type: string) => void;
  customStartDate: string;
  setCustomStartDate: (val: string) => void;
  customEndDate: string;
  setCustomEndDate: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setSearchFilter: (filter: string) => void;
  getDateCount: (type: string) => number;
  getStatusCount: (status: string) => number;
  handleResetFilters: () => void;
}

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
});

export const DispatchFilters: React.FC<DispatchFiltersProps> = ({
  dateFilterType,
  setDateFilterType,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
  setSearchFilter,
  getDateCount,
  getStatusCount,
  handleResetFilters
}) => {
  return (
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
  );
};
