import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { User, Mail } from "lucide-react";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } });

  return (
    <div className="bg-(--color-bg-card) border border-(--color-border-custom) rounded-xl p-8">
      <h1 className="text-2xl font-bold text-(--color-text-primary) mb-6 border-b border-(--color-border-custom) pb-4">My Profile</h1>
      
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-(--color-gold-primary) text-(--color-bg-main) rounded-full flex items-center justify-center text-2xl font-bold uppercase">
             {profile?.displayName?.charAt(0) || "U"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-(--color-text-primary)">{profile?.displayName || "User"}</h2>
            <p className="text-sm text-(--color-text-secondary)">Member since {new Date().getFullYear()}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-(--color-text-secondary)">
            <Mail size={18} />
            <span>{session.user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-(--color-text-secondary)">
            <User size={18} />
            <span>{profile?.bio || "No bio added yet."}</span>
          </div>
        </div>
      </div>
    </div>
  );
}