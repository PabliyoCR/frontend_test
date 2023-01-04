import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pay.app',
  appName: 'pay',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    cleartext: true,
  },
};

export default config;
