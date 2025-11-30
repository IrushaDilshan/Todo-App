import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTheme } from '@react-navigation/native';


const TabsLayout = () => {
    const { colors } = useTheme ();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: { 
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            borderTopWidth:1,
            height: 90,
            paddingBottom: 30,
            paddingTop: 10,

         },

         tabBarLabelStyle: {
            fontSize: 14,
            fontWeight:"600"
         },
         headerShown: false,

      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Todos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flash-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: 'setting',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;