"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TriangleAlert } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useSignUp } from "../hooks/use-sign-up";

export const SignUpCard = () => {
  const mutation = useSignUp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState(false);

  const onCredentialSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(true);
      return;
    }
    mutation.mutate(
      { name, email, password },
      {
        onSuccess: () => {
          signIn("credentials", {
            email,
            password,
            redirectTo: "/",
          });
        },
      }
    );
  };
  const onProviderSignIn = (provider: "github" | "google") => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {(!!error || mutation.error) && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center justify-center gap-x-2 text-sm text-destructive">
          <TriangleAlert className="size-4" />
          <p>Something went wrong</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onCredentialSignUp} className="space-y-2.5">
          <Input
            placeholder="Full name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={mutation.isPending}
            required
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={mutation.isPending}
            required
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={mutation.isPending}
            required
            minLength={3}
            maxLength={20}
          />
          <Input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError(confirmPassword !== password);
            }}
            disabled={mutation.isPending}
            required
          />
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={mutation.isPending}
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-2.5">
          <Button
            disabled={mutation.isPending}
            onClick={() => onProviderSignIn("github")}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FaGithub className="mr-2 size-5 top-2.5 left-2.5 absolute" />
            Continue with Github
          </Button>
          <Button
            disabled={mutation.isPending}
            onClick={() => onProviderSignIn("google")}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FcGoogle className="mr-2 size-5 top-2.5 left-2.5 absolute" />
            Continue with Google
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?
          <Link href="/sign-in">
            <span className="hover:underline text-sky-700">Sign in</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
