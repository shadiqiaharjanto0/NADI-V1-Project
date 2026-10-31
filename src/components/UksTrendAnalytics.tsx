import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Users,
  Download,
} from 'lucide-react';

interface MonthlyData {
  month: string;
  monthFull: string;
  ispa: number;
  pencernaan: number;
  kulit: number;
  cedera: number;
  kelelahan: number;
  total: number;
}

const RAW_MONTHLY_DATA: MonthlyData[] = [
  { month: 'Mei', monthFull: 'Mei 2024', ispa: 28, pencernaan: 18, kulit: 14, cedera: 12, kelelahan: 20, total: 92 },
  { month: 'Jun', monthFull: 'Juni 2024 (Ujian & Libur)', ispa: 19, pencernaan: 15, kulit: 10, cedera: 8, kelelahan: 25, total: 77 },
  { month: 'Jul', monthFull: 'Juli 2024 (Siswa Baru Masuk Asrama)', ispa: 34, pencernaan: 22, kulit: 38, cedera: 14, kelelahan: 19, total: 127 },
  { month: 'Agu', monthFull: 'Agustus 2024 (Kegiatan HUT RI & MOS)', ispa: 41, pencernaan: 27, kulit: 32, cedera: 26, kelelahan: 24, total: 150 },
  { month: 'Sep', monthFull: 'September 2024 (Pancaroba)', ispa: 46, pencernaan: 20, kulit: 21, cedera: 16, kelelahan: 28, total: 131 },
  { month: 'Okt', monthFull: 'Oktober 2024 (PTS Semester Ganjil)', ispa: 39, pencernaan: 24, kulit: 18, cedera: 15, kelelahan: 36, total: 132 },
];

const CATEGORY_CONFIG: Record<string, { label: string; color: string; desc: string }> = {
  ispa: { label: 'ISPA & Flu / Batuk', color: '#0071E3', desc: 'Infeksi pernapasan, demam, radang tenggorokan' },
  pencernaan: { label: 'Pencernaan & Maag', color: '#6E6E73', desc: 'Dispepsia, telat makan siswa/siswi, gastroenteritis' },
  kulit: { label: 'Kulit & Skabies Asrama', color: '#0F172A', desc: 'Kudis siswa/siswi, alergi kasur, infeksi tungau' },
  cedera: { label: 'Cedera Olahraga & Fisik', color: '#E11D48', desc: 'Keseleo, luka gores, trauma olahraga sore' },
  kelelahan: { label: 'Kelelahan & Cephalea', color: '#B45309', desc: 'Kurang tidur, sakit kepala tegangan' },
};

