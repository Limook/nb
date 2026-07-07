import { Card, Button, Input, Badge } from '../components/ui'
import { Search, FileText } from 'lucide-react'

const dummySettlements = [
  { id: 1, date: '2026-07-01', client: 'A물산', origin: '서울', dest: '부산', clientFee: 450000, clientStatus: '완료', driver: '이차주', driverFee: 400000, driverStatus: '미지급' },
  { id: 2, date: '2026-07-02', client: 'B로지스', origin: '평택', dest: '천안', clientFee: 300000, clientStatus: '미수금', driver: '박기사', driverFee: 260000, driverStatus: '완료' },
  { id: 3, date: '2026-07-03', client: 'C유통', origin: '인천', dest: '김포', clientFee: 80000, clientStatus: '완료', driver: '김외부', driverFee: 70000, driverStatus: '완료' },
]

export default function Settlements() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="text-2xl font-bold">정산 관리</h2>
          <p className="text-secondary mt-1 text-sm">화주로부터의 매출 수금 및 차주에 대한 매입 지급 내역을 대조·관리합니다.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <Button variant="outline" style={{ padding: '0.75rem 1.25rem' }}><FileText size={18} /> 엑셀 다운로드</Button>
          <Button variant="primary" style={{ padding: '0.75rem 1.25rem' }}>정산 마감</Button>
        </div>
      </div>

      {/* Modern Card Stats Dashboard */}
      <div className="settlements-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        <Card style={{ padding: '2rem', border: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>당월 미수금 (화주)</h3>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)', margin: 0, lineHeight: 1.1 }}>300,000 원</p>
        </Card>
        <Card style={{ padding: '2rem', border: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>당월 미지급금 (차주)</h3>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)', margin: 0, lineHeight: 1.1 }}>400,000 원</p>
        </Card>
        <Card style={{ padding: '2rem', border: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>당월 예상 수익</h3>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success-text)', margin: 0, lineHeight: 1.1 }}>100,000 원</p>
        </Card>
      </div>

      <Card className="responsive-filter-bar" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', border: 'none' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <Input style={{ paddingLeft: '2.75rem' }} placeholder="거래처 또는 차주명 검색" />
        </div>
        <select 
          style={{ 
            padding: '0.75rem 1rem', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid transparent', 
            backgroundColor: 'var(--bg-primary)', 
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          onFocus={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
            e.currentTarget.style.borderColor = 'var(--primary)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <option value="">전체 정산 상태</option>
          <option value="미수">미수금</option>
          <option value="미지급">미지급금</option>
          <option value="완료">정산완료</option>
        </select>
        <Button variant="secondary" style={{ padding: '0.75rem 1.5rem' }}>검색</Button>
      </Card>

      <Card style={{ flex: 1, overflowY: 'auto', border: 'none' }}>
        <div className="responsive-table-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>운행일자</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>화주</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>청구금액(수금)</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>수금상태</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>차주</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>지급금액(지급)</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>지급상태</th>
              </tr>
            </thead>
            <tbody>
              {dummySettlements.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color var(--transition-fast)' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{item.date}</td>
                  <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700 }}>{item.client}</td>
                  <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.clientFee.toLocaleString()}원</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <Badge color={item.clientStatus === '완료' ? 'success' : 'danger'}>{item.clientStatus}</Badge>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700 }}>{item.driver}</td>
                  <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.driverFee.toLocaleString()}원</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <Badge color={item.driverStatus === '완료' ? 'success' : 'warning'}>{item.driverStatus}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
