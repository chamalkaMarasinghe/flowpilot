import { createFileRoute } from "@tanstack/react-router";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { useAppSelector } from "@/app/hooks";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserRoleBadge } from "@/components/users/UserRoleBadge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — FlowPilot" }] }),
  component: () => (
    <ProtectedLayout>
      <ProfilePage />
    </ProtectedLayout>
  ),
});

function ProfilePage() {
  const user = useAppSelector((s) => s.auth.user)!;
  const tasks = useAppSelector((s) => s.tasks.items);
  const my = tasks.filter((t) => t.assignedTo === user.id);
  const created = tasks.filter((t) => t.createdBy === user.id);
  const initials = user.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("");

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
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Profile saved (mock)");
            }}
          >
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" defaultValue={user.fullName} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={user.email} />
            </div>
            <div>
              <Label htmlFor="title">Job title</Label>
              <Input id="title" placeholder="e.g. Product Manager" />
            </div>
            <div>
              <Label htmlFor="dept">Department</Label>
              <Input id="dept" placeholder="e.g. Engineering" />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
