"use client";

import { useState, useEffect } from "react";
import { Shield, ShieldAlert, User as UserIcon } from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
      setIsLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-(--color-text-primary)">Manage Users</h1>
      </div>

      <div className="bg-(--color-bg-secondary) border border-(--color-border-custom) rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-(--color-gold-primary) animate-pulse">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-(--color-text-secondary)">No users found.</div>
        ) : (
          <table className="w-full text-left text-sm text-(--color-text-primary)">
            <thead className="bg-(--color-bg-card) border-b border-(--color-border-custom)">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Joined At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-(--color-border-custom) hover:bg-(--color-bg-card) transition-colors">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-(--color-bg-card) border border-(--color-border-custom) flex items-center justify-center">
                       <UserIcon size={14} className="text-(--color-text-secondary)" />
                    </div>
                    <span className="font-medium">{user.profile?.displayName || "Unknown"}</span>
                  </td>
                  <td className="px-4 py-3 text-(--color-text-secondary)">{user.email}</td>
                  <td className="px-4 py-3">
                    {user.role === "ADMIN" ? (
                      <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs font-bold border border-red-500/20">
                        <ShieldAlert size={12} /> ADMIN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-(--color-bg-card) text-(--color-text-secondary) px-2 py-1 rounded text-xs font-bold border border-(--color-border-custom)">
                        <UserIcon size={12} /> USER
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-(--color-text-secondary)">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}