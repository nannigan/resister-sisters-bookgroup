import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Vote {
  id: string;
  member_id: string;
  book_id: string;
  rank: number;
  created_at: string;
}

export function useVotes() {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVotes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("votes")
      .select("*")
      .order("rank", { ascending: true });

    if (!error && data) {
      setVotes(data as Vote[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  const submitBallot = async (memberId: string, rankings: { bookId: string; rank: number }[]) => {
    // Delete existing votes for this member
    const { error: deleteError } = await supabase
      .from("votes")
      .delete()
      .eq("member_id", memberId);
    if (deleteError) return { error: deleteError };

    // Insert new rankings
    const rows = rankings.map((r) => ({
      member_id: memberId,
      book_id: r.bookId,
      rank: r.rank,
    }));
    const { error } = await supabase.from("votes").insert(rows);
    if (!error) await fetchVotes();
    return { error };
  };

  const getMemberVotes = (memberId: string) =>
    votes.filter((v) => v.member_id === memberId);

  const getBookVoteSummary = (bookId: string) => {
    const bookVotes = votes.filter((v) => v.book_id === bookId);
    if (bookVotes.length === 0) return { totalPoints: 0, voteCount: 0 };
    // For ranked choice: lower rank = more points. If N candidates, rank 1 gets N points, etc.
    const maxRank = Math.max(...votes.map((v) => v.rank), 1);
    const totalPoints = bookVotes.reduce((sum, v) => sum + (maxRank + 1 - v.rank), 0);
    return { totalPoints, voteCount: bookVotes.length };
  };

  return { votes, loading, submitBallot, getMemberVotes, getBookVoteSummary, refetch: fetchVotes };
}
