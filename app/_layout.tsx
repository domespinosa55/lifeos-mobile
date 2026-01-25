// Root Layout
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CONFIG } from '../src/constants/config';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: CONFIG.COLORS.surface,
          },
          headerTintColor: CONFIG.COLORS.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: CONFIG.COLORS.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
