'use server';
import { PrismaClient } from '@prisma/client';
import {revalidatePath} from 'next/cache';

const prisma = new PrismaClient();

export async function addTransaction(formData: FormData){
    const text = formData.get('text');
}