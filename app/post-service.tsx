import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { categories } from '@/data/mockData';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import PrimaryButton from '@/components/ui/PrimaryButton';

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
      Alert.alert('🎉 Service Posted!', 'Your service is live on the marketplace.', [
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.selectRow}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => onChange(opt)}
                style={[styles.selectChip, value === opt && styles.selectChipActive]}
                activeOpacity={0.8}
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
      {/* Intro Banner */}
      <View style={styles.banner}>
        <Ionicons name="briefcase-outline" size={32} color={Colors.primary} />
        <View>
          <Text style={styles.bannerTitle}>Post a Service</Text>
          <Text style={styles.bannerSub}>Start earning from your skills on campus</Text>
        </View>
      </View>

      {/* Title */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Service Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Professional Reel Editing"
          placeholderTextColor={Colors.subtext}
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
              activeOpacity={0.8}
            >
              <Text style={styles.catIcon}>{cat.icon}</Text>
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
          placeholderTextColor={Colors.subtext}
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
            placeholderTextColor={Colors.subtext}
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

      {/* Tips */}
      <View style={styles.tipsBox}>
        <Text style={styles.tipsTitle}>💡 Tips for a great listing</Text>
        {[
          'Use a clear, specific title that describes your service',
          'Include your turnaround time and process in the description',
          'Price competitively — check similar services first',
          'Verified freelancers get 3× more orders',
        ].map((tip, i) => (
          <View key={i} style={styles.tipRow}>
            <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>

      <PrimaryButton
        title="Publish Service 🚀"
        onPress={handleSubmit}
        loading={loading}
        fullWidth
        size="lg"
        style={{ marginBottom: 40 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base },
  banner: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.primary + '10', borderRadius: 16,
    padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: Colors.primary + '20',
  },
  bannerTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },
  bannerSub: { fontSize: 13, color: Colors.subtext, marginTop: 2 },
  fieldGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  input: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 13, fontSize: 15,
    color: Colors.text, backgroundColor: '#fff',
  },
  textArea: { height: 120, paddingTop: 13 },
  charCount: { fontSize: 11, color: Colors.subtext, textAlign: 'right', marginTop: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  priceCurrency: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: -2 },
  priceInput: { flex: 1, fontSize: 22, fontWeight: '700' },
  fieldNote: { fontSize: 12, color: Colors.subtext, marginTop: 6 },
  selectRow: { flexDirection: 'row', gap: 8 },
  selectChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: '#fff',
  },
  selectChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  selectChipText: { fontSize: 13, fontWeight: '600', color: Colors.subtext },
  selectChipTextActive: { color: '#fff' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catCard: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: '#fff',
  },
  catCardActive: { backgroundColor: Colors.primary + '12', borderColor: Colors.primary },
  catIcon: { fontSize: 16 },
  catLabel: { fontSize: 13, fontWeight: '600', color: Colors.subtext },
  catLabelActive: { color: Colors.primary },
  tipsBox: {
    backgroundColor: '#ECFDF5', borderRadius: 14, padding: 16,
    marginBottom: 20, borderWidth: 1, borderColor: '#A7F3D0',
  },
  tipsTitle: { fontSize: 14, fontWeight: '700', color: '#065F46', marginBottom: 10 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  tipText: { fontSize: 13, color: '#065F46', flex: 1, lineHeight: 18 },
});
