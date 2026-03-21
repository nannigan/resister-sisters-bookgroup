import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMembers } from "@/hooks/useMembers";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Shield, Trash2, UserCog, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Member } from "@/hooks/useMembers";

export default function Members() {
  const { token } = useParams<{ token: string }>();
  const { members, loading, addMember, updateMember, deleteMember, transferAdmin, adminMember } =
    useMembers();

  // For MVP, simulate admin mode with a toggle
  const [isAdminMode, setIsAdminMode] = useState(false);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [transferTarget, setTransferTarget] = useState("");
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const openEditDialog = (member: Member) => {
    setEditingMember(member);
    setEditName(member.name);
    setEditEmail(member.email || "");
    setEditPhone(member.phone || "");
  };

  const handleEditMember = async () => {
    if (!editingMember) return;
    if (!editName.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!editEmail.trim()) {
      toast.error("Email is required.");
      return;
    }
    const { error } = await updateMember(editingMember.id, {
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim() || null,
    });
    if (error) {
      toast.error("Failed to update member.");
    } else {
      toast.success("Member updated!");
      setEditingMember(null);
    }
  };

  const handleAddMember = async () => {
    if (!newName.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!newEmail.trim()) {
      toast.error("Email is required.");
      return;
    }
    const { error } = await addMember(newName.trim(), newEmail.trim(), newPhone.trim() || undefined);
    if (error) {
      toast.error("Failed to add member.");
    } else {
      toast.success("Member added!");
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      setAddOpen(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const { error } = await deleteMember(id);
    if (error) {
      toast.error("Failed to remove member.");
    } else {
      toast.success(`${name} removed.`);
    }
  };

  const handleTransfer = async () => {
    if (!transferTarget || !adminMember) return;
    const { error } = await transferAdmin(adminMember.id, transferTarget);
    if (error) {
      toast.error("Failed to transfer admin role.");
    } else {
      toast.success("Admin role transferred!");
      setTransferTarget("");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Members
          </h1>
          <div className="flex items-center gap-2">
            <MovingBorderButton
              containerClassName="h-9"
              onClick={() => setIsAdminMode(!isAdminMode)}
              className="font-body text-sm px-3"
            >
              <UserCog className="h-4 w-4 mr-1.5" />
              {isAdminMode ? "Admin Mode On" : "Admin Mode"}
            </MovingBorderButton>
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <MovingBorderButton containerClassName="h-9" className="font-body text-sm px-3">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Member
                </MovingBorderButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display">Add Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label className="font-body font-semibold">
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Member name"
                      className="font-body"
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body font-semibold">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Email address"
                      className="font-body"
                      maxLength={255}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body font-semibold">Phone</Label>
                    <Input
                      type="tel"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="Optional phone number"
                      className="font-body"
                      maxLength={30}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <MovingBorderButton containerClassName="h-10" className="font-body">Cancel</MovingBorderButton>
                  </DialogClose>
                  <MovingBorderButton containerClassName="h-10" onClick={handleAddMember} className="font-body">
                    Add Member
                  </MovingBorderButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <p className="text-center text-muted-foreground font-body py-12">
            No members yet.
          </p>
        ) : (
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-display font-bold text-sm">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-body font-semibold text-foreground">
                        {member.name}
                      </span>
                      {member.role === "admin" && (
                        <Badge
                          variant="outline"
                          className="text-xs font-body bg-primary/10 text-primary border-primary/30"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    {member.email && (
                      <span className="text-sm text-muted-foreground font-body">
                        {member.email}
                      </span>
                    )}
                    {member.phone && (
                      <span className="text-sm text-muted-foreground font-body">
                        {member.phone}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <MovingBorderButton
                    containerClassName="h-8 w-8"
                    onClick={() => openEditDialog(member)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </MovingBorderButton>
                  {isAdminMode && member.role !== "admin" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <MovingBorderButton
                          containerClassName="h-8 w-8"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </MovingBorderButton>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-display">
                            Remove {member.name}?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="font-body">
                            This will remove them from the book group.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="font-body">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(member.id, member.name)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-body"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isAdminMode && adminMember && members.filter((m) => m.role !== "admin").length > 0 && (
          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <h2 className="font-display text-lg font-bold text-foreground">
              Transfer Admin Role
            </h2>
            <p className="text-sm text-muted-foreground font-body">
              Select a member to make them the new admin.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={transferTarget}
                onValueChange={setTransferTarget}
              >
                <SelectTrigger className="font-body sm:w-[240px]">
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {members
                    .filter((m) => m.role !== "admin")
                    .map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <MovingBorderButton
                    containerClassName="h-10"
                    disabled={!transferTarget}
                    className="font-body"
                  >
                    Transfer
                  </MovingBorderButton>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display">
                      Transfer admin role?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="font-body">
                      The current admin will become a regular member.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleTransfer}
                      className="font-body"
                    >
                      Confirm Transfer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Edit Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="font-body font-semibold">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Member name"
                className="font-body"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Email address"
                className="font-body"
                maxLength={255}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body font-semibold">Phone</Label>
              <Input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="Optional phone number"
                className="font-body"
                maxLength={30}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="font-body">Cancel</Button>
            </DialogClose>
            <MovingBorderButton containerClassName="h-10" onClick={handleEditMember} className="font-body">
              Save Changes
            </MovingBorderButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
