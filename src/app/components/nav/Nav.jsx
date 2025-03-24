"use client";
import styles from "./nav.module.css";
import Menu from "../menu/Menu";
import { useState, useRef } from "react";
import HamburgerButton from "../atoms/hamburguer/HamburguerButton";

import { Cinzel } from "next/font/google";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";


const cincel = Cinzel({ subsets: ["latin"], weight: "400" });

const Nav = () => {
  const [isActive, setIsActive] = useState(false);
  const buttonRef = useRef(null);

  const toggleMenu = () => {
    console.log("Toggling menu");
    setIsActive((prev) => !prev);
    console.log(isActive);
  };

  return (
    <div className={styles.navContainer}>
      <div className={styles.leftNav}>
        <Link href={"/archivo"}>
          <h3 className={`${cincel.className}`}>ArchivoHistórico</h3>
        </Link>
      </div>
      <div className={styles.rightNav}>

        <label htmlFor={"search"} className={styles.label}>
          <input type="search" id={"search"} className={styles.search} />
          <FontAwesomeIcon
            icon={faSearch}
            className={`${"fa-fw"} ${styles.icon}`}
          />
        </label>
        {/* <HamburgerButton
          onToggle={toggleMenu}
          isActive={isActive}
          buttonRef={buttonRef}
        /> */}
      </div>
      <Menu handler={toggleMenu} isActive={isActive} buttonRef={buttonRef} />
    </div>
  );
};

export default Nav;
