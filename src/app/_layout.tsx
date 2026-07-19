import { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { setupDatabase, seedDatabase } from '../services/dbService';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await setupDatabase();
        await seedDatabase();
        setIsReady(true); // Only set true after seeding finishes
      } catch (e) {
        console.error("DB Init failed", e);
      }
    }
    init();
  }, []);

  if (!isReady) {
    return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size="large"/></View>;
  }

  // Render your Tabs only when ready
  return <Tabs />;
}