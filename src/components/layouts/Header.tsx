"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { ICreateUser } from "@/app/signup/helper";
import { ThemeToggle } from "../ui/ThemeToggle";

const Header = () => {
  const router = useRouter();
  const [user, setUser] = useState<ICreateUser | null>(null);

  const handleLogout = async () => {
    localStorage.removeItem("image-editor-user");
    localStorage.removeItem("image-editor-login");
    router.push("/login");
  };

  useEffect(() => {
    // get cookie
    const authUser = localStorage.getItem("image-editor-user");
    if (authUser) {
      setUser(JSON.parse(authUser));
    }
  }, []);
  return (
    <header>
      <nav className="container flex items-center justify-between py-4 md:py-8">
        <h1 className="text-2xl font-bold tracking-tight scroll-m-20 lg:text-3xl">
          Image Editor
        </h1>
        <div className="flex items-center gap-5 md:gap-10">
          <ThemeToggle />
          {user?.email ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  className="relative w-12 h-12 rounded-full"
                >
                  <div className=" flex justify-center items-center">
                    {user.full_name?.at(0)?.toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.full_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </nav>
    </header>
  );
};

export default Header;
