import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { categories } from '@/data/mockData';
import { Colors, BorderRadius, Spacing, Shadows, Typography } from '@/constants/theme';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Card from '@/components/ui/Card';

const DELIVERY_OPTIONS = ['1 day', '2 days', '3 days', '5 days', '7 days', '10 days', '14 days'];
const REVISION_OPTIONS = ['1', '2', '3', '4', '5', 'Unlimited'];

export default function PostServiceScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [delivery, setDelivery] = useState('3 days');
  const [revisions, setRevisions] = useState('2');
  const [loading, setLoading] = useState(false);

  const serviceCategories = categories.filter((c) => c.id !== 'all');

  const handleSubmit = () => {
    if (!title || !description || !category || !price) {
      Alert.alert('Missing Info', 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Service Posted!', 'Your service is live on the marketplace.', [
        { text: 'View Marketplace', onPress: () => router.replace('/(tabs)/marketplace') },
      ]);
    }, 1200);
  };

  function SelectGroup({ label, options, value, onChange }: {
    label: string; options: string[]; value: string; onChange: (v: string) => void;
  }) {
    return (
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>{label}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEventThrottle={16}>
          <View style={styles.selectRow}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => onChange(opt)}
                style={[styles.selectChip, value === opt && styles.selectChipActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.selectChipText, value === opt && styles.selectChipTextActive]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <ScreenHeader
        title="Post a Service"
        subtitle="Start earning from your skills"
      />

      {/* Title */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Service Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Professional Reel Editing"
          placeholderTextColor={Colors.textSecondary}
          value={title}
          onChangeText={setTitle}
          maxLength={80}
        />
        <Text style={styles.charCount}>{title.length}/80</Text>
      </View>

      {/* Category */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Category *</Text>
        <View style={styles.catGrid}>
          {serviceCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setCategory(cat.id)}
              style={[styles.catCard, category === cat.id && styles.catCardActive]}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={cat.icon as any}
                size={18}
                color={category === cat.id ? Colors.primary : Colors.textSecondary}
              />
              <Text style={[styles.catLabel, category === cat.id && styles.catLabelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Description */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe what you'll deliver, your process, and why clients should choose you..."
          placeholderTextColor={Colors.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          maxLength={500}
        />
        <Text style={styles.charCount}>{description.length}/500</Text>
      </View>

      {/* Price */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Price (₹) *</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceCurrency}>₹</Text>
          <TextInput
            style={[styles.input, styles.priceInput]}
            placeholder="0"
            placeholderTextColor={Colors.textSecondary}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>
        <Text style={styles.fieldNote}>Platform takes a 10% commission. You receive 90%.</Text>
      </View>

      {/* Delivery */}
      <SelectGroup label="Delivery Time" options={DELIVERY_OPTIONS} value={delivery} onChange={setDelivery} />

      {/* Revisions */}
      <SelectGroup label="Number of Revisions" options={REVISION_OPTIONS} value={revisions} onChange={setRevisions} />

      {/* Earnings & Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Earning Potential</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>₹5K+</Text>
            <Text style={styles.statLabel}>Avg Monthly</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>90%</Text>
            <Text style={styles.statLabel}>You Keep</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>10K+</Text>
            <Text style={styles.statLabel}>Active Buyers</Text>
          </View>
        </View>
      </View>

      {/* How It Works */}
      <View style={styles.processSection}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.processSteps}>
          {[
            { num: '1', title: 'Post Your Service', desc: 'Fill in details and set your rates' },
            { num: '2', title: 'Get Discovered', desc: 'Students browse and place orders' },
            { num: '3', title: 'Deliver & Earn', desc: 'Complete orders and earn 90% of revenue' },
            { num: '4', title: 'Build Reputation', desc: 'Get reviews and boost your visibility' },
          ].map((step, i) => (
            <View key={i} style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{step.num}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Requirements */}
      <View style={styles.requirementSection}>
        <Text style={styles.sectionTitle}>Service Requirements</Text>
        <View style={styles.requirementList}>
          {[
            'Clear and detailed description of your service',
            'Professional portfolio or samples of your work',
            'Realistic delivery timelines (1-14 days)',
            'Competitive pricing within your category',
            'Professional communication with buyers',
          ].map((req, i) => (
            <View key={i} style={styles.requirementItem}>
              <MaterialCommunityIcons name="check-circle" size={20} color={Colors.success} />
              <Text style={styles.requirementText}>{req}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        style={[styles.publishButton, loading && styles.publishButtonDisabled]}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="cloud-upload" size={20} color="#fff" />
        <Text style={styles.publishButtonText}>
          {loading ? 'Publishing...' : 'Publish Service'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    paddingBottom: 40,
  },
  fieldGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  textArea: {
    height: 120,
    paddingTop: Spacing.md,
  },
  charCount: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  priceCurrency: {
    ...Typography.h3,
    color: Colors.text,
    fontWeight: '700',
  },
  priceInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
  },
  fieldNote: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  selectRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingRight: Spacing.base,
  },
  selectChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  selectChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  selectChipText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  selectChipTextActive: {
    color: Colors.white,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  catCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  catCardActive: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary,
  },
  catLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  catLabelActive: {
    color: Colors.primary,
  },
  tipsSection: {
    marginBottom: Spacing.lg,
  },
  tipSectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  tipIconBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.warning + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipSectionTitle: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '700',
  },
  tipSectionSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  tipsGrid: {
    gap: Spacing.md,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipCardNumber: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tipCardNumberText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '700',
  },
  tipCardContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  tipCardTitle: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '700',
  },
  tipCardDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },

  /* New Sections */
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  
  /* Stats Section */
  statsSection: {
    marginBottom: Spacing.xxl,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.primary + '10',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },

  /* Process Section */
  processSection: {
    marginBottom: Spacing.xxl,
  },
  processSteps: {
    gap: Spacing.md,
  },
  processStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumberText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  stepDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
  },

  /* Requirement Section */
  requirementSection: {
    marginBottom: Spacing.xxl,
  },
  requirementList: {
    gap: Spacing.md,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  requirementText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    lineHeight: 20,
  },

  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xxl,
    ...Shadows.md,
  },
  publishButtonDisabled: {
    opacity: 0.6,
  },
  publishButtonText: {
    ...Typography.body,
    color: Colors.white,
    fontWeight: '700',
  },
});
