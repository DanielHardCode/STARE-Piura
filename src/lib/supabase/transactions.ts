import { requireSupabase } from './client';
import type { Transaction } from '@/types/supabase';

const TABLE = 'transactions';

export async function fetchTransactions(): Promise<Transaction[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Transaction[];
}

export async function fetchTransactionById(id: string): Promise<Transaction> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Transaction;
}

export async function createTransaction(
  payload: Omit<Transaction, 'id' | 'created_at'>
): Promise<Transaction> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as Transaction;
}

export async function updateTransaction(
  id: string,
  changes: Partial<Omit<Transaction, 'id' | 'created_at'>>
): Promise<Transaction> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .update(changes)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Transaction;
}

export async function deleteTransaction(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) throw error;
}
