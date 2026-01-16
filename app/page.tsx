import Link from 'next/link';
import {addTransaction, deleteTransaction} from './actions';
import {prisma} from '@/lib/prisma';


  //Fungsi format uang ke rupiah
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  }

export default async function Home(){
  //1. ambil data asli dari database
  const transactions = await prisma.transaction.findMany({
    orderBy: {createdAt: 'desc'},
  });

  //2. hitung saldo
  const amounts = transactions.map((t: any) =>t.category === 'EXPENSE' ? -t.amount : t.amount);
  const total = amounts.reduce((acc: number, item: number) => acc + item, 0);
  const income = amounts.filter((item: number) => item<0).reduce((acc: number, item: number) => acc + item, 0);
  const expense = (amounts.filter((item: number) => item < 0).reduce((acc: number, item: number) => acc + item, 0) * -1);

  return(
    <main className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-20">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Dompetku 💰</h1>
          <div className="space-x-4">
            <Link href="/" className="hover:text-blue-200 font-medium">Home</Link>
            <Link href="/stats" className="hover:text-blue-200">Statistik</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 mt-8 max-w-lg">

        {/* Card Saldo Utama */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 text-center border border-gray-100">
          <h2 className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Saldo Anda</h2>
          <h1 className={`text-4xl font-bold mt-2 ${total < 0 ? 'text-red-500' : 'text-gray-800'}`}>
            {formatRupiah(total)}
          </h1>
        
        <div className="w-1/2 text-center">
          <span className="block text-xs font-bold text-gray-400 uppercase">Pemasukan</span>
          <span className="block text-green-500 font-bold text-lg mt-1">{formatRupiah(income)}</span>
        </div>
        <div className="w-1/2 text-center">
        <span className="block text-xs font-bold text-gray-400 uppercase">Pengeluaran</span>
        <span className="block text-red-500 font-bold text-lg mt-1">{formatRupiah(expense)}</span>
        </div>
      </div>

      {/* Form Tambah Transaksi */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h3 className="font-bold text-lg mb-4 border-b pb-2">Tambah Transasksi Baru</h3>
      <form action={addTransaction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Keterangan</label>
          <input type="text" name="text" placeholder="Cth: Gaji, Beli kopi..." required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focusLring-blue-500 focus:outline-none transition"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1"></label>
          jumlah <span className="text-xs text-gray-400">(negatif = pengeluaran, positif = pemasukan)</span>
          <input type="number" name="number" placeholder="Cth: -50000 atau 1000000" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:outline-none transition"></input>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md hover:shadow-lg transform hover-translate-y-0.5">Simpan Transaksi</button>
      </form>
      </div>

      {/* List Transaksi */}
      <div>
        <h3 className="font-bold text-lg text-gray-700">Riwayat Transaksi</h3>
        {transactions.length === 0? (
          <p className="text-center text-gray-400 italic py-8">Belum ada transaksi.</p>
        ) : (
          <ul className="space-y-3">
            {transactions.map((t) => (
              <li key={t.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-transparent hover:shadow-md transition flex justify-between items center relative group"
                style={{ borderLeftColor: t.amount < 0 ? '#ef4444' : '#22c55e'}}>
                
                {/* Tombol Delete */}
                <form action={deleteTransaction.bind(null, t.id)} className="absolue -left-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600">
                    X
                  </button>
                </form>

                <div>
                  <p className="font-semibold text-gray-800">{t.text}</p>
                  <p className="text-xs text-gray-400">{t.createdAt.toLocaleDateString('id-ID')}</p>
                </div>
                <span className={`font-bold ${t.amount < 0 ? 'text-red-500' : 'text-green-500'}`}></span>
                </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </main>
  );
}