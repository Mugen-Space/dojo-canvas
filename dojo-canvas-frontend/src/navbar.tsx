import React from "react";
interface UserProps {
  username: any;
}
export const Navbar = ({ username }: UserProps) => {
  return (
    <header className="navbar bg-gray-800 py-4 px-4 flex justify-between items-center text-white">
      <h1 className="text-xl font-bold">dojo-canvas</h1>
      <p className="text-sm">{username ? username : ""}</p>
    </header>
  );
};
