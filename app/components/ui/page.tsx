import { WagmiConfig, configureChains, createClient } from "wagmi";
import { goerli, localhost } from "wagmi/chains";
import { ConnectKitProvider } from "connectkit";
import { infuraProvider } from 'wagmi/providers/infura'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const { chains, provider, webSocketProvider } = configureChains(
  [goerli, localhost],
  [infuraProvider({ apiKey: process.env.INFURA as string, stallTimeout: 1_000 }),
  jsonRpcProvider({
    rpc: (chain) => ({
      http: `http://0.0.0.0:8545/`,
    }),
  })],
);

type WalletConnectOptionsProps =
  | {
    version: '2';
    projectId: string;
  }
  | {
    version: '1';
  }
  | undefined;

const wcOpts: WalletConnectOptionsProps = { version: '1' };

const client = createClient({
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
        shimChainChangedDisconnect: true,
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Restaking',
        headlessMode: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: false,
        ...wcOpts,
      },
    }),
  ],
  autoConnect: true,
  provider,
  webSocketProvider
});

type Props = {
  children: any;
};

export function Page({ children }: Props): JSX.Element {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  );
};
