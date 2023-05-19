import React, { useEffect, useState } from "react";

import style from "./Lottery.module.scss";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import lotteryAbi from "../../constants/lotteryAbi.json";
import lotteryAddress from "../../constants/lotteryAddress.json";
import { ethers } from "ethers";
import { countDownTimer, isEnded } from "../../utils/countDown";
import { BsArrowRightShort } from "react-icons/bs";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";

const expectedChainId = 11155111;

const lotteryConfig = {
  address: lotteryAddress[expectedChainId],
  abi: lotteryAbi,
};

const Lottery = () => {
  const [countDown, setCountDown] = useState("");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();

  const { data: endTime } = useContractRead({
    ...lotteryConfig,
    functionName: "endTime",
    watch: true,
    select: (data) => {
      return Number(data);
    },
  });

  const { data: numOfPlayers } = useContractRead({
    ...lotteryConfig,
    functionName: "getNumberOfPlayers",
    watch: true,
    select: (data) => {
      return data.toString();
    },
  });

  const { data: lotteryBalance } = useContractRead({
    ...lotteryConfig,
    functionName: "lotteryBalance",
    watch: true,
    select: (data) => {
      return ethers.utils.formatEther(data.toString());
    },
  });

  const { data: entranceFeePerUSD } = useContractRead({
    ...lotteryConfig,
    functionName: "entranceFee",
    watch: true,
    select: (data) => {
      return ethers.utils.formatEther(data.toString());
    },
  });
  const { data: entranceFeePerETH } = useContractRead({
    ...lotteryConfig,
    functionName: "getEntranceFeePerETH",
    watch: true,
  });

  const { data: lastWinner } = useContractRead({
    ...lotteryConfig,
    functionName: "recentWinner",
    watch: true,
  });

  const { data: balance } = useContractRead({
    ...lotteryConfig,
    functionName: "balance",
    args: [address],
    watch: true,
    select: (data) => {
      return ethers.utils.formatEther(data.toString());
    },
  });

  const { data: joinData, write: joinLottery } = useContractWrite({
    ...lotteryConfig,
    functionName: "joinLottery",
    overrides: {
      value: entranceFeePerETH,
    },

    onError(e) {
      setLoading(false);
      toast.error(e.reason);
    },
  });

  const joinTx = useWaitForTransaction({
    hash: joinData?.hash,

    onSuccess() {
      setLoading(false);
      toast.success("Transaction successful");
    },
    onError(e) {
      setLoading(false);
      toast.error(e.reason);
    },
  });

  const { data: withdrawData, write: withdraw } = useContractWrite({
    ...lotteryConfig,
    functionName: "withdraw",

    onError(e) {
      toast.error(e.reason);
    },
  });

  const { isLoading: withdrawLoading } = useWaitForTransaction({
    hash: withdrawData?.hash,

    onSuccess() {
      toast.success("Transaction successful");
    },
    onError(e) {
      toast.error(e.reason);
    },
  });
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (endTime) {
      if (isEnded(endTime)) {
        setCountDown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const timer = setInterval(() => {
        const newCountDown = countDownTimer(endTime);
        setCountDown(newCountDown);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [endTime]);

  const handleJoin = () => {
    setLoading(true);
    joinLottery();
  };

  return (
    <div className={style.lottery}>
      <div className={style.lottery_left}>
        <h2>Most popular decentralized lottery in web3.0</h2>
        <button onClick={handleJoin} disabled={loading}>
          <span>{loading ? "Pending" : "Join lottery"}</span>{" "}
          {loading ? (
            <Oval
              height={20}
              width={20}
              color="#fff"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#fff"
              strokeWidth={3}
              strokeWidthSecondary={3}
            />
          ) : (
            <BsArrowRightShort fontSize={24} />
          )}
        </button>
      </div>

      {mounted && (
        <div className={style.lottery_right}>
          {countDown && (
            <div className={style.lottery_endTime}>
              <div className={style.lottery_endTime_box}>
                <strong>{countDown?.days}</strong>
                <span>days</span>
              </div>

              <span className={style.lottery_endTime_colon}>:</span>

              <div className={style.lottery_endTime_box}>
                <strong>{countDown?.hours}</strong>
                <span>hours</span>
              </div>

              <span className={style.lottery_endTime_colon}>:</span>

              <div className={style.lottery_endTime_box}>
                <strong>{countDown?.minutes}</strong>
                <span>minutes</span>
              </div>
              <span className={style.lottery_endTime_colon}>:</span>

              <div className={style.lottery_endTime_box}>
                <strong>{countDown?.seconds}</strong>
                <span>seconds</span>
              </div>
            </div>
          )}

          <span className={style.lottery_status}>
            <strong>Players</strong> : {numOfPlayers ? numOfPlayers : 0}
          </span>
          <span className={style.lottery_status}>
            <strong>Lottery balance</strong> :{" "}
            {lotteryBalance ? Number(lotteryBalance).toFixed(2) : 0.0} ETH
          </span>
          <span className={style.lottery_status}>
            <strong>Entrance fee per USD</strong> :{" "}
            {entranceFeePerUSD ? Number(entranceFeePerUSD).toFixed(2) : 0.0} $
          </span>
          <span className={style.lottery_status}>
            <strong>Entrance fee per ETH</strong> :{" "}
            {entranceFeePerETH
              ? Number(
                  ethers.utils.formatEther(entranceFeePerETH.toString())
                ).toFixed(2)
              : 0.0}{" "}
            ETH
          </span>
          <span className={style.lottery_status}>
            <strong>Last winner</strong> : {""}
            {lastWinner
              ? `${lastWinner?.slice(0, 5)}...${lastWinner?.slice(
                  lastWinner?.length - 4
                )}`
              : "no address"}
          </span>

          {balance > 0 && (
            <div className={style.lottery_withdraw}>
              <button onClick={() => withdraw()}>
                Withdraw{" "}
                <Oval
                  height={18}
                  width={18}
                  color="#fff"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={withdrawLoading}
                  ariaLabel="oval-loading"
                  secondaryColor="#fff"
                  strokeWidth={3}
                  strokeWidthSecondary={3}
                />
              </button>
              <span>balance {balance}ETH</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Lottery;
