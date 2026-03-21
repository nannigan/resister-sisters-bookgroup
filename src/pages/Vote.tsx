import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { useBooks } from "@/hooks/useBooks";
import { useMembers } from "@/hooks/useMembers";
import { useVotes } from "@/hooks/useVotes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { ArrowUp, ArrowDown, Vote as VoteIcon, Trophy, ChevronUp, ChevronDown } from "lucide-react";

export default function Vote() {
  const { books, loading: booksLoading } = useBooks();
  const { members, loading: membersLoading } = useMembers();
  const { votes, loading: votesLoading, submitBallot, getMemberVotes, getBookVoteSummary } = useVotes();

  const [selectedMember, setSelectedMember] = useState<string>("");
  const [rankings, setRankings] = useState<string[]>([]); // ordered array of book IDs

  const candidateBooks = useMemo(
    () => books.filter((b) => b.status === "candidate"),
    [books]
  );

  const loading = booksLoading || membersLoading || votesLoading;

  // Initialize rankings when member is selected
  const handleMemberSelect = (memberId: string) => {
    setSelectedMember(memberId);
    const memberVotes = getMemberVotes(memberId);
    if (memberVotes.length > 0) {
      // Restore previous rankings
      const sorted = [...memberVotes].sort((a, b) => a.rank - b.rank);
      const rankedIds = sorted.map((v) => v.book_id);
      // Add any new candidate books not yet ranked
      const remaining = candidateBooks
        .filter((b) => !rankedIds.includes(b.id))
        .map((b) => b.id);
      setRankings([...rankedIds, ...remaining]);
    } else {
      setRankings(candidateBooks.map((b) => b.id));
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...rankings];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setRankings(next);
  };

  const moveDown = (index: number) => {
    if (index === rankings.length - 1) return;
    const next = [...rankings];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setRankings(next);
  };

  const handleSubmit = async () => {
    if (!selectedMember) return;
    const ballot = rankings.map((bookId, i) => ({ bookId, rank: i + 1 }));
    const { error } = await submitBallot(selectedMember, ballot);
    if (error) {
      toast.error("Failed to submit vote");
    } else {
      toast.success("Vote submitted!");
    }
  };

  // Results: ranked by points
  const results = useMemo(() => {
    return candidateBooks
      .map((book) => {
        const summary = getBookVoteSummary(book.id);
        return { ...book, ...summary };
      })
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }, [candidateBooks, votes]);

  const totalVoters = useMemo(() => {
    const memberIds = new Set(votes.map((v) => v.member_id));
    return memberIds.size;
  }, [votes]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-16">
          <p className="font-body text-muted-foreground">Loading...</p>
        </div>
      </AppLayout>
    );
  }

  if (candidateBooks.length === 0) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Vote</h1>
          <Card className="p-8 text-center">
            <p className="font-body text-muted-foreground">
              No suggested books to vote on. Add some books with "Suggested" status first.
            </p>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Vote</h1>

        {/* Voting Section */}
        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <VoteIcon className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Cast Your Ballot</h2>
          </div>

          <div className="max-w-xs">
            <label className="font-body text-sm font-medium text-foreground mb-1.5 block">
              Who are you?
            </label>
            <Select value={selectedMember} onValueChange={handleMemberSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select your name" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMember && (
            <>
              <p className="font-body text-sm text-muted-foreground">
                Rank the books from most preferred (#1) to least. Use the arrows to reorder.
              </p>
              <div className="space-y-2">
                {rankings.map((bookId, index) => {
                  const book = candidateBooks.find((b) => b.id === bookId);
                  if (!book) return null;
                  return (
                    <div
                      key={bookId}
                      className="flex items-center gap-3 rounded-md border border-border bg-card p-3"
                    >
                      <span className="font-display text-lg font-bold text-primary w-8 text-center">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-medium text-foreground truncate">
                          {book.title}
                        </p>
                        <p className="font-body text-sm text-muted-foreground truncate">
                          {book.author}
                        </p>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-accent disabled:opacity-30 text-foreground"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveDown(index)}
                          disabled={index === rankings.length - 1}
                          className="p-1 rounded hover:bg-accent disabled:opacity-30 text-foreground"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Button onClick={handleSubmit} className="mt-2">
                Submit Vote
              </Button>
            </>
          )}
        </Card>

        {/* Results Section */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Results</h2>
            <span className="font-body text-sm text-muted-foreground ml-2">
              {totalVoters} {totalVoters === 1 ? "vote" : "votes"} cast
            </span>
          </div>

          {totalVoters === 0 ? (
            <p className="font-body text-sm text-muted-foreground">
              No votes have been cast yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Book</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="text-right">Votes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((book, i) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-display font-bold text-primary">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-body font-medium">{book.title}</TableCell>
                    <TableCell className="font-body text-muted-foreground">{book.author}</TableCell>
                    <TableCell className="text-right font-body font-semibold">
                      {book.totalPoints}
                    </TableCell>
                    <TableCell className="text-right font-body text-muted-foreground">
                      {book.voteCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
