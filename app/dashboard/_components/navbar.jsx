"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { MobileSidebar } from "./mobile-sidebar";

import { ThemeSwitcher } from "@/components/toggle-theme";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    async function fetchMe() {
      try {
        const response = await fetch(`/api/me`);
        const data = await response.json();
        setLoggedInUser(data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchMe();
  }, []);

  return (
    <div className="p-4 border-b h-full flex items-center ">
      <MobileSidebar />
      <div className="flex items-center justify-end gap-x-5 w-full">
        <ThemeSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer">
              <Avatar>
                <AvatarImage
                  src={
                    loggedInUser?.profilePicture ??
                    "https://github.com/shadcn.png"
                  }
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-4">
            <Link
              href="#"
              onClick={() => {
                signOut();
              }}
            >
              <DropdownMenuItem className="cursor-pointer">
                Logout
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
