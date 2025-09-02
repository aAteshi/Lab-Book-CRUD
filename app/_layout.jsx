import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // รอให้โหลด auth state เสร็จ

    const inAuthGroup = segments[0] === "(auth)";

    if (isAuthenticated && inAuthGroup) {
      // ถ้า login แล้วแต่อยู่ในหน้า auth ให้ไปหน้า tabs
      router.replace("/(tabs)");
    } else if (!isAuthenticated && !inAuthGroup) {
      // ถ้ายังไม่ login และไม่อยู่ในหน้า auth ให้ไปหน้า login
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, segments, loading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="book-detail" options={{ 
        headerShown: true,
        title: "Book Details",
        headerStyle: { backgroundColor: "#ff9ec7" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" }
      }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ThemeProvider>
  );
}
