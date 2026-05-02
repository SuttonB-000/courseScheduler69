"use client";

import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      className="
        text-red-400
        px-3 py-1
        rounded-md
        transition-all duration-200
        hover:text-red-300
        hover:bg-white/5
      "
      onClick={handleLogout}
    >
      Sign Out
    </button>
  );
}