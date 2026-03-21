import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, FlatList, Animated,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { freelancers, categories } from '@/data/mockData';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import Avatar from '@/components/ui/Avatar';
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';

function FreelancerCard({ item, index }: { item: typeof freelancers[0]; index: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 350, delay: index * 80, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 350, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const minPrice = Math.min(...item.services.map((s) => s.price));

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }], width: '48%' }}>
      <TouchableOpacity
        onPress={() => router.push(`/marketplace/${item.id}`)}
        activeOpacity={0.9}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <Avatar uri={item.avatar} size={52} />
          {item.isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={10} color="#fff" />
            </View>
          )}
        </View>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.role} numberOfLines={2}>{item.role}</Text>
        <Text style={styles.university} numberOfLines={1}>{item.university}</Text>
        <StarRating rating={item.rating} reviews={item.reviews} size="sm" />
        <View style={styles.cardFooter}>
          <Text style={styles.price}>From ₹{minPrice}</Text>
          <Text style={styles.orders}>{item.completedOrders} orders</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function MarketplaceScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = freelancers.filter((f) => {
    const matchesSearch =
      search === '' ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.role.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'all' || f.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <Text style={styles.headerSub}>Find talented campus creators</Text>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.subtext} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services, skills..."
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

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
        style={styles.categoriesScroll}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setActiveCategory(cat.id)}
            activeOpacity={0.8}
            style={[styles.chip, activeCategory === cat.id && styles.chipActive]}
          >
            <Text style={styles.chipIcon}>{cat.icon}</Text>
            <Text style={[styles.chipLabel, activeCategory === cat.id && styles.chipLabelActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.resultCount}>
            {filtered.length} {filtered.length === 1 ? 'freelancer' : 'freelancers'} found
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No freelancers found</Text>
            <Text style={styles.emptySubText}>Try a different category or search term</Text>
          </View>
        }
        renderItem={({ item, index }) => <FreelancerCard item={item} index={index} />}
      />
    </View>
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
  categoriesScroll: { maxHeight: 56, backgroundColor: '#fff' },
  categories: { paddingHorizontal: Spacing.base, paddingVertical: 10, gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipIcon: { fontSize: 13 },
  chipLabel: { fontSize: 13, fontWeight: '600', color: Colors.subtext },
  chipLabelActive: { color: '#fff' },
  list: { padding: Spacing.base, paddingBottom: 80 },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  resultCount: { fontSize: 13, color: Colors.subtext, marginBottom: 12 },
  card: {
    backgroundColor: '#fff', borderRadius: BorderRadius.lg,
    padding: 14, ...Shadows.md,
  },
  cardHeader: { position: 'relative', marginBottom: 10, width: 52 },
  verifiedBadge: {
    position: 'absolute', bottom: -2, right: -2,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#fff',
  },
  name: { fontSize: 14, fontWeight: '700', color: Colors.text },
  role: { fontSize: 11, color: Colors.subtext, lineHeight: 15, marginTop: 2, marginBottom: 4 },
  university: { fontSize: 10, color: Colors.primary, fontWeight: '600', marginBottom: 6 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  price: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  orders: { fontSize: 10, color: Colors.subtext },
  emptyState: { alignItems: 'center', paddingTop: 48 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  emptySubText: { fontSize: 14, color: Colors.subtext, textAlign: 'center' },
});
