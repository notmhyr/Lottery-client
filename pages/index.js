import Head from "next/head";
import Image from "next/image";
import style from "../styles/Home.module.scss";
import Navbar from "../components/Navbar/Navbar";
import Lottery from "../components/Lottery/Lottery";

export default function Home() {
  return (
    <div className={style.container}>
      <Navbar />
      <Lottery />
    </div>
  );
}
