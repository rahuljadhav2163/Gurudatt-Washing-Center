import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="adminlogin" />
      <Stack.Screen name="entry" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="usersignup" />
      <Stack.Screen name="home" />
      <Stack.Screen name="render" options={{ headerShown: false }} />
    </Stack>
  );
}
