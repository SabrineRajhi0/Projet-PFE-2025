import React from "react";
import { Link } from "react-router-dom";
import { createPopper } from "@popperjs/core";
import { FaBars } from "react-icons/fa";

const PagesDropdown = () => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  return (
    <>
      <a
             className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
             href="#pablo"
             ref={btnDropdownRef}
             onClick={(e) => {
               e.preventDefault();
               dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
             }}
           >
             <FaBars className="mr-2" color="white"/> Menu
           </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        
       
        <Link
          to="/auth/login"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
        >
          Se connecter
        </Link>
        <Link
          to="/auth/register"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
        >
         Inscription
        </Link>
        <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100" />
       
      </div>
    </>
  );
};

export default PagesDropdown;
