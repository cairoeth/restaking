import { WagmiConfig, createClient } from "wagmi";
import { goerli } from "wagmi/chains";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

const alchemyId = process.env.ALCHEMY_ID;

// Choose which chains you'd like to show
const chains = [goerli];

const client = createClient(
  getDefaultClient({
    appName: "App",
    alchemyId,
    chains,
  }),
);

export function Page({ children }) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  );
};