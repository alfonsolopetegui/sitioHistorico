"use client";
import styles from "./admin.module.css";
import Image from "next/image";

import { lato } from "@/app/googleFonts/googleFonts";
import AdminMenu from "@/app/components/adminMenu/AdminMenu";
import { useState } from "react";
import CreateComponent from "@/app/components/createComponent/CreateComponent";
import WelcomeAdmin from "@/app/components/atoms/welcomeAdmin/WelcomeAdmin";
import EditComponent from "@/app/components/editComponent/EditComponent";

const page = () => {
  const [active, setActive] = useState("");

  return (
    <div className={`${styles.adminContainer} ${lato.className}`}>
      <div className={styles.displayLeft}>
        <h1 className={styles.menuTitle}>Admin</h1>
        <section className={styles.userInterface}>
          <div className={styles.imageContainer}>
            <Image src={"/chiche.png"} width={250} height={250} />
          </div>
          <h4 className={styles.userName}>Chiche</h4>
        </section>
        <AdminMenu active={active} setActive={setActive} />
      </div>
      <div className={styles.displayRight}>
        {active === "newPub" ? (
          <CreateComponent active={active} setActive={setActive} />
        ) : active === "editPub" ? (
          <EditComponent active={active} setActive={setActive} />
        ) : (
          <WelcomeAdmin />
        )}
      </div>
    </div>
  );
};

export default page;
