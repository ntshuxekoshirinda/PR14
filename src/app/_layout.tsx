// src/app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { setupDatabase, seedDatabase } from '../services/dbService';

export default function RootLayout() {
  useEffect(() => {
    async function init() {
      await setupDatabase();
      await seedDatabase(); // This ensures data is fetched and seeded on startup
    }
    init();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="workout" options={{ title: 'Workout Routine' }} />
      <Stack.Screen name="allworkouts" options={{ title: 'All Workouts' }} />
      <Stack.Screen name="exercise" options={{ title: 'Exercise Details' }} />
    </Stack>
  );
}