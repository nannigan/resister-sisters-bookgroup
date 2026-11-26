import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePlanningSettings } from "@/hooks/usePlanningSettings";

const db = vi.hoisted(() => ({
  row: { id: "settings-id", next_meeting_date: null as string | null, next_book_picker_member_id: null as string | null },
  update: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: () => ({
  select: () => ({ limit: () => ({ single: async () => ({ data: { ...db.row }, error: null }) }) }),
  update: (values: object) => {
    db.update(values);
    return { eq: () => ({ select: () => ({ single: async () => {
      db.row = { ...db.row, ...values };
      return { data: { ...db.row }, error: null };
    } }) }) };
  },
}) } }));

beforeEach(() => {
  db.row = { id: "settings-id", next_meeting_date: null, next_book_picker_member_id: null };
  db.update.mockClear();
});

describe("club planning settings", () => {
  it("saves the meeting date without timezone conversion and reads it back", async () => {
    const { result, unmount } = renderHook(usePlanningSettings);
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.save({ next_meeting_date: "2026-12-15", next_book_picker_member_id: null }); });
    unmount();
    const restored = renderHook(usePlanningSettings);
    await waitFor(() => expect(restored.result.current.settings?.next_meeting_date).toBe("2026-12-15"));
    restored.unmount();
  });

  it("stores the member choosing the book, not a book reference", async () => {
    const { result, unmount } = renderHook(usePlanningSettings);
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.save({ next_meeting_date: null, next_book_picker_member_id: "member-nan" }); });
    expect(db.update).toHaveBeenCalledWith({ next_meeting_date: null, next_book_picker_member_id: "member-nan" });
    expect(result.current.settings?.next_book_picker_member_id).toBe("member-nan");
    unmount();
  });

  it("allows both optional fields to be cleared", async () => {
    db.row = { id: "settings-id", next_meeting_date: "2026-12-15", next_book_picker_member_id: "member-nan" };
    const { result, unmount } = renderHook(usePlanningSettings);
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.save({ next_meeting_date: null, next_book_picker_member_id: null }); });
    expect(result.current.settings).toEqual({ id: "settings-id", next_meeting_date: null, next_book_picker_member_id: null });
    unmount();
  });
});