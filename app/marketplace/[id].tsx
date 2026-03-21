import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { freelancers } from '@/data/mockData';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import Avatar from '@/components/ui/Avatar';
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';
import PrimaryButton from '@/components/ui/PrimaryButton';
import Card from '@/components/ui/Card';

const { width: W } = Dimensions.get('window');
const PORTFOLIO_IMGS = [
  'https://picsum.photos/seed/p1/300/200',
  'https://picsum.photos/seed/p2/300/200',
  'https://picsum.photos/seed/p3/300/200',
  'https://picsum.photos/seed/p4/300/200',
];

export default function FreelancerProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const freelancer = freelancers.find((f) => f.id === id);
  const [selectedPackage, setSelectedPackage] = useState(0);

  if (!freelancer) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Freelancer not found</Text>
      </View>
    );
  }

  const service = freelancer.services[selectedPackage];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient colors={['#3730A3', '#4F46E5', '#7C3AED']} style={styles.hero}>
        <View style={styles.heroContent}>
          <View style={styles.avatarWrapper}>
            <Avatar uri={freelancer.avatar} size={88} showBorder borderColor="rgba(255,255,255,0.5)" />
            {freelancer.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={12} color="#fff" />
              </View>
            )}
          </View>
          <Text style={styles.heroName}>{freelancer.name}</Text>
          <Text style={styles.heroRole}>{freelancer.role}</Text>
          <Text style={styles.heroUni}>🎓 {freelancer.university}</Text>

          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{freelancer.rating.toFixed(1)}</Text>
              <Text style={styles.heroStatLabel}>Rating</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{freelancer.reviews}</Text>
              <Text style={styles.heroStatLabel}>Reviews</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{freelancer.completedOrders}</Text>
              <Text style={styles.heroStatLabel}>Orders</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        {/* Response Time */}
        <View style={styles.responseRow}>
          <Ionicons name="flash" size={14} color={Colors.success} />
          <Text style={styles.responseText}>Responds in {freelancer.responseTime}</Text>
        </View>

        {/* Bio */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{freelancer.bio}</Text>
        </Card>

        {/* Skills */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skills}>
            {freelancer.skills.map((skill) => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Service Packages */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Service Packages</Text>
          <View style={styles.packageTabs}>
            {freelancer.services.map((s, i) => (
              <TouchableOpacity
                key={s.id}
                onPress={() => setSelectedPackage(i)}
                style={[styles.packageTab, selectedPackage === i && styles.packageTabActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.packageTabText, selectedPackage === i && styles.packageTabTextActive]}>
                  {s.title.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.packageDetail}>
            <Text style={styles.packageTitle}>{service.title}</Text>
            <Text style={styles.packageDesc}>{service.description}</Text>
            <View style={styles.packageMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color={Colors.subtext} />
                <Text style={styles.metaText}>{service.delivery} delivery</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="refresh-outline" size={14} color={Colors.subtext} />
                <Text style={styles.metaText}>{service.revisions} revisions</Text>
              </View>
            </View>
            <View style={styles.packagePriceRow}>
              <Text style={styles.packagePrice}>₹{service.price}</Text>
              <PrimaryButton
                title="Order Now"
                onPress={() => Alert.alert('Order Placed!', `Your order for "${service.title}" has been placed.`)}
                size="sm"
              />
            </View>
          </View>
        </Card>

        {/* Portfolio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.portfolio}>
            {PORTFOLIO_IMGS.map((uri, i) => (
              <Image
                key={i}
                source={{ uri }}
                style={styles.portfolioImg}
                contentFit="cover"
              />
            ))}
          </ScrollView>
        </View>

        {/* Reviews */}
        <View style={[styles.section, { marginBottom: 40 }]}>
          <Text style={styles.sectionTitle}>
            Reviews ({freelancer.reviews})
          </Text>
          <View style={styles.overallRating}>
            <Text style={styles.ratingBig}>{freelancer.rating.toFixed(1)}</Text>
            <View>
              <StarRating rating={freelancer.rating} size="lg" showCount={false} />
              <Text style={styles.ratingNote}>Based on {freelancer.reviews} reviews</Text>
            </View>
          </View>
          {freelancer.reviews_list.map((review, i) => (
            <Card key={i} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Avatar name={review.author} size={32} />
                <View style={styles.reviewMeta}>
                  <Text style={styles.reviewAuthor}>{review.author}</Text>
                  <StarRating rating={review.rating} size="sm" showCount={false} />
                </View>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { fontSize: 16, color: Colors.subtext },
  hero: { paddingTop: 100, paddingBottom: 28 },
  heroContent: { alignItems: 'center', paddingHorizontal: Spacing.base },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  verifiedBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  heroName: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  heroRole: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  heroUni: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 16 },
  heroStats: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16,
    paddingHorizontal: 20, paddingVertical: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatValue: { color: '#fff', fontSize: 20, fontWeight: '800' },
  heroStatLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 2 },
  heroStatDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.2)' },
  body: { padding: Spacing.base },
  responseRow: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    marginBottom: 12, backgroundColor: Colors.success + '12',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  responseText: { fontSize: 12, color: Colors.success, fontWeight: '600' },
  card: { marginBottom: 14 },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  bio: { fontSize: 14, color: Colors.subtext, lineHeight: 21 },
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: {
    backgroundColor: Colors.primary + '14', borderRadius: BorderRadius.full,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  skillText: { fontSize: 12, fontWeight: '600', color: Colors.primary },
  packageTabs: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  packageTab: {
    flex: 1, paddingVertical: 8, borderRadius: 10,
    backgroundColor: '#F3F4F6', alignItems: 'center',
  },
  packageTabActive: { backgroundColor: Colors.primary },
  packageTabText: { fontSize: 12, fontWeight: '600', color: Colors.subtext },
  packageTabTextActive: { color: '#fff' },
  packageDetail: {},
  packageTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  packageDesc: { fontSize: 13, color: Colors.subtext, lineHeight: 19, marginBottom: 12 },
  packageMeta: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: Colors.subtext },
  packagePriceRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  packagePrice: { fontSize: 24, fontWeight: '800', color: Colors.text },
  portfolio: { marginHorizontal: -Spacing.base, paddingHorizontal: Spacing.base },
  portfolioImg: {
    width: 180, height: 120, borderRadius: 12, marginRight: 10,
  },
  overallRating: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    marginBottom: 14, padding: 16,
    backgroundColor: '#fff', borderRadius: BorderRadius.lg, ...Shadows.sm,
  },
  ratingBig: { fontSize: 40, fontWeight: '800', color: Colors.text },
  ratingNote: { fontSize: 12, color: Colors.subtext, marginTop: 2 },
  reviewCard: { marginBottom: 10 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewMeta: { flex: 1 },
  reviewAuthor: { fontSize: 13, fontWeight: '700', color: Colors.text },
  reviewText: { fontSize: 13, color: Colors.subtext, lineHeight: 19 },
});
