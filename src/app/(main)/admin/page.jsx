"use client";
import styles from "./admin.module.css";

import { lato } from "@/app/googleFonts/googleFonts";
import AdminMenu from "@/app/components/adminMenu/AdminMenu";
import { useState } from "react";
import CreateComponent from "@/app/components/createComponent/CreateComponent";
import WelcomeAdmin from "@/app/components/atoms/welcomeAdmin/WelcomeAdmin";
import EditComponent from "@/app/components/editComponent/EditComponent";
import EditCategories from "@/app/components/editCategories/EditCategories";
import SignUpForm from "@/app/components/signupform/SignUpForm";
import { SessionProvider } from "next-auth/react";

const Page = () => {
  const [active, setActive] = useState("");

  return (
    <div className={`${styles.adminContainer} ${lato.className}`}>
      <SessionProvider>
        <div className={styles.displayLeft}>
          <h1 className={styles.menuTitle}>Admin</h1>
          <section className={styles.userInterface}>
            {/* <div className={styles.imageContainer}>
            <Image src={"/chiche.png"} width={250} height={250} />
          </div> */}
          </section>
          <AdminMenu active={active} setActive={setActive} />
        </div>
        <div className={styles.displayRight}>
          {active === "newPub" ? (
            <CreateComponent active={active} setActive={setActive} />
          ) : active === "editPub" ? (
            <EditComponent active={active} setActive={setActive} />
          ) : active === "categories" ? (
            <EditCategories active={active} setActive={setActive} />
          ) : active === "newUser" ? (
            <SignUpForm />
          ) : (
            <WelcomeAdmin />
          )}
        </div>
      </SessionProvider>
    </div>
  );
};

export default Page;