export const UksTrendAnalytics: React.FC = () => {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'6m' | '3m'>('6m');

  const filteredData = useMemo(() => {
    return timeRange === '3m' ? RAW_MONTHLY_DATA.slice(-3) : RAW_MONTHLY_DATA;
  }, [timeRange]);

  const totalVisits = useMemo(() => {
    return filteredData.reduce((acc, curr) => {
      if (selectedCategory === 'all') return acc + curr.total;
      return acc + ((curr[selectedCategory as keyof MonthlyData] as number) || 0);
    }, 0);
  }, [filteredData, selectedCategory]);

  const avgPerMonth = Math.round(totalVisits / filteredData.length);

  const peakMonth = useMemo(() => {
    return filteredData.reduce((prev, current) => {
      const prevVal = selectedCategory === 'all' ? prev.total : (prev[selectedCategory as keyof MonthlyData] as number);
      const currVal = selectedCategory === 'all' ? current.total : (current[selectedCategory as keyof MonthlyData] as number);
      return currVal > prevVal ? current : prev;
    }, filteredData[0]);
  }, [filteredData, selectedCategory]);

  const lastMonth = filteredData[filteredData.length - 1];
  const prevMonth = filteredData[filteredData.length - 2];
  const lastMonthTotal = selectedCategory === 'all' ? lastMonth.total : (lastMonth[selectedCategory as keyof MonthlyData] as number);
  const prevMonthTotal = prevMonth ? (selectedCategory === 'all' ? prevMonth.total : (prevMonth[selectedCategory as keyof MonthlyData] as number)) : lastMonthTotal;
  const trendPercent = prevMonthTotal ? Math.round(((lastMonthTotal - prevMonthTotal) / prevMonthTotal) * 100) : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const monthObj = filteredData.find((d) => d.month === label);
      const totalInMonth = monthObj ? monthObj.total : 0;
      return (
        <div className="bg-zinc-900 text-white p-3 rounded-xl shadow-xl border border-zinc-800 text-xs min-w-[200px]">
          <p className="font-semibold text-xs text-zinc-200 mb-1 border-b border-zinc-800 pb-1">
            {monthObj?.monthFull || label}
          </p>
          <div className="space-y-1 my-2">
            {payload.map((item: any) => (
              <div key={item.name} className="flex justify-between items-center gap-3">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                  {item.name}:
                </span>
                <span className="font-mono font-semibold text-white tabular-nums">{item.value} siswa</span>
              </div>
            ))}
          </div>
          {selectedCategory === 'all' && (
            <div className="pt-1.5 border-t border-zinc-800 flex justify-between font-semibold text-zinc-200 font-mono">
              <span>Total Kunjungan:</span>
              <span className="tabular-nums">{totalInMonth} siswa</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-zinc-100 text-zinc-800 rounded-lg">
              <Activity className="w-5 h-5 text-[#0071E3]" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">Visualisasi & Tren Kunjungan UKS</h2>
              <p className="text-xs text-zinc-500">
                Surveilans epidemiologi berkala berdasarkan kategori keluhan siswa/siswi asrama
              </p>
            </div>
          </div>
        </div>

        {/* View Toggle (Bar vs Line) */}
        <div className="flex items-center gap-2">
          <div className="flex bg-zinc-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                chartType === 'bar' ? 'bg-white text-zinc-900 font-semibold shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Batang Bertumpuk
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                chartType === 'line' ? 'bg-white text-zinc-900 font-semibold shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Garis Tren
            </button>
          </div>

          <div className="flex bg-zinc-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setTimeRange('6m')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                timeRange === '6m' ? 'bg-white text-zinc-900 font-semibold shadow-xs' : 'text-zinc-600'
              }`}
            >
              6 Bulan
            </button>
            <button
              onClick={() => setTimeRange('3m')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                timeRange === '3m' ? 'bg-white text-zinc-900 font-semibold shadow-xs' : 'text-zinc-600'
              }`}
            >
              3 Bulan
            </button>
          </div>
        </div>
      </div>

      {/* Auto Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Total Kunjungan ({timeRange === '6m' ? '6 Bulan' : '3 Bulan'})</span>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-bold font-mono text-zinc-900 tabular-nums">{totalVisits}</span>
            <span className="text-xs text-zinc-500">siswa/siswi tercatat</span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono">
            Rata-rata: {avgPerMonth} siswa per bulan
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Bulan Puncak Kunjungan</span>
            <Calendar className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-bold font-mono text-zinc-900 tabular-nums">
              {peakMonth.month}
            </span>
            <span className="text-xs text-zinc-500">
              ({selectedCategory === 'all' ? peakMonth.total : (peakMonth[selectedCategory as keyof MonthlyData] as number)} siswa)
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 truncate">
            {peakMonth.monthFull}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Perkembangan Tren Terkini</span>
            <Activity className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="flex items-baseline gap-2 pt-1 font-mono">
            <span className={`text-2xl font-bold tabular-nums ${trendPercent > 0 ? 'text-zinc-900' : 'text-zinc-900'}`}>
              {trendPercent > 0 ? `+${trendPercent}%` : `${trendPercent}%`}
            </span>
            <span className="text-xs text-zinc-500">dibanding bulan lalu</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            {trendPercent > 0 ? 'Kunjungan meningkat stabil' : 'Kunjungan relatif terkendali'}
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-zinc-900 text-white font-semibold'
              : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200'
          }`}
        >
          Semua Kategori (Akumulasi)
        </button>

        {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              selectedCategory === key
                ? 'bg-zinc-900 text-white font-semibold'
                : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: cfg.color }} />
            <span>{cfg.label}</span>
          </button>
        ))}
      </div>

      {/* Chart Canvas */}
      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5EA" />
                <XAxis dataKey="month" stroke="#8E8E93" tick={{ fontSize: 12 }} />
                <YAxis stroke="#8E8E93" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />

                {selectedCategory === 'all' ? (
                  <>
                    <Bar dataKey="ispa" name="ISPA & Flu" stackId="a" fill={CATEGORY_CONFIG.ispa.color} radius={[0, 0, 0, 0]} />
                    <Bar dataKey="pencernaan" name="Pencernaan / Maag" stackId="a" fill={CATEGORY_CONFIG.pencernaan.color} />
                    <Bar dataKey="kulit" name="Kulit & Skabies" stackId="a" fill={CATEGORY_CONFIG.kulit.color} />
                    <Bar dataKey="cedera" name="Cedera Olahraga" stackId="a" fill={CATEGORY_CONFIG.cedera.color} />
                    <Bar dataKey="kelelahan" name="Kelelahan & Sakit Kepala" stackId="a" fill={CATEGORY_CONFIG.kelelahan.color} radius={[4, 4, 0, 0]} />
                  </>
                ) : (
                  <Bar
                    dataKey={selectedCategory}
                    name={CATEGORY_CONFIG[selectedCategory]?.label}
                    fill={CATEGORY_CONFIG[selectedCategory]?.color}
                    radius={[4, 4, 0, 0]}
                  />
                )}
              </BarChart>
            ) : (
              <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5EA" />
                <XAxis dataKey="month" stroke="#8E8E93" tick={{ fontSize: 12 }} />
                <YAxis stroke="#8E8E93" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />

                {selectedCategory === 'all' ? (
                  <>
                    <Line type="monotone" dataKey="ispa" name="ISPA & Flu" stroke={CATEGORY_CONFIG.ispa.color} strokeWidth={2.5} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="pencernaan" name="Pencernaan / Maag" stroke={CATEGORY_CONFIG.pencernaan.color} strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="kulit" name="Kulit & Skabies" stroke={CATEGORY_CONFIG.kulit.color} strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="cedera" name="Cedera Olahraga" stroke={CATEGORY_CONFIG.cedera.color} strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="kelelahan" name="Kelelahan & Sakit Kepala" stroke={CATEGORY_CONFIG.kelelahan.color} strokeWidth={2} dot={{ r: 4 }} />
                  </>
                ) : (
                  <Line
                    type="monotone"
                    dataKey={selectedCategory}
                    name={CATEGORY_CONFIG[selectedCategory]?.label}
                    stroke={CATEGORY_CONFIG[selectedCategory]?.color}
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Clinical Epidemiological Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
          <h4 className="font-semibold text-zinc-900 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-[#0071E3]" />
            <span>Korelasi Jadwal Asrama & Pola Sakit Siswa/Siswi</span>
          </h4>
          <p className="text-zinc-600 leading-relaxed">
            Lonjakan kasus <strong>Kulit/Skabies</strong> terjadi pada <strong>Juli (38 siswa)</strong> bertepatan dengan kedatangan siswa baru kelas X (Astra 3 & Astri 3). Sedangkan keluhan <strong>Kelelahan & Sakit Kepala</strong> memuncak pada <strong>Oktober (36 siswa)</strong> menjelang Penilaian Tengah Semester (PTS).
          </p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
          <h4 className="font-semibold text-zinc-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Rekomendasi Tindakan Preventif UKS</span>
          </h4>
          <p className="text-zinc-600 leading-relaxed">
            Perlu sosialisasi cuci sprei serentak dengan air panas di gedung Astra 1-3 dan Astri 1-3 setiap 2 pekan, serta pemantauan jam tidur malam siswa/siswi oleh Pembina Asrama.
          </p>
        </div>
      </div>
    </div>
  );
};
