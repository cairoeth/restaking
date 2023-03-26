import { WagmiConfig, configureChains, createClient } from "wagmi";
import { goerli, gnosis, optimism, scrollTestnet, polygonZkEvmTestnet } from "wagmi/chains";
import { ConnectKitProvider } from "connectkit";
import { infuraProvider } from 'wagmi/providers/infura'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { Chain } from 'wagmi'

export const restaking = {
  id: 690692,
  name: 'Restaking',
  network: 'Restaking',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['http://0.0.0.0:8545/'] },
    default: { http: ['http://0.0.0.0:8545/'] },
  },
} as const satisfies Chain

const { chains, provider, webSocketProvider } = configureChains(
  [goerli, restaking, gnosis, optimism, scrollTestnet, polygonZkEvmTestnet],
  [
    infuraProvider({ apiKey: process.env.INFURA as string, stallTimeout: 1_000 }),
    jsonRpcProvider({
      rpc: () => ({
        http: `http://0.0.0.0:8545/`,
      }),
    }),
  ],
);

const client = createClient({
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
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
        projectId: '5245c2597c09eaa73a4e6fa3209e623e',
        showQrModal: true,
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
        <div className="min-h-screen">
          {children}
        </div>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};
