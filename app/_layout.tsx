import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthGate } from '@/providers/auth-gate';
import { QueryProvider } from '@/providers/query-provider';

export const unstable_settings = {
  anchor: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryProvider>
      <AuthGate>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="otp" options={{ headerShown: false }} />
            <Stack.Screen name="email" options={{ headerShown: false }} />
            <Stack.Screen name="password" options={{ headerShown: false }} />
            <Stack.Screen name="name" options={{ headerShown: false }} />
            <Stack.Screen name="deal" options={{ headerShown: false }} />
            <Stack.Screen name="food-details" options={{ headerShown: false }} />
            <Stack.Screen name="book" options={{ headerShown: false }} />
            <Stack.Screen name="details" options={{ headerShown: false }} />
            <Stack.Screen name="booked" options={{ headerShown: false }} />
            <Stack.Screen name="cart" options={{ headerShown: false }} />
            <Stack.Screen name="checkout" options={{ headerShown: false }} />
            <Stack.Screen name="map" options={{ headerShown: false }} />
            <Stack.Screen name="hotspots" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthGate>
    </QueryProvider>
  );
}
