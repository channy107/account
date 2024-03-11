"use client";

import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

import { CardWrapper } from "@/components/auth/CardWrapper";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { FormError } from "@/components/auth/FormError";
import { newVerification } from "@/actions/newVerification";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("토큰이 없습니다. url을 확인해주세요.");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
      })
      .catch(() => {
        setError("문제가 발생하였습니다.");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerTitle="회원가입 메일 확인"
      backButtonLabel="로그인"
      backButtonHref="/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};
