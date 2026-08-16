import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { setupDatabase, seedDatabase } from '../services/dbService';

export default function RootLayout() {
  useEffect(() => {
    async function init() {
      try {
        await setupDatabase();
        await seedDatabase();
      } catch (e) {
        console.error("Startup initialization error:", e);
      }
    }
    init();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
      <Stack.Screen name="workout" options={{ title: 'Workout Routine' }} />
      <Stack.Screen name="allworkouts" options={{ title: 'All Workouts' }} />
      <Stack.Screen name="abs-circuit" options={{ title: 'Abs Circuit Timer' }} />
      <Stack.Screen name="exercise" options={{ title: 'Exercise Details' }} />
    </Stack>
  );
}