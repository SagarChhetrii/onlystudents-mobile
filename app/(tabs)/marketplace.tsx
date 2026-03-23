import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { freelancers, categories } from '@/data/mockData';
import { Colors, BorderRadius, Spacing, Shadows, Typography } from '@/constants/theme';
import Avatar from '@/components/ui/Avatar';
import StarRating from '@/components/ui/StarRating';
import ScreenHeader from '@/components/ui/ScreenHeader';

// ============================================================================
// FREELANCER CARD COMPONENT
// ============================================================================
function FreelancerCard({ item, index }: { item: typeof freelancers[0]; index: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const minPrice = Math.min(...item.services.map((s) => s.price));

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <TouchableOpacity
        onPress={() => router.push(`/marketplace/${item.id}`)}
        activeOpacity={0.85}
        style={styles.card}
      >
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <Avatar uri={item.avatar} size={48} />
          {item.isVerified && (
            <View style={styles.verifiedBadge}>
              <MaterialCommunityIcons name="check-circle" size={16} color={Colors.success} />
            </View>
          )}
        </View>

        {/* Name and Role */}
        <Text style={styles.freelancerName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.freelancerRole} numberOfLines={2}>
          {item.role}
        </Text>

        {/* University */}
        <Text style={styles.university} numberOfLines={1}>
          {item.university}
        </Text>

        {/* Rating */}
        <View style={styles.ratingSection}>
          <StarRating rating={item.rating} reviews={item.reviews} size="sm" />
        </View>

        {/* Bottom Section - Price and Orders */}
        <View style={styles.bottomSection}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>From</Text>
            <Text style={styles.price}>₹{minPrice}</Text>
          </View>
          <Text style={styles.ordersCount}>{item.completedOrders} orders</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}


// ============================================================================
// CATEGORY FILTER CHIPS
// ============================================================================
function CategoryFilter({
  categories: cats,
  activeCategory,
  onCategoryChange,
}: {
  categories: typeof categories;
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContent}
      style={styles.categoriesScroll}
    >
      {/* All Categories Chip */}
      <TouchableOpacity
        onPress={() => onCategoryChange('all')}
        activeOpacity={0.7}
        style={[styles.categoryChip, activeCategory === 'all' && styles.categoryChipActive]}
      >
        <MaterialCommunityIcons
          name="apps"
          size={16}
          color={activeCategory === 'all' ? Colors.white : Colors.primary}
        />
        <Text
          style={[
            styles.categoryChipText,
            activeCategory === 'all' && styles.categoryChipTextActive,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      {/* Individual Category Chips */}
      {cats.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => onCategoryChange(category.id)}
          activeOpacity={0.7}
          style={[
            styles.categoryChip,
            activeCategory === category.id && styles.categoryChipActive,
          ]}
        >
          <MaterialCommunityIcons
            name={category.icon}
            size={16}
            color={activeCategory === category.id ? Colors.white : Colors.primary}
          />
          <Text
            style={[
              styles.categoryChipText,
              activeCategory === category.id && styles.categoryChipTextActive,
            ]}
          >
            {category.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ============================================================================
// MAIN MARKETPLACE SCREEN
// ============================================================================
export default function MarketplaceScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter freelancers based on search and category
  const filteredFreelancers = freelancers.filter((freelancer) => {
    const matchesSearch =
      searchQuery === '' ||
      freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freelancer.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeCategory === 'all' || freelancer.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Handle search clear
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Render empty state
  const renderEmpty = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyIconBox}>
        <MaterialCommunityIcons name="magnify" size={50} color={Colors.textSecondary} />
      </View>
      <Text style={styles.emptyStateTitle}>No freelancers found</Text>
      <Text style={styles.emptyStateSubtitle}>Try adjusting your search or filter</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <ScreenHeader title="Marketplace" subtitle="Find talented campus creators" />

      {/* Search Bar Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchBarContainer}>
          <MaterialCommunityIcons name="magnify" size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchBarInput}
            placeholder="Search by name or skill..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} activeOpacity={0.6}>
              <MaterialCommunityIcons name="close-circle" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Freelancers Grid */}
      <FlatList
        data={filteredFreelancers}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        ListHeaderComponent={
          <Text style={styles.resultsHeader}>
            {filteredFreelancers.length} {filteredFreelancers.length === 1 ? 'freelancer' : 'freelancers'} found
          </Text>
        }
        ListEmptyComponent={renderEmpty()}
        renderItem={({ item, index }) => <FreelancerCard item={item} index={index} />}
      />
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  // ========================================================================
  // MAIN CONTAINER
  // ========================================================================
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },

  // ========================================================================
  // SEARCH SECTION
  // ========================================================================
  searchSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },

  searchBarInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.text,
    padding: 0,
  },

  // ========================================================================
  // CATEGORY FILTER SECTION
  // ========================================================================
  categoriesScroll: {
    maxHeight: 56,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  categoriesContent: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },

  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1.2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: Spacing.xs,
    minHeight: 40,
  },

  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },

  categoryChipTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },

  // ========================================================================
  // GRID SECTION
  // ========================================================================
  gridContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: 100,
    backgroundColor: Colors.surface,
  },

  gridRow: {
    gap: Spacing.base,
    marginBottom: Spacing.base,
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 0,
  },

  resultsHeader: {
    ...Typography.h4,
    color: Colors.text,
    fontWeight: '700',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },

  // ========================================================================
  // FREELANCER CARD
  // ========================================================================
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
    minHeight: 300,
    justifyContent: 'space-between',
    maxWidth: '100%',
  },

  avatarContainer: {
    position: 'relative',
    width: 48,
    height: 48,
    marginBottom: Spacing.md,
  },

  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  freelancerName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },

  freelancerRole: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: Spacing.xs,
  },

  university: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },

  ratingSection: {
    marginVertical: Spacing.sm,
  },

  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: Spacing.md,
  },

  priceContainer: {
    flexDirection: 'column',
  },

  priceLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },

  price: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },

  ordersCount: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  // ========================================================================
  // EMPTY STATE
  // ========================================================================
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },

  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },

  emptyStateTitle: {
    ...Typography.h3,
    color: Colors.text,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },

  emptyStateSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
});
