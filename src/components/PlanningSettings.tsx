import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Member } from "@/hooks/useMembers";
import { usePlanningSettings } from "@/hooks/usePlanningSettings";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PlanningSettings({ members, membersLoading }: { members: Member[]; membersLoading: boolean }) {
  const { settings, loading, saving, error, load, save } = usePlanningSettings();
  const [meetingDate, setMeetingDate] = useState("");
  const [pickerId, setPickerId] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (settings) {
      setMeetingDate(settings.next_meeting_date ?? "");
      setPickerId(settings.next_book_picker_member_id ?? "");
    }
  }, [settings]);

  const date = meetingDate ? new Date(`${meetingDate}T00:00:00`) : undefined;
  const dirty = meetingDate !== (settings?.next_meeting_date ?? "") || pickerId !== (settings?.next_book_picker_member_id ?? "");
  const disabled = loading || saving || !settings;
  const sortedMembers = [...members].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="border-b border-border pb-6 space-y-4 font-body" aria-label="Meeting planning">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 min-w-0">
          <Label htmlFor="next-meeting">Next meeting</Label>
          <div className="flex gap-1">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button id="next-meeting" variant="outline" disabled={disabled} className="bg-amber-50 flex-1 min-w-0 justify-start font-normal">
                  <CalendarIcon className="h-4 w-4 mr-2 shrink-0" />
                  <span className="truncate">{date ? format(date, "MMM d, yyyy") : "Select date"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} defaultMonth={date} initialFocus className="p-3 pointer-events-auto"
                  onSelect={(selected) => { setMeetingDate(selected ? format(selected, "yyyy-MM-dd") : ""); setCalendarOpen(false); }} />
              </PopoverContent>
            </Popover>
            <Button variant="ghost" size="icon" disabled={disabled || !meetingDate} onClick={() => setMeetingDate("")} aria-label="Clear next meeting" title="Clear next meeting" className="shrink-0"><X className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="space-y-2 min-w-0">
          <Label htmlFor="next-book-picker">Next book picker</Label>
          <div className="flex gap-1">
            <Select value={pickerId} onValueChange={setPickerId} disabled={disabled || membersLoading}>
              <SelectTrigger id="next-book-picker" className="bg-amber-50 flex-1 min-w-0 [&>span]:truncate"><SelectValue placeholder={membersLoading ? "Loading members…" : "Select member"} /></SelectTrigger>
              <SelectContent>{sortedMembers.map((member) => <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>)}</SelectContent>
            </Select>
            <Button variant="ghost" size="icon" disabled={disabled || !pickerId} onClick={() => setPickerId("")} aria-label="Clear next book picker" title="Clear next book picker" className="shrink-0"><X className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
      {error && <div role="alert" className="text-sm text-destructive">{error}{!settings && <Button variant="link" onClick={() => void load()}>Retry</Button>}</div>}
      <Button variant="outline" className="bg-amber-50" disabled={disabled || membersLoading || !dirty} onClick={async () => {
        if (await save({ next_meeting_date: meetingDate || null, next_book_picker_member_id: pickerId || null })) toast.success("Meeting planning saved.");
      }}>{saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}{saving ? "Saving…" : "Save"}</Button>
    </section>
  );
}