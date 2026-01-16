import Link from 'next/link';

export default function StatsPage(){
    return(
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                <h1 className="text-3xl font-bold text-blue-600 mb-4">Statistik 📊</h1>
                <p className="text-gray-600 mb-8">Halaman ini nantinya bisa kamu isi dengan grafik pengeluaran bulanan menggunakan library seperti <i>Recharts</i> atau <i>Chart.js</i>.</p>
            </div>

            <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-green-500 w-3/4"></div>
                </div>
                <p className="text-xs text-gray-400">Mockup Progres Tabungan</p>
            </div>

            <div className="mt-8">
                <Link href="/" className="text-blue-500 hover:underline font-semibold">Kembali ke Dashboard</Link>
            </div>
        </div>
    );
}