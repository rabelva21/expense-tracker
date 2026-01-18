import Link from 'next/link';
import {addTransaction, deleteTransaction} from './actions';
import {prisma} from '@/lib/prisma';
import TransactionItem from './components/TransactionItem';


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
  const income = amounts.filter((item: number) => item>0).reduce((acc: number, item: number) => acc + item, 0);
  const expense = (amounts.filter((item: number) => item < 0).reduce((acc: number, item: number) => acc + item, 0) * -1);

  return(
    <main className="min-h-screen bg-gray-100 text-gray-800 font-sans pb-20">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto mx-auto px-4  py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dompetku </h1>
          <div className="space-x-6 text-sm font-mdeium">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition">Home</Link>
            <Link href="/stats" className="text-gray-600 hover:text-blue-600 transition">Statistik</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 mt-8 max-w-xl">

        {/* Card Saldo Utama */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-xl pb-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>

        <div className="relative z-10 text-center">
          <h2 className="text-blue-100 text-sm uppercase tracking-widest font-medium mb-1">Saldo Anda</h2>
          <h1 className="text-5xl font-bold mb-6 tracking-tight">
            {formatRupiah(total)}
          </h1>
        
          <div className="bg-white/10 backdrop-blur-sm runded-xl p-4 flex divide-x divide-white/20 shadow-inner">
            <div className="w-1/2 text-center px-2">
              <span className="block text-xs text-blue-100 uppercase mb-1">Pemasukan</span>
              <span className="block text-green-300 font-bold text-lg">{formatRupiah(income)}</span>
            </div>
          <div className="w-1/2 text-center">
              <span className="block text-xs text-blue-100 uppercase mb-1">Pengeluaran</span>
              <span className="block text-red-300 font-bold text-lg">{formatRupiah(expense)}</span>
          </div>
          </div>
        </div>
      </div>

      {/* Form Tambah Transaksi */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <h3 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
        <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
        Transaksi Baru
        </h3>
      <form action={addTransaction} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Keterangan</label>
          <input type="text" name="text" placeholder="Cth: Gaji, Beli kopi..." required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400"/>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Jumlah</label>
          <span className="text-xs text-gray-400">(negatif = pengeluaran, positif = pemasukan)</span>
          <input type="number" name="amount" placeholder="Cth: -50000 atau 1000000" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus-bg-white outline-none transition-all"></input>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md hover:shadow-lg transform hover-translate-y-0.5">Simpan Transaksi</button>
      </form>
      </div>

      {/* List Transaksi */}
      <div>
        <h3 className="font-bold text-lg text-gray-700 mb-4">Riwayat Transaksi</h3>
      {transactions.length === 0?(
        <p className="text-center text-gray-400 italic py-8 bg0white rounded-xl border border-dashed">Belum ada transaksi.</p>
      ) : (
        <ul className="space-y-3">
          {transactions.map((t) =>(
            <TransactionItem key={t.id} transaction={t}/>
          ))}
        </ul>
      )}
      </div>

      </div>
    </main>
  );
}