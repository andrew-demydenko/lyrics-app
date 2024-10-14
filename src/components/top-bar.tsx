"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAuthContext } from "@/providers/auth-provider";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";

const TopBar = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const menuItemClass =
    "hover:bg-blue-600 hover:text-white active:bg-blue-500 active:text-white text-gray-900 group flex rounded-md items-center w-full p-2 text-sm";

  const isActive = (href: string) => {
    return pathname === href;
  };

  const onLogout = async () => {
    if (user) {
      await AuthService.logout(user.id).then((data) => {
        router.push("/login");
      });
    }
  };

  return (
    <div>
      <div className="h-[70px]" />
      <div className="fixed z-10 top-0 w-full flex justify-between items-center p-4 bg-gray-800 text-white h-[70px]">
        <h1 className="text-xl font-bold mr-5">Lyrics App</h1>
        <div className="flex-1 text-sm md:text-base space-x-1 md:space-x-4">
          <Link
            className={cn(
              "text-white p-2 hover:underline",
              isActive("/songs")
                ? "border border-white-500 rounded-md"
                : "hover:underline"
            )}
            href="/songs"
          >
            Shared songs
          </Link>
          {user ? (
            <Link
              className={cn(
                "text-white p-2",
                isActive(`/songs/user/${user.id}`)
                  ? "border border-white-500 rounded-md"
                  : "hover:underline"
              )}
              href={`/songs/user/${user.id}`}
            >
              My songs
            </Link>
          ) : null}
        </div>
        <div className="relative">
          {user ? (
            <Menu as="div" className="relative inline-block text-left">
              {({ open }) => (
                <>
                  <div>
                    <MenuButton className="flex max-w-[160px] items-center bg-gray-700 rounded-md px-4 py-2">
                      <div
                        title={`${user.name} - ${user.email}`}
                        className="truncate"
                      >
                        {user.name}
                      </div>

                      <ExpandMoreIcon
                        className={cn(
                          "shrink-0 h-5 w-5 ml-2 transition-transform delay-50",
                          {
                            "transform rotate-180": open,
                          }
                        )}
                      />
                    </MenuButton>
                  </div>
                  <MenuItems className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1 ">
                      <MenuItem>
                        <Link href="/songs/add" className={menuItemClass}>
                          Add Song
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <button className={menuItemClass} onClick={onLogout}>
                          Logout
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </>
              )}
            </Menu>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
