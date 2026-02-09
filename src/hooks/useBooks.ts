import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Book {
  id: string;
  title: string;
  author: string;
  status: "candidate" | "current" | "finished";
  publication_date: string;
  page_count: number;
  meeting_date: string | null;
  nominator: string | null;
  comment: string | null;
  link: string | null;
  created_at: string;
  updated_at: string;
}

export type BookInsert = Omit<Book, "id" | "created_at" | "updated_at">;

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBooks(data as Book[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const addBook = async (book: BookInsert) => {
    const { error } = await supabase.from("books").insert(book);
    if (!error) await fetchBooks();
    return { error };
  };

  const updateBook = async (id: string, updates: Partial<BookInsert>) => {
    const { error } = await supabase.from("books").update(updates).eq("id", id);
    if (!error) await fetchBooks();
    return { error };
  };

  const deleteBook = async (id: string) => {
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (!error) await fetchBooks();
    return { error };
  };

  const getBook = async (id: string) => {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return { data: data as Book | null, error };
  };

  return { books, loading, addBook, updateBook, deleteBook, getBook, refetch: fetchBooks };
}
