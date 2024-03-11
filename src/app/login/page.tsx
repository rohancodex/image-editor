"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ILoginUser } from "./helper";
import LoginForm from "./LoginForm";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("image-editor-login")) {
      router.push("/");
    }
  }, []);

  const onSubmit = async (values: ILoginUser) => {
    // check and store flag to local storage
    const user = localStorage.getItem("image-editor-user");
    if (user) {
      const jsonUser = JSON.parse(user);
      if (
        jsonUser.email === values.email &&
        jsonUser.password === values.password
      ) {
        localStorage.setItem("image-editor-login", "true");
        return router.push("/");
      } else {
        alert("Invalid email or password");
        return;
      }
    }
    alert("User not found");

    // redirect
    router.push("/signup");
  };

  return (
    <section className="flex justify-center lg:container lg:items-center lg:h-screen">
      <Card className="w-5/6 lg:p-8 lg:grid lg:grid-cols-2 shadow-[rgba(7,_65,_210,_0.1)_0px_10px_32px]">
        <CardHeader className="items-center order-2 lg:justify-center">
          <Image
            className="w-52 h-52 lg:w-[30rem] lg:h-[30rem]"
            src={"/auth.webp"}
            alt="serene-header"
            width={300}
            height={300}
          />
        </CardHeader>
        <CardContent className="order-1 w-5/6 mx-auto my-2 lg:grid lg:items-center lg:content-center">
          <h1 className="py-6 text-2xl font-semibold text-left  lg:block">
            Just a step away. Login now!
          </h1>
          <LoginForm onSubmit={onSubmit} />

          <CardFooter className="justify-center order-2 pt-6">
            <p className="text-sm">
              {"Don't have an account?"}
              <Link href="/signup" className="text-orange-500 px-2 font-medium">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </CardContent>
      </Card>
    </section>
  );
}
