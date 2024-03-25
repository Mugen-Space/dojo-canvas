import React from "react";
interface UserProps {
  username: any;
}
export const Navbar = ({ username }: UserProps) => {
  return (
    <header className="fixed w-full h-16 z-20 navbar bg-[#283618] py-4 px-6 flex justify-between items-center text-white">
      <h1 className="text-xl font-bold">dojo-canvas</h1>
      <p className="text-sm">{username ? username : ""}</p>
    </header>
  );
};
