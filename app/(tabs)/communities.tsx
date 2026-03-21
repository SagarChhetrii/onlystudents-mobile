import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { communities } from '@/data/mockData';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import SectionHeader from '@/components/ui/SectionHeader';
import Badge from '@/components/ui/Badge';

function CommunityCard({ community }: { community: typeof communities[0] }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/communities/${community.id}`)}
      activeOpacity={0.9}
      style={styles.communityCard}
    >
      <View style={[styles.communityIcon, { backgroundColor: community.color + '20' }]}>
        <Text style={styles.communityEmoji}>{community.emoji}</Text>
      </View>
      <View style={styles.communityInfo}>
        <View style={styles.communityNameRow}>
          <Text style={styles.communityName}>{community.name}</Text>
          {community.isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={9} color="#fff" />
            </View>
          )}
        </View>
        <Text style={styles.communityUni}>{community.university}</Text>
        <Text style={styles.communityDesc} numberOfLines={2}>{community.description}</Text>
        <Text style={styles.communityMembers}>👥 {community.members.toLocaleString()} members</Text>
      </View>
      <View style={styles.communityRight}>
        {community.isFollowing ? (
          <View style={styles.followingBtn}>
            <Text style={styles.followingText}>Following</Text>
          </View>
        ) : (
          <View style={styles.followBtn}>
            <Text style={styles.followText}>Follow</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function CommunitiesScreen() {
  const [search, setSearch] = useState('');

  const following = communities.filter((c) => c.isFollowing);
  const discover = communities.filter((c) => !c.isFollowing);

  const filtered = search
    ? communities.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.university.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Communities</Text>
        <Text style={styles.headerSub}>Stay connected with your campus</Text>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.subtext} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clubs, societies..."
            placeholderTextColor={Colors.subtext}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={Colors.subtext} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.body}>
        {filtered ? (
          <>
            <Text style={styles.searchResult}>{filtered.length} results for "{search}"</Text>
            {filtered.map((c) => <CommunityCard key={c.id} community={c} />)}
          </>
        ) : (
          <>
            {/* Following */}
            <SectionHeader title="📌 Communities You Follow" />
            {following.map((c) => <CommunityCard key={c.id} community={c} />)}

            {/* Discover */}
            <SectionHeader title="🌟 Discover More" style={{ marginTop: 12 }} />
            {discover.map((c) => <CommunityCard key={c.id} community={c} />)}
          </>
        )}
      </View>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: '#fff', paddingTop: 56, paddingBottom: 16,
    paddingHorizontal: Spacing.base, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: Colors.text, marginBottom: 2 },
  headerSub: { fontSize: 13, color: Colors.subtext, marginBottom: 14 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F4F6', borderRadius: 14, paddingHorizontal: 14, height: 48,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.text },
  body: { padding: Spacing.base },
  searchResult: { fontSize: 13, color: Colors.subtext, marginBottom: 12 },

  communityCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#fff', borderRadius: BorderRadius.lg,
    padding: 14, marginBottom: 10, ...Shadows.sm,
  },
  communityIcon: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  communityEmoji: { fontSize: 22 },
  communityInfo: { flex: 1 },
  communityNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  communityName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  verifiedBadge: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  communityUni: { fontSize: 11, color: Colors.primary, fontWeight: '600', marginBottom: 4 },
  communityDesc: { fontSize: 12, color: Colors.subtext, lineHeight: 17, marginBottom: 4 },
  communityMembers: { fontSize: 11, color: Colors.subtext },
  communityRight: { paddingTop: 2 },
  followingBtn: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.primary,
  },
  followingText: { fontSize: 12, fontWeight: '600', color: Colors.primary },
  followBtn: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: BorderRadius.full, backgroundColor: Colors.primary,
  },
  followText: { fontSize: 12, fontWeight: '600', color: '#fff' },
});
