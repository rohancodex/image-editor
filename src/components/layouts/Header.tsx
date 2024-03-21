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
import { ThemeToggle } from "../ui/ThemeToggle";
import {
  LogoutLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";

const Header = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

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
                    {user.given_name?.at(0)?.toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.given_name + " " + user.family_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <LogoutLink>Log out</LogoutLink>
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
