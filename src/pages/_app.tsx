import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Chain, EthosConnectProvider } from "ethos-connect";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <EthosConnectProvider
      ethosConfiguration={{
        // Optional. Required for email signin. Please contact support@ethoswallet.xyz to acquire an API key.
        chain: Chain.SUI_DEVNET, // Optional. Defaults to sui:devnet - An enum containing acceptable chain identifier strings can be imported from the ethos-connect package
        // Optional. Defaults to https://fullnode.devnet.sui.io/
        hideEmailSignIn: true, // Optional.  Defaults to false
      }}
    >
      <Component {...pageProps} />
    </EthosConnectProvider>
  );
}
