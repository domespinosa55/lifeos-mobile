// Root Layout - 2026 Design System
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CONFIG } from '../src/constants/config';

const { COLORS } = CONFIG;

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.surface,
          },
          headerTintColor: COLORS.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          contentStyle: {
            backgroundColor: COLORS.background,
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
