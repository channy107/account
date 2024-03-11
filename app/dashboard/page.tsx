"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const Dashboard = () => {
  const user = useCurrentUser();
  const router = useRouter();
  console.log("user", user);

  return (
    <>
      <Button
        onClick={() => {
          logout();
          router.push("/login");
        }}
      >
        로그아웃
      </Button>
    </>
  );
};

export default Dashboard;
