import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { currentUser } from '@/data/mockData';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import Avatar from '@/components/ui/Avatar';
import ModernButton from '@/components/ui/ModernButton';

function formatK(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return `${value}`;
}

function profileInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

function ActionTile({
  icon,
  title,
  subtitle,
  color,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.actionTile} activeOpacity={0.88} onPress={onPress}>
      <View style={[styles.actionIconWrap, { backgroundColor: color + '20' }]}>
        <MaterialCommunityIcons name={icon as any} size={18} color={color} />
      </View>
      <Text style={styles.actionTitle} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.actionSubtitle} numberOfLines={1}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}

function SettingsItem({
  icon,
  title,
  subtitle,
  onPress,
  danger = false,
  trailing,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  danger?: boolean;
  trailing?: React.ReactNode;
}) {
  const tone = danger ? Colors.error : Colors.primaryDark;

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      style={styles.settingsItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.settingsIcon, { backgroundColor: tone + '18' }]}>
        <MaterialCommunityIcons name={icon as any} size={18} color={tone} />
      </View>

      <View style={styles.settingsTextWrap}>
        <Text style={[styles.settingsTitle, danger && { color: Colors.error }]}>{title}</Text>
        {subtitle ? <Text style={styles.settingsSubtitle}>{subtitle}</Text> : null}
      </View>

      {trailing || <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textTertiary} />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const [isFreelancer, setIsFreelancer] = useState(currentUser.isFreelancer);
  const [avatarUri] = useState(currentUser.avatar);

  const profileInfo = useMemo(
    () => ({
      initials: profileInitials(currentUser.name),
      joinedYear: currentUser.joinedDate.split(' ')[1],
      emailDomain: currentUser.email.split('@')[1],
    }),
    [],
  );

  const handleChangePhoto = () => {
    Alert.alert('Profile photo', 'Choose a photo source', [
      { text: 'Take photo', onPress: () => Alert.alert('Camera', 'Camera feature coming soon.') },
      { text: 'Choose from gallery', onPress: () => Alert.alert('Gallery', 'Gallery picker coming soon.') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => router.replace('/(auth)/auth'),
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView style={styles.heroWrap}>
        <View style={styles.heroOrbA} />
        <View style={styles.heroOrbB} />

        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.heroEyebrow}>Your Profile</Text>
            <Text style={styles.heroTitle}>Personal dashboard</Text>
          </View>

          <TouchableOpacity
            style={styles.editPill}
            activeOpacity={0.88}
            onPress={() => Alert.alert('Edit Profile', 'Profile editor coming soon.')}
          >
            <MaterialCommunityIcons name="pencil-outline" size={14} color={Colors.white} />
            <Text style={styles.editPillText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <TouchableOpacity
              style={styles.avatarWrap}
              activeOpacity={0.85}
              onPress={handleChangePhoto}
            >
              <Avatar uri={avatarUri} size={82} />
              <View style={styles.cameraBadge}>
                <MaterialCommunityIcons name="camera-outline" size={14} color={Colors.white} />
              </View>
            </TouchableOpacity>

            <View style={styles.profileTextWrap}>
              <Text style={styles.profileName}>{currentUser.name}</Text>
              <Text style={styles.profileRole}>{currentUser.role}</Text>
              <Text style={styles.profileMeta}>
                {currentUser.university} • {currentUser.year}
              </Text>
              <View style={styles.domainPill}>
                <Text style={styles.domainPillText}>{profileInfo.emailDomain}</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatK(currentUser.completedOrders)}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>Rs {formatK(currentUser.earnings)}</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{currentUser.rating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>

          <View style={styles.followStrip}>
            <View style={styles.followCol}>
              <Text style={styles.followCount}>{currentUser.followers}</Text>
              <Text style={styles.followLabel}>Followers</Text>
            </View>
            <View style={styles.followDivider} />
            <View style={styles.followCol}>
              <Text style={styles.followCount}>{currentUser.following}</Text>
              <Text style={styles.followLabel}>Following</Text>
            </View>
            <View style={styles.followDivider} />
            <View style={styles.followCol}>
              <Text style={styles.followCount}>{profileInfo.joinedYear}</Text>
              <Text style={styles.followLabel}>Joined</Text>
            </View>
          </View>

          <View style={styles.ctaRow}>
            <ModernButton
              label="View Earnings"
              variant="primary"
              size="sm"
              onPress={() => router.push('/earnings')}
              fullWidth
              style={styles.ctaButton}
            />
            <ModernButton
              label="Notifications"
              variant="outline"
              size="sm"
              onPress={() => router.push('/notifications')}
              fullWidth
              style={styles.ctaButton}
            />
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.contentWrap}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Text style={styles.sectionSubTitle}>Run your account faster</Text>
        </View>

        <View style={styles.actionGrid}>
          <ActionTile
            icon="briefcase-plus-outline"
            title="Post Service"
            subtitle="Offer your skills"
            color={Colors.primary}
            onPress={() => router.push('/post-service')}
          />
          <ActionTile
            icon="calendar-plus"
            title="Create Event"
            subtitle="Host on campus"
            color="#0F766E"
            onPress={() => router.push('/create-event')}
          />
          <ActionTile
            icon="shield-account-outline"
            title="Admin"
            subtitle="Manage platform"
            color="#B45309"
            onPress={() => router.push('/admin')}
          />
          <ActionTile
            icon="camera-retake"
            title="Update Photo"
            subtitle="Refresh identity"
            color="#7C3AED"
            onPress={handleChangePhoto}
          />
        </View>

        <View style={styles.sectionHeaderRowSpaced}>
          <Text style={styles.sectionTitle}>Preferences</Text>
        </View>

        <View style={styles.settingsCard}>
          <SettingsItem
            icon="briefcase-outline"
            title="Freelancer Mode"
            subtitle={isFreelancer ? 'Visible for student gigs' : 'Hidden from marketplace gigs'}
            trailing={
              <Switch
                value={isFreelancer}
                onValueChange={setIsFreelancer}
                trackColor={{ false: '#D7DFED', true: '#C9DBFF' }}
                thumbColor={isFreelancer ? Colors.primary : '#90A0BA'}
              />
            }
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="account-edit-outline"
            title="Edit profile"
            subtitle="Name, bio, university, and role"
            onPress={() => Alert.alert('Edit profile', 'Profile editor coming soon.')}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="shield-check-outline"
            title="Privacy and security"
            subtitle="Password, sessions, and verification"
            onPress={() => Alert.alert('Security', 'Security settings coming soon.')}
          />
        </View>

        <View style={styles.sectionHeaderRowSpaced}>
          <Text style={styles.sectionTitle}>Session</Text>
        </View>

        <View style={styles.settingsCard}>
          <SettingsItem
            icon="logout"
            title="Log out"
            subtitle="You can log in again anytime"
            danger
            onPress={handleLogout}
            trailing={null}
          />
        </View>

        <Text style={styles.footerText}>
          CampusHive v1.0.0 • {profileInfo.initials} profile experience
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },

  scrollContent: {
    paddingBottom: 110,
  },

  heroWrap: {
    backgroundColor: '#0F2B6B',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    overflow: 'hidden',
  },

  heroOrbA: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 999,
    backgroundColor: '#1C3E8D',
    top: -70,
    right: -45,
  },

  heroOrbB: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 999,
    backgroundColor: '#234A9F',
    bottom: 20,
    left: -32,
  },

  heroTopRow: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  heroEyebrow: {
    ...Typography.label,
    color: '#C8D9FF',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 3,
  },

  heroTitle: {
    ...Typography.h1,
    color: Colors.white,
  },

  editPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  editPillText: {
    ...Typography.bodySmall,
    color: Colors.white,
    fontWeight: '700',
  },

  profileCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: '#D4E2FF',
    backgroundColor: Colors.white,
    padding: Spacing.base,
    ...Shadows.md,
  },

  profileTopRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },

  avatarWrap: {
    position: 'relative',
  },

  cameraBadge: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1A3B82',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },

  profileTextWrap: {
    flex: 1,
    gap: 2,
  },

  profileName: {
    ...Typography.h3,
    color: '#132649',
  },

  profileRole: {
    ...Typography.body,
    color: '#324A75',
    fontWeight: '600',
  },

  profileMeta: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },

  domainPill: {
    marginTop: 4,
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.full,
    backgroundColor: '#EAF1FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  domainPillText: {
    ...Typography.caption,
    color: '#204288',
    fontWeight: '700',
  },

  statsRow: {
    marginTop: Spacing.base,
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  statCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    backgroundColor: '#F4F7FD',
    borderWidth: 1,
    borderColor: '#DFE7F4',
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },

  statValue: {
    ...Typography.h4,
    color: '#173A83',
    fontWeight: '800',
  },

  statLabel: {
    ...Typography.caption,
    color: '#4E5E79',
    marginTop: 2,
  },

  followStrip: {
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#E0E7F3',
    backgroundColor: '#FAFCFF',
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },

  followCol: {
    flex: 1,
    alignItems: 'center',
  },

  followCount: {
    ...Typography.h4,
    color: '#183C87',
    fontWeight: '800',
  },

  followLabel: {
    ...Typography.caption,
    color: '#5A6881',
    marginTop: 2,
  },

  followDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E0E7F3',
  },

  ctaRow: {
    marginTop: Spacing.base,
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  ctaButton: {
    flex: 1,
  },

  contentWrap: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    gap: Spacing.base,
  },

  sectionHeaderRow: {
    gap: 2,
  },

  sectionHeaderRowSpaced: {
    marginTop: 2,
  },

  sectionTitle: {
    ...Typography.h3,
    color: '#132649',
  },

  sectionSubTitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },

  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  actionTile: {
    width: '48.5%',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#DEE6F3',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    ...Shadows.sm,
  },

  actionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },

  actionTitle: {
    ...Typography.body,
    color: '#1A305E',
    fontWeight: '700',
    marginBottom: 2,
  },

  actionSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },

  settingsCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: '#DEE6F3',
    backgroundColor: Colors.white,
    overflow: 'hidden',
    ...Shadows.sm,
  },

  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },

  settingsIcon: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  settingsTextWrap: {
    flex: 1,
  },

  settingsTitle: {
    ...Typography.body,
    color: '#1A305E',
    fontWeight: '700',
  },

  settingsSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: '#E3E9F5',
    marginLeft: 62,
  },

  footerText: {
    marginTop: 2,
    marginBottom: Spacing.md,
    textAlign: 'center',
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
