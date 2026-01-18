'use client';

import {deleteTransaction} from '../actions';

//menerima data transaksi sebagai 'props
export default function TransactionItem({transaction} : {transaction: any}) {
    
    //fungsi untuk memformat angka jadi rupiah (Rp 10.000)
    const formatRupiah = (num: number) => {
        return num.toLocaleString('id-ID');
    };

    const isIncome = transaction.amount > 0 || transaction.category === 'INCOME';

    return(
        <li className="gorup flex justify-between items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
                {/* garis warna penanda (hijau/merah) */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-opacity-10 
                    ${isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}> 
                <span className="font-bold text-lg">{isIncome ? '' : ''}</span>
                </div>   
                <div>
                    <p className="font-semibold text-gray-800 text-sm md:text-base">{transaction.text}</p>
                    <p className="text-xs text-gray-400">
                        {new Date(transaction.createdAt).toLocaleDateString('id-ID', {
                            weekday: 'short', day: 'numeric', month: 'short'
                        })}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span className={`font-bold tabular-nums tracking-tight 
                ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {isIncome ? '+' : '-'}Rp {formatRupiah(transaction.amount)}
                </span>

                {/* TOMBOL HAPUS */}
                <button onClick={() => deleteTransaction(transaction.id)}
                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg ml-2" aria-label="Hapus Transaksi">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" view-Box="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                </button>
            </div>
        </li>
    );
}