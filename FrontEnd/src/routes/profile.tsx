import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserRoleBadge } from "@/components/users/UserRoleBadge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateProfile } from "@/features/auth/authThunks";
import { patchUserInList } from "@/features/users/userSlice";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — FlowPilot" }] }),
  component: () => (
    <ProtectedLayout>
      <ProfilePage />
    </ProtectedLayout>
  ),
});

function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user)!;
  const tasks = useAppSelector((s) => s.tasks.items);
  const my = tasks.filter((t) => t.assignedTo === user.id);
  const created = tasks.filter((t) => t.createdBy === user.id);
  const initials = user.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("");

  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [jobTitle, setJobTitle] = useState(user.jobTitle ?? "");
  const [department, setDepartment] = useState(user.department ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(user.fullName);
    setEmail(user.email);
    setJobTitle(user.jobTitle ?? "");
    setDepartment(user.department ?? "");
  }, [user]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    setSaving(true);
    try {
      const updated = await dispatch(
        updateProfile({
          fullName: fullName.trim(),
          email: email.trim(),
          jobTitle: jobTitle.trim(),
          department: department.trim(),
        }),
      ).unwrap();

      dispatch(
        patchUserInList({
          id: updated.id,
          patch: {
            fullName: updated.fullName,
            email: updated.email,
            jobTitle: updated.jobTitle,
            department: updated.department,
            avatarUrl: updated.avatarUrl,
          },
        }),
      );
      toast.success("Profile saved");
    } catch (err) {
      toast.error((err as string) ?? "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="Your profile" description="Personal info and a quick activity snapshot." />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <Avatar className="size-20">
              <AvatarFallback className="bg-brand-gradient text-2xl text-white">{initials}</AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-lg font-semibold">{user.fullName}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {(user.jobTitle || user.department) && (
              <p className="mt-1 text-xs text-muted-foreground">
                {[user.jobTitle, user.department].filter(Boolean).join(" · ")}
              </p>
            )}
            <div className="mt-2"><UserRoleBadge role={user.role} /></div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-center text-sm">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xl font-semibold">{my.length}</p>
              <p className="text-xs text-muted-foreground">Assigned</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xl font-semibold">{created.length}</p>
              <p className="text-xs text-muted-foreground">Created</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold">Account details</h3>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="title">Job title</Label>
              <Input
                id="title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Product Manager"
              />
            </div>
            <div>
              <Label htmlFor="dept">Department</Label>
              <Input
                id="dept"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Engineering"
              />
            </div>
            <div className="flex justify-end sm:col-span-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
