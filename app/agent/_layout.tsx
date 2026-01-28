// Agent Layout
import { Stack } from 'expo-router';
import { CONFIG } from '../../src/constants/config';

const { COLORS } = CONFIG;

export default function AgentLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    />
  );
}
