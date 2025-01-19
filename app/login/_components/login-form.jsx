"use client";

import Link from "next/link";

import { credentialLogin } from "@/app/actions";
import { AlertDestructive } from "@/components/alert-destructive";
import { ButtonLoading } from "@/components/button-loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();

  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);
    setError("");

    try {
      const formData = new FormData(event.currentTarget);
      const response = await credentialLogin(formData);
      console.log("🚀 ~ onSubmit ~ response:", response);

      if (!!response.error) {
        console.error(response.error);
        setError(response.error);
      } else {
        router.push("/courses");
      }
    } catch (e) {
      console.log(e.message);
      setError(e.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        {error && <AlertDestructive>{error}</AlertDestructive>}
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            {loader ? (
              <ButtonLoading />
            ) : (
              <Button type="submit" className="w-full">
                Login
              </Button>
            )}
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="register" className="underline">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
