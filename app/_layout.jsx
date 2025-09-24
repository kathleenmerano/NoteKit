import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        {/* Landing page: hide header */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Authentication screens */}
        <Stack.Screen 
          name="login" 
          options={{ 
            title: "", 
            headerBackTitleVisible: false,
            headerStyle: { backgroundColor: "#fdfcf7" }, // match your login background
            headerTintColor: "#000", // back arrow color
            headerTitleStyle: { fontWeight: "600", fontSize: 18 },
          }} 
        />
        <Stack.Screen 
            name="signup" 
            options={{ 
              title: "", 
              headerBackTitleVisible: false,
              headerStyle: { backgroundColor: "#fdfcf7" }, // match your signup background
              headerTintColor: "#000", // back arrow color
              headerTitleStyle: { fontWeight: "600", fontSize: 18 },
            }} 
        />

        {/* Home: hide header */}
        <Stack.Screen name="notes/home" options={{ headerShown: false }} />

        {/* Notes (dynamic) screen: hide header */}
        <Stack.Screen name="notes" options={{ headerShown: false }} />

        {/* Create Note screen: hide header */}
        <Stack.Screen name="notes/create" options={{ headerShown: false }} />

        {/* Edit Note screen: hide header */}
        <Stack.Screen name="notes/edit" options={{ headerShown: false }} />
        <Stack.Screen name="notes/recycleBin" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
