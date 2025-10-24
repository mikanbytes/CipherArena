import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Cipher Arena',
  projectId: 'cipher-arena-public',
  chains: [sepolia],
  ssr: false,
});
