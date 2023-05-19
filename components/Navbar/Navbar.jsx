import React, { useEffect, useState } from "react";
import style from "./Navbar.module.scss";
import { useAccount, useConnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { Oval } from "react-loader-spinner";
import { Bangers } from "next/font/google";

const bangers = Bangers({
  weight: ["400"],
  subsets: ["latin"],
});
const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();

  const { connect, isLoading: isConnecting } = useConnect({
    connector: new MetaMaskConnector(),
    chainId: 11155111,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={style.navbar}>
      <div>
        <h1 className={bangers.className}>LOTTERY</h1>
      </div>

      <div>
        {mounted && (
          <button onClick={connect} disabled={isConnecting || isConnected}>
            {isConnecting ? (
              <div className={style.btn_connecting}>
                connecting
                <Oval
                  height={21}
                  width={21}
                  color="#fff"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                  ariaLabel="oval-loading"
                  secondaryColor="#fff"
                  strokeWidth={3}
                  strokeWidthSecondary={3}
                />
              </div>
            ) : isConnected ? (
              <span>
                {`${address.slice(0, 5)}...${address.slice(
                  address.length - 4
                )}`}
              </span>
            ) : (
              "Connect wallet"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
