"use client";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const Dashboard = () => {
  const user = useCurrentUser();
  console.log("user", user);

  return (
    <>
      <Button
        onClick={() => {
          logout();
          window.location.reload();
        }}
      >
        로그아웃
      </Button>
    </>
  );
};

export default Dashboard;
