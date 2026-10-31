import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  X,
  FileText,
} from 'lucide-react';
import { EDUCATION_ARTICLES } from '../data/educationData';
import { EducationArticle } from '../types';

interface EducationViewProps {
  onAskNadi: (promptText: string) => void;
}

export const EducationView: React.FC<EducationViewProps> = ({ onAskNadi }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeArticle, setActiveArticle] = useState<EducationArticle | null>(null);

  const categories = [
    'Semua',
    'Kesehatan Kulit',
    'Penyakit Menular Asrama',
    'Pencernaan & Nutrisi',
    'Kesehatan Siswi',
    'Pertolongan Pertama',
    'Kesehatan Mental & Tidur',
  ];

  const filteredArticles = EDUCATION_ARTICLES.filter((article) => {
    const matchesCategory =
      selectedCategory === 'Semua' || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAskAboutArticle = (art: EducationArticle) => {
    const prompt = `Halo NADI, saya sedang membaca panduan edukasi tentang "${art.title}". Bisakah kamu jelaskan tips praktis pencegahannya untuk kamar asrama kami?`;
    onAskNadi(prompt);
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6 no-print">
      {/* Header - Apple Minimalist */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 space-y-4">
        <div className="max-w-2xl space-y-1.5">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
            Pusat Edukasi & Pedoman Sanitasi Asrama
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900">
            Panduan Hidup Sehat & Pencegahan Penyakit Menular
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
            Standar Perilaku Hidup Bersih & Sehat (PHBS) berdasarkan pedoman Kemenkes RI, WHO, dan PAPDI untuk siswa/siswi boarding school.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-lg pt-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari artikel kesehatan (skabies, batuk, maag, demam, cedera)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-900 text-xs placeholder-zinc-400 focus:outline-hidden focus:border-[#0071E3] bg-white"
          />
        </div>
      </div>

      {/* Category Segmented Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-colors ${
              selectedCategory === cat
                ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col justify-between hover:border-zinc-300 transition-colors shadow-xs"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-zinc-500 uppercase">
                  {article.category}
                </span>
                <span className="text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </span>
              </div>

              <h2 className="font-semibold text-sm sm:text-base text-zinc-900 leading-snug">
                {article.title}
              </h2>

              <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">
                {article.summary}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
              <button
                onClick={() => setActiveArticle(article)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0071E3] hover:underline"
              >
                <span>Baca Lengkap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleAskAboutArticle(article)}
                className="text-xs text-zinc-500 hover:text-zinc-800 font-medium"
              >
                Konsultasi NADI
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Article Reader */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-zinc-200 overflow-hidden my-6">
            <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold">
                  {activeArticle.category} • Waktu Baca: {activeArticle.readTime}
                </span>
                <h3 className="text-base font-semibold text-zinc-900 mt-0.5">
                  {activeArticle.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs text-zinc-700 max-h-[75vh] overflow-y-auto">
              {/* Summary */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 leading-relaxed font-medium text-zinc-800">
                {activeArticle.summary}
              </div>

              {/* Main Content Paragraphs */}
              <div className="space-y-3 leading-relaxed">
                {activeArticle.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Dos and Don'ts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                  <h4 className="font-semibold text-zinc-900 uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Hal yang Dianjurkan:</span>
                  </h4>
                  <ul className="space-y-1.5 text-zinc-600 pl-4 list-disc">
                    {activeArticle.dosAndDonts.dos.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                  <h4 className="font-semibold text-zinc-900 uppercase flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>Hal yang Dilarang:</span>
                  </h4>
                  <ul className="space-y-1.5 text-zinc-600 pl-4 list-disc">
                    {activeArticle.dosAndDonts.donts.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Red Flags */}
              {activeArticle.redFlags.length > 0 && (
                <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-900 space-y-2">
                  <h4 className="font-semibold uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Tanda Bahaya (Segera ke UKS / Rumah Sakit):</span>
                  </h4>
                  <ul className="space-y-1 text-red-800 pl-4 list-disc">
                    {activeArticle.redFlags.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-[11px] text-zinc-400 font-mono pt-2 border-t border-zinc-100">
                Sumber Referensi: {activeArticle.source}
              </div>
            </div>

            <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
              <button
                onClick={() => {
                  handleAskAboutArticle(activeArticle);
                  setActiveArticle(null);
                }}
                className="px-3.5 py-2 rounded-lg bg-[#0071E3] hover:bg-blue-600 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                Tanyakan Topik Ini ke NADI
              </button>

              <button
                onClick={() => setActiveArticle(null)}
                className="px-4 py-2 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs font-medium transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
