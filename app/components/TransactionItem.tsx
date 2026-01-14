'use client';

import {deleteTransaction} from '../actions';

//menerima data transaksi sebagai 'props
export default function TransactionItem({transaction} : {transaction: any}) {
    
    //fungsi untuk memformat angka jadi rupiah (Rp 10.000)
    const formatRupiah = (num: number) => {
        return num.toLocaleString('id-ID');
    };

    return(
        <li className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-3">
            <div className="flex items-center gap-3">
                {/* garis warna penanda (hijau/merah) */}
                <div className={`w-2 h-10 rounded-full ${
                    transaction.category === 'INCOME' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                
                <div>
                    <p className="font-semibold text-slate-900">{transaction.text}</p>
                    <p className="text-xs text-gray-400">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className={`font-bold ${
                transaction.category === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.category === 'INCOME' ? '+' : '-'}Rp {formatRupiah(transaction.amount)}
                </span>

                {/* TOMBOL HAPUS */}
                <button onClick={() => deleteTransaction(transaction.id)}
                className="text-red-400 hover:text-red-700 font-bold ml-2">
                    X
                </button>
            </div>
        </li>
    );
}