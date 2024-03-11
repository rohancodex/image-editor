"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import CreateUserForm from "./SignupForm";
import { ICreateUser } from "./helper";
import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();

  useLayoutEffect(() => {
    if (localStorage.getItem("image-editor-login")) {
      router.replace("/");
    }
  }, []);

  const onSubmit = (values: ICreateUser) => {
    // store to local storage
    localStorage.setItem("image-editor-user", JSON.stringify(values));
    localStorage.setItem("image-editor-login", "true");

    // redirect
    router.replace("/");
  };
  return (
    <section className="flex justify-center lg:container lg:items-center lg:h-screen">
      <Card className="w-5/6 lg:p-8 lg:grid lg:grid-cols-2 lg:items-center shadow-[rgba(7,_65,_210,_0.1)_0px_10px_32px]">
        <CardHeader className="items-center order-2 lg:justify-center">
          <Image
            className="w-52 h-52 lg:w-[30rem] lg:h-[30rem]"
            src={"/auth.webp"}
            alt="serene-header"
            width={300}
            height={300}
          />
        </CardHeader>
        <CardContent className="order-1 w-5/6 mx-auto my-2">
          <h1 className="py-6 text-2xl font-semibold text-left  lg:block">
            Edit images: Sign Up Now!
          </h1>
          <CreateUserForm onSubmit={onSubmit} />
          <CardFooter className="justify-center order-2 pt-6">
            <p className="text-sm">
              Already have an account?
              <Link
                href={"/login"}
                className="text-orange-500 font-medium px-2"
              >
                Log In
              </Link>
            </p>
          </CardFooter>
        </CardContent>
      </Card>
    </section>
  );
};

export default Signup;
