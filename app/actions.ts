'use server';

import {prisma} from '@/lib/prisma';
import {revalidatePath} from 'next/cache';


//fungsi tambah transaksi
export async function addTransaction(formData: FormData) {
    const text = formData.get('text');
    const amount = formData.get('amount');
    const type = formData.get('type');

    if (!text || !amount ||!type) {
        return;
    }

//simpan ke database 
await prisma.transaction.create({
    data:   {
        text: text.toString(),
        amount: parseFloat(amount.toString()),
        category: type.toString() === 'INCOME' ? 'INCOME': 'EXPENSE',
    }
});

//refresh halaman agar data baru muncul
revalidatePath('/');
}

//fungsi hapus transaksi
export async function deleteTransaction(id: string) {
    await prisma.transaction.delete({
        where: {id},
    })

    revalidatePath('/');
}