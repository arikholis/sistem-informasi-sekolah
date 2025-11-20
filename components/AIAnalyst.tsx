import React, { useState } from 'react';
import { Student, AIAnalysisResult } from '../types';
import { analyzeStudentData } from '../services/geminiService';
import { Sparkles, AlertOctagon, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

interface AIAnalystProps {
  data: Student[];
}

export const AIAnalyst: React.FC<AIAnalystProps> = ({ data }) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeStudentData(data);
      setAnalysis(result);
    } catch (err) {
      setError('Terjadi kesalahan saat menghubungkan ke AI. Pastikan API Key telah dikonfigurasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">AI Education Analyst</h2>
        <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
          Gunakan kecerdasan buatan Gemini untuk menganalisis tren akademik, mengidentifikasi siswa yang membutuhkan bantuan, dan mendapatkan rekomendasi strategis untuk Smart Ekselensia.
        </p>
      </div>

      {!analysis && !loading && (
        <div className="flex justify-center mt-10">
          <button 
            onClick={handleAnalyze}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Mulai Analisis Data Siswa
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center flex-1 min-h-[400px]">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Sedang menganalisis data akademik...</p>
          <p className="text-slate-400 text-sm mt-1">Ini mungkin memakan waktu beberapa detik.</p>
        </div>
      )}

      {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center mt-4">
              <p>{error}</p>
              <button onClick={() => setError(null)} className="mt-2 text-sm underline hover:text-red-800">Coba Lagi</button>
          </div>
      )}

      {analysis && !loading && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700 pb-12">
          
          {/* Header with Re-analyze */}
          <div className="flex justify-end">
            <button 
                onClick={handleAnalyze}
                className="text-slate-500 hover:text-emerald-600 flex items-center gap-2 text-sm"
            >
                <RefreshCw className="w-4 h-4" /> Refresh Analisis
            </button>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
             <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                Ringkasan Eksekutif
             </h3>
             <p className="text-slate-600 leading-relaxed">
                {analysis.summary}
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recommendations */}
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-6 shadow-sm border border-emerald-100">
                <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Rekomendasi Strategis
                </h3>
                <ul className="space-y-3">
                    {analysis.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm border border-emerald-50/50">
                            <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">{idx + 1}</span>
                            <span className="text-slate-700 text-sm">{rec}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* At Risk Students */}
            <div className="bg-gradient-to-br from-rose-50 to-white rounded-xl p-6 shadow-sm border border-rose-100">
                <h3 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
                    <AlertOctagon className="w-5 h-5 text-rose-600" />
                    Perhatian Khusus Diperlukan
                </h3>
                {analysis.atRiskStudents.length > 0 ? (
                    <ul className="space-y-2">
                        {analysis.atRiskStudents.map((studentName, idx) => (
                            <li key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-rose-100">
                                <span className="text-slate-800 font-medium">{studentName}</span>
                                <span className="text-xs px-2 py-1 bg-rose-100 text-rose-700 rounded">Prioritas Tinggi</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-500 italic">Tidak ada siswa yang terdeteksi berisiko tinggi saat ini.</p>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};