import { Student, AIAnalysisResult } from '../types';

// LAYANAN ANALISIS LOKAL (OFFLINE / TANPA API)
// Menggantikan Gemini AI dengan perhitungan statistik manual agar bisa dideploy di Netlify tanpa API Key.

export const analyzeStudentData = async (students: Student[]): Promise<AIAnalysisResult> => {
    // Simulasi delay agar terasa seperti sedang memproses
    await new Promise(resolve => setTimeout(resolve, 800));

    if (students.length === 0) {
        return {
            summary: "Belum ada data siswa yang tersedia untuk dianalisis.",
            recommendations: ["Tambahkan data siswa terlebih dahulu."],
            atRiskStudents: []
        };
    }

    // 1. Kalkulasi Statistik Dasar
    const totalStudents = students.length;
    let totalMath = 0, totalScience = 0, totalEnglish = 0, totalIslamic = 0, totalAttendance = 0;
    const atRiskList: string[] = [];

    students.forEach(s => {
        totalMath += s.math;
        totalScience += s.science;
        totalEnglish += s.english;
        totalIslamic += s.islamicStudies;
        totalAttendance += s.attendance;

        // Logika Deteksi Resiko
        const avgScore = (s.math + s.science + s.english + s.islamicStudies) / 4;
        if (avgScore < 65 || s.attendance < 80 || s.behavior === 'Perlu Bimbingan') {
            atRiskList.push(s.name);
        }
    });

    const avgMath = totalMath / totalStudents;
    const avgScience = totalScience / totalStudents;
    const avgEnglish = totalEnglish / totalStudents;
    const avgAttendance = totalAttendance / totalStudents;

    // 2. Generate Summary Otomatis
    const bestSubject = Math.max(avgMath, avgScience, avgEnglish);
    let bestSubjectName = '';
    if (bestSubject === avgMath) bestSubjectName = 'Matematika';
    else if (bestSubject === avgScience) bestSubjectName = 'IPA';
    else if (bestSubject === avgEnglish) bestSubjectName = 'Bahasa Inggris';

    const summary = `Berdasarkan data terkini dari ${totalStudents} siswa, rata-rata kehadiran sekolah mencapai ${avgAttendance.toFixed(1)}%. ` +
                    `Kinerja akademik menunjukkan hasil terkuat di mata pelajaran ${bestSubjectName}. ` +
                    `Terdapat ${atRiskList.length} siswa yang teridentifikasi membutuhkan perhatian khusus berdasarkan kombinasi nilai, kehadiran, dan perilaku.`;

    // 3. Generate Rekomendasi Logis
    const recommendations: string[] = [];

    if (avgAttendance < 90) {
        recommendations.push("Tingkatkan program pemantauan kehadiran harian dan komunikasi dengan wali murid.");
    } else {
        recommendations.push("Pertahankan budaya disiplin kehadiran yang sudah baik.");
    }

    if (avgMath < 70) {
        recommendations.push("Adakan kelas tambahan atau klinik belajar khusus untuk mata pelajaran Matematika.");
    }

    if (avgEnglish < 70) {
        recommendations.push("Perbanyak sesi praktik percakapan (speaking) untuk meningkatkan nilai Bahasa Inggris.");
    }

    if (atRiskList.length > 0) {
        recommendations.push(`Segera jadwalkan sesi konseling untuk ${atRiskList.length} siswa yang terindikasi berisiko akademik/perilaku.`);
    }

    // Pastikan minimal ada 3 rekomendasi
    if (recommendations.length < 3) {
        recommendations.push("Lakukan evaluasi kurikulum berkala setiap akhir bulan.");
        recommendations.push("Berikan penghargaan kepada siswa dengan peningkatan nilai tertinggi.");
    }

    return {
        summary,
        recommendations: recommendations.slice(0, 5), // Ambil max 5 rekomendasi
        atRiskStudents: atRiskList
    };
};