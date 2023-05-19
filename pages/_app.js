import "../styles/globals.scss";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { sepolia } from "wagmi/chains";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { Roboto } from "next/font/google";

const { provider, webSocketProvider } = configureChains(
  [sepolia],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="dark"
      />
      <main className={roboto.className}>
        <Component {...pageProps} />
      </main>
    </WagmiConfig>
  );
}

export default MyApp;
