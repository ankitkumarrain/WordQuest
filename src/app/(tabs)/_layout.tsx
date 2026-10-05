import React from 'react';
import { Tabs } from 'expo-router';
import { BottomTabBar } from '@/components/common/BottomTabBar';
import { colors } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="world-map"
        options={{
          title: 'Worlds',
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Rewards',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
