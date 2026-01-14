import {addTransaction, deleteTransaction} from './actions';
import {prisma} from '@/lib/prisma';

export default async function Home(){
  //1. ambil data asli dari database
  const transactions = await prisma.transaction.findMany({
    orderBy: {createdAt: 'desc'},
  });

  //2. hitung saldo
  const amounts = transactions.map((t: any) =>
  t.category === 'EXPENSE' ? -t.amount : t.amount);

  const total = amounts.reduce((acc: number, item: number) => acc + item, 0);

  const income = amounts
  .filter((item: number) => item<0)
  .reduce((acc: number, item: number) => acc + item, 0);

  const expense = (
    amounts
    .filter((item: number) => item < 0)
    .reduce((acc: number, item: number) => acc + item, 0) * -1
  );

  return(
    <main className="flex min-h-screen flex-col items-center p-6 bg-slate-100 font sans text-slate-800">

      {/* BOX SALDO */}
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-sm uppercase font-bold text-slate-500">Saldo Total</h2>
        <h1 className="text-3xl font-bold my-2">Rp {total.toLocaleString('id-ID')}</h1>

        <div className="flex bg-white shadow-sm border mt-4 rounded-lg p-4 divide-x">
          <div className="w-1/2 text-center">
          <h4 className="text-sm font-semibold uppercase text-green-600">Pemasukan</h4>
          <p className="font-bold text-lg text-green-600">+Rp {income.toLocaleString('id-ID')}</p>
          </div>

          <div className="w-1/2 text-center">
          <h4 className="text-sm font-semibold uppercase text-red-600">Pengeluaran</h4>
          <p className="font-bold text-lg text-red-600">-Rp {expense.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      {/* FORM INPUT BARU TANPA USESTATE DAN ONCHANGE */}
      <div className="w-full max-w-md mb-8 bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-bold border-b-2 border-slate-300 pb-2 mb-4">Tambah Transaksi</h3>
        <form action={addTransaction} className="flex flex-col gap-3">
          <input
          type="text"
          name="text"
          placeholder="Keterangan (Contoh: Gaji, Makan)"
          className="border p-3 rounded-lg w-full focus:outline-blue-500" required/>

          <div className="flex gap-2">
            <input
            type="number"
            placeholder="Nominal (Rp)..."
            className="border p-3 rounded-lg w-full focus:outline-blue-500" required/>
            <select name="category" className="border p-3 rounded-lg bg-slate-50 cursor-pointer">
              <option value="EXPENSE">Pengeluaran</option>
              <option value="INCOME">Pemasukan</option>
            </select>
          </div>

          <button type="submit" className="bg-black text-white p-3 rounded-lg font-bold hover:bg-gray-800 transition mt-2">
            Simpan Transaksi
          </button>
        </form>

        {/* DAFTAR RIWAYAT */}
        <div className="w-full max-w-md">
          <h3 className="text-xl font-bold mb-4 ml-1">Riwayat Terakhir</h3>
          {transactions.length === 0 ? (
            <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed">
              Belum ada transaksi
              </div>
          ) : (
            <ul className="space-y-3">
              {transactions.map((t: any) => (
              <li key={t.id} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3">
                  <div className={`w-2 h-10 rounded-full ${t.category === 'INCOME' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <p className="font-semibold text-slate-900">{t.text}</p>
                  <p className="text-xs text-gray-400">{t.createdAt.toLocalDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`font-bold ${t.category === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.category === 'INCOPME' ? '+' : '-'}Rp {t.amount.toLocaleString('id-ID')}
                </span>

                {/* Tombol hapus server action */}
                <form action={deleteTransaction.bind(null, t.id)}>
                  <button type="submit" className="text-red-400 hover:text-red-700 font-bold ml-2">X</button>
                </form>
              </div>
              </li>
              )
              )}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}