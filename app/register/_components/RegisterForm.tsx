"use client";

import { useState, useTransition } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CardWrapper } from "@/components/auth/CardWrapper";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { FormError } from "@/components/auth/FormError";
import { RegisterSchema } from "@/schemas";
import { register } from "@/actions/register";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const {
    watch,
    formState: { errors },
  } = form;

  const [name, email, password] = watch(["name", "email", "password"]);

  const isValidateError = Object.keys(errors).length !== 0;
  const isEmptyField = name === "" || email === "" || password === "";

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setSuccess("");
    setError("");

    startTransition(() => {
      register(values)
        .then((data) => {
          setSuccess(data.success);
        })
        .catch((error) => {
          setError(error.message);
        });
    });
  };

  const isSubmitButtonDisabled = isPending || isValidateError || isEmptyField;

  return (
    <CardWrapper
      headerTitle="회원가입"
      backButtonLabel="이미 계정이 있으신가요?"
      backButtonHref="/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="이름을 입력해주세요." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="example@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="******" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={success} />
          <FormError message={error} />
          <Button
            disabled={isSubmitButtonDisabled}
            type="submit"
            className="w-full"
          >
            회원가입
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
