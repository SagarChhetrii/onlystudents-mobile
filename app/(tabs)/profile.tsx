import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { currentUser } from '@/data/mockData';
import { Colors, BorderRadius, Spacing, Shadows, Typography } from '@/constants/theme';
import Avatar from '@/components/ui/Avatar';

function SettingRow({
  icon, label, value, onPress, hasChevron = true, color = Colors.primary,
}: {
  icon: string; label: string; value?: string; onPress?: () => void; hasChevron?: boolean; color?: string;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.settingRow} activeOpacity={0.7}>
      <View style={[styles.settingIcon, { backgroundColor: color + '15' }]}>
        <MaterialCommunityIcons name={icon as any} size={20} color={color} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        {value && <Text style={styles.settingValue}>{value}</Text>}
      </View>
      {hasChevron && <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textTertiary} />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const [isFreelancer, setIsFreelancer] = useState(currentUser.isFreelancer);
  const [avatarUri, setAvatarUri] = useState(currentUser.avatar);

  const handleChangePhoto = () => {
    Alert.alert('Change Profile Picture', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: () => Alert.alert('Camera', 'Camera feature coming soon'),
      },
      {
        text: 'Choose from Gallery',
        onPress: () => Alert.alert('Gallery', 'Gallery picker coming soon'),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileRow}>
            <TouchableOpacity activeOpacity={0.7} style={styles.avatarContainer} onPress={handleChangePhoto}>
              <Avatar uri={avatarUri} size={76} />
              <View style={styles.cameraIcon}>
                <MaterialCommunityIcons name="camera" size={16} color={Colors.white} />
              </View>
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{currentUser.name}</Text>
              <Text style={styles.university}>{currentUser.university}</Text>
              <Text style={styles.year}>{currentUser.year}</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsGrid}>
            {[
              { label: 'Orders', value: currentUser.completedOrders, icon: 'check-circle' },
              { label: 'Earnings', value: `₹${(currentUser.earnings / 1000).toFixed(1)}k`, icon: 'wallet' },
              { label: 'Rating', value: currentUser.rating.toFixed(1), icon: 'star' },
              { label: 'Joined', value: currentUser.joinedDate.split(' ')[1], icon: 'calendar' },
            ].map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <MaterialCommunityIcons
                  name={stat.icon as any}
                  size={20}
                  color={Colors.primary}
                  style={{ marginBottom: Spacing.xs }}
                />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Followers row */}
          <View style={styles.followRow}>
            <View style={styles.followItem}>
              <Text style={styles.followCount}>{currentUser.followers}</Text>
              <Text style={styles.followLabel}>Followers</Text>
            </View>
            <View style={styles.followDivider} />
            <View style={styles.followItem}>
              <Text style={styles.followCount}>{currentUser.following}</Text>
              <Text style={styles.followLabel}>Following</Text>
            </View>
            <View style={styles.followDivider} />
            <View style={styles.followItem}>
              <Text style={styles.followCount}>{currentUser.email.split('@')[1]}</Text>
              <Text style={styles.followLabel}>Domain</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.body}>
        {/* Freelancer Toggle */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleLeft}>
            <View style={[styles.settingIcon, { backgroundColor: Colors.primary + '15' }]}>
              <MaterialCommunityIcons name="briefcase" size={20} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.toggleTitle}>Freelancer Mode</Text>
              <Text style={styles.toggleSub}>Offer your services on campus</Text>
            </View>
          </View>
          <Switch
            value={isFreelancer}
            onValueChange={setIsFreelancer}
            trackColor={{ false: Colors.border, true: Colors.primary + '40' }}
            thumbColor={isFreelancer ? Colors.primary : Colors.border}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.card}>
            <SettingRow
              icon="wallet"
              label="Earnings & Analytics"
              value="₹24.5k"
              onPress={() => router.push('/earnings')}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="bell"
              label="Notifications"
              onPress={() => router.push('/notifications')}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="plus-circle"
              label="Post a New Service"
              onPress={() => router.push('/post-service')}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="calendar"
              label="Create an Event"
              onPress={() => router.push('/create-event')}
            />
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <SettingRow
              icon="camera"
              label="Change Profile Picture"
              color={Colors.primary}
              onPress={handleChangePhoto}
            />
            <View style={styles.divider} />
            <SettingRow icon="account-edit" label="Edit Profile" onPress={() => {}} />
            <View style={styles.divider} />
            <SettingRow icon="briefcase" label="Professional Info" value={isFreelancer ? 'Freelancer' : 'Student'} onPress={() => {}} />
            <View style={styles.divider} />
            <SettingRow icon="lock" label="Change Password" onPress={() => {}} />
            <View style={styles.divider} />
            <SettingRow icon="shield-check" label="Privacy & Security" onPress={() => {}} />
          </View>
        </View>

        {/* Admin */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin</Text>
          <View style={styles.card}>
            <SettingRow
              icon="cog"
              label="Admin Panel"
              color={Colors.warning}
              onPress={() => router.push('/admin')}
            />
          </View>
        </View>

        {/* Logout */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <View style={styles.card}>
            <SettingRow
              icon="logout"
              label="Log Out"
              color={Colors.error}
              hasChevron={false}
              onPress={() => {
                Alert.alert('Log Out', 'Are you sure you want to log out?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Log Out', style: 'destructive', onPress: () => router.replace('/(auth)/auth') },
                ]);
              }}
            />
          </View>
          <View style={styles.versionContainer}>
            <Text style={styles.version}>onlyStudents v1.0.0 · Made with </Text>
            <MaterialCommunityIcons name="heart" size={12} color={Colors.error} style={{ marginHorizontal: 2 }} />
            <Text style={styles.version}> in India</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    paddingTop: 40,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.base,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerContent: {
    gap: Spacing.md,
  },
  profileRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    padding: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  profileInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  name: {
    ...Typography.h2,
    color: Colors.text,
  },
  university: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  year: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },

  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    ...Typography.h4,
    color: Colors.text,
    marginTop: 2,
    fontWeight: '700',
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  followRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  followItem: {
    flex: 1,
    alignItems: 'center',
  },
  followCount: {
    ...Typography.h4,
    color: Colors.text,
    fontWeight: '700',
  },
  followLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  followDivider: {
    width: 1,
    height: 26,
    backgroundColor: Colors.border,
  },

  scrollContent: {
    flexGrow: 1,
  },
  body: {
    padding: Spacing.base,
    paddingBottom: Spacing.md,
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  toggleTitle: {
    ...Typography.h4,
    color: Colors.text,
    fontWeight: '700',
  },
  toggleSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },

  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  settingLabel: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  settingValue: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 56,
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  version: {
    textAlign: 'center',
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
