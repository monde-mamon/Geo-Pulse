import { StyleSheet, View, Text, TouchableOpacity, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  Bell,
  Map,
  Shield,
  Moon,
  CircleHelp as HelpCircle,
} from 'lucide-react-native';
import { useState } from 'react';
import switchTheme from 'react-native-theme-switch-animation';

export default function SettingsScreen() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    switchTheme({
      switchThemeFunction: () => {
        setTheme(theme === 'light' ? 'dark' : 'light'); // your switch theme function
      },
      animationConfig: {
        type: 'fade',
        duration: 900,
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Bell size={20} color="#64748b" />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch value={true} onValueChange={() => {}} />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Map size={20} color="#64748b" />
            <Text style={styles.settingText}>Offline Maps</Text>
          </View>
          <Switch value={false} onValueChange={() => {}} />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Shield size={20} color="#64748b" />
            <Text style={styles.settingText}>Location Privacy</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.settingAction}>Configure</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Moon size={20} color="#64748b" />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <HelpCircle size={20} color="#64748b" />
            <Text style={styles.settingText}>Help & Support</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#1f2937',
  },
  settingAction: {
    fontSize: 16,
    color: '#2563eb',
  },
  version: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
});
