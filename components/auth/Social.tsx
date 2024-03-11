"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { TOAuthType } from "@/types/oauth";

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: TOAuthType) => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-6">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("kakao")}
        aria-label="kakao"
      >
        <RiKakaoTalkFill className="h-5 w-5" />
      </Button>

      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("google")}
        aria-label="google"
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
    </div>
  );
};
