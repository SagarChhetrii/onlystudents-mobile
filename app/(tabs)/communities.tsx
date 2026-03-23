import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SectionList,
  Text,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { communities } from '@/data/mockData';
import { Colors, Spacing, Typography } from '@/constants/theme';
import ScreenHeader from '@/components/ui/ScreenHeader';
import ModernTextInput from '@/components/ui/ModernTextInput';
import CommunityListItem from '@/components/ui/CommunityListItem';

export default function CommunitiesScreen() {
  const [search, setSearch] = useState('');

  const following = communities.filter((c) => c.isFollowing);
  const discover = communities.filter((c) => !c.isFollowing);

  const filtered = search
    ? communities.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.university.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  const sections = filtered
    ? [{ title: `${filtered.length} Results for "${search}"`, data: filtered }]
    : [
        { title: 'Following', data: following },
        { title: 'Discover', data: discover },
      ];

  const handleFollow = (communityId: string) => {
    // Handle follow/unfollow logic here
    console.log('Toggle follow for:', communityId);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Communities"
        subtitle="Stay connected with your campus"
      />

      <View style={styles.searchSection}>
        <ModernTextInput
          placeholder="Search clubs, societies..."
          value={search}
          onChangeText={setSearch}
          icon={<MaterialCommunityIcons name="magnify" size={20} color={Colors.textTertiary} />}
          style={styles.searchInput}
        />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CommunityListItem
            id={item.id}
            name={item.name}
            university={item.university}
            description={item.description}
            members={item.members}
            isVerified={item.isVerified}
            isFollowing={item.isFollowing}
            icon={item.emoji}
            iconColor={item.color}
            onPress={() => router.push(`/communities/${item.id}`)}
            onFollowPress={() => handleFollow(item.id)}
          />
        )}
        renderSectionHeader={({ section: { title, data } }) =>
          data.length > 0 ? (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{title}</Text>
            </View>
          ) : null
        }
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  searchSection: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInput: {
    marginBottom: 0,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    paddingBottom: 100,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    fontWeight: '700',
  },
});
