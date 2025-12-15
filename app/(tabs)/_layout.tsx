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
            height: 70,
            paddingBottom: 12,
            paddingTop: 8,

         },

         tabBarItemStyle: {
            marginHorizontal: 8,
            borderRadius: 14,
         },

         tabBarLabelStyle: {
            fontSize: 12,
            fontWeight:"600"
         },
         headerShown: false,

      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Todos',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'checkmark-done' : 'checkmark-done-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;