import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="marketplace/[id]"
          options={{
            headerShown: true,
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="communities/[id]"
          options={{
            headerShown: true,
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="events/[id]"
          options={{
            headerShown: true,
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            headerShown: true,
            headerTitle: 'Notifications',
            headerTitleStyle: { fontWeight: '700', fontSize: 18 },
            headerBackTitle: '',
          }}
        />
        <Stack.Screen
          name="earnings"
          options={{
            headerShown: true,
            headerTitle: 'My Earnings',
            headerTitleStyle: { fontWeight: '700', fontSize: 18 },
            headerBackTitle: '',
          }}
        />
        <Stack.Screen
          name="post-service"
          options={{
            headerShown: true,
            headerTitle: 'Post a Service',
            headerTitleStyle: { fontWeight: '700', fontSize: 18 },
            headerBackTitle: '',
          }}
        />
        <Stack.Screen
          name="create-event"
          options={{
            headerShown: true,
            headerTitle: 'Create Event',
            headerTitleStyle: { fontWeight: '700', fontSize: 18 },
            headerBackTitle: '',
          }}
        />
        <Stack.Screen
          name="admin"
          options={{
            headerShown: true,
            headerTitle: 'Admin Panel',
            headerTitleStyle: { fontWeight: '700', fontSize: 18 },
            headerBackTitle: '',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
