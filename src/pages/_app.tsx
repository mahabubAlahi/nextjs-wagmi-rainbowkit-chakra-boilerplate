import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chains, wagmiConfig } from "config/wagmi";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import "styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig } from "wagmi";
import {
  ChakraBaseProvider,
  extendBaseTheme,
  extendTheme,
} from "@chakra-ui/react";
// `@chakra-ui/theme` is a part of the base install with `@chakra-ui/react`
import chakraTheme from "@chakra-ui/theme";

function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const theme = extendTheme({
    colors: {
      teal: {
        100: "#f7fafc",
        // ...
        900: "#1a202c",
      },
    },
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <ChakraBaseProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraBaseProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
