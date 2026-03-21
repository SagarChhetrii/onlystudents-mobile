import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Alert, Switch,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import PrimaryButton from '@/components/ui/PrimaryButton';

const EVENT_CATEGORIES = [
  { id: 'tech',    label: 'Technology', icon: '💻' },
  { id: 'culture', label: 'Cultural',   icon: '🎭' },
  { id: 'startup', label: 'Startup',    icon: '🚀' },
  { id: 'photo',   label: 'Creative',   icon: '📸' },
  { id: 'sports',  label: 'Sports',     icon: '⚽' },
  { id: 'talk',    label: 'Talk/Panel', icon: '🎤' },
  { id: 'workshop',label: 'Workshop',   icon: '🔧' },
  { id: 'other',   label: 'Other',      icon: '🌟' },
];

export default function CreateEventScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [fee, setFee] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    if (!title || !description || !location || !date || !category) {
      Alert.alert('Missing Info', 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('🎉 Event Created!', 'Your event is live and visible to students.', [
        { text: 'View Events', onPress: () => router.replace('/(tabs)/events') },
      ]);
    }, 1200);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {/* Banner */}
      <View style={styles.banner}>
        <Ionicons name="calendar-outline" size={32} color={Colors.accent} />
        <View>
          <Text style={styles.bannerTitle}>Create an Event</Text>
          <Text style={styles.bannerSub}>Bring your campus community together</Text>
        </View>
      </View>

      {/* Title */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Event Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Annual Hackathon 2025"
          placeholderTextColor={Colors.subtext}
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />
      </View>

      {/* Category */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Category *</Text>
        <View style={styles.catGrid}>
          {EVENT_CATEGORIES.map((cat) => (
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
          placeholder="Describe your event, what attendees can expect, prizes, agenda..."
          placeholderTextColor={Colors.subtext}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          maxLength={600}
        />
        <Text style={styles.charCount}>{description.length}/600</Text>
      </View>

      {/* Date & Time */}
      <View style={styles.row2}>
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Date *</Text>
          <View style={styles.inputIcon}>
            <Ionicons name="calendar-outline" size={16} color={Colors.subtext} />
            <TextInput
              style={styles.inputInline}
              placeholder="March 15, 2025"
              placeholderTextColor={Colors.subtext}
              value={date}
              onChangeText={setDate}
            />
          </View>
        </View>
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Time</Text>
          <View style={styles.inputIcon}>
            <Ionicons name="time-outline" size={16} color={Colors.subtext} />
            <TextInput
              style={styles.inputInline}
              placeholder="9:00 AM"
              placeholderTextColor={Colors.subtext}
              value={time}
              onChangeText={setTime}
            />
          </View>
        </View>
      </View>

      {/* Location */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Location *</Text>
        <View style={styles.inputIcon}>
          <Ionicons name="location-outline" size={16} color={Colors.subtext} />
          <TextInput
            style={[styles.inputInline, { flex: 1 }]}
            placeholder="e.g. Lecture Hall, IIT Delhi"
            placeholderTextColor={Colors.subtext}
            value={location}
            onChangeText={setLocation}
          />
        </View>
      </View>

      {/* Capacity */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Max Capacity</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 500"
          placeholderTextColor={Colors.subtext}
          value={maxCapacity}
          onChangeText={setMaxCapacity}
          keyboardType="numeric"
        />
      </View>

      {/* Free Toggle */}
      <View style={styles.toggleRow}>
        <View>
          <Text style={styles.label}>Free Event</Text>
          <Text style={styles.toggleSub}>Toggle off to add registration fee</Text>
        </View>
        <Switch
          value={isFree}
          onValueChange={setIsFree}
          trackColor={{ false: Colors.border, true: Colors.success + '60' }}
          thumbColor={isFree ? Colors.success : '#f4f3f4'}
        />
      </View>

      {!isFree && (
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Registration Fee (₹)</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceCurrency}>₹</Text>
            <TextInput
              style={[styles.input, styles.priceInput]}
              placeholder="299"
              placeholderTextColor={Colors.subtext}
              value={fee}
              onChangeText={setFee}
              keyboardType="numeric"
            />
          </View>
        </View>
      )}

      {/* Tags */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Tags (comma-separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="Hackathon, AI/ML, Cash Prize, Open to All"
          placeholderTextColor={Colors.subtext}
          value={tags}
          onChangeText={setTags}
        />
        <Text style={styles.fieldNote}>Tags help students discover your event</Text>
      </View>

      {/* Image Upload placeholder */}
      <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8}>
        <Ionicons name="image-outline" size={32} color={Colors.subtext} />
        <Text style={styles.uploadTitle}>Add Event Cover Image</Text>
        <Text style={styles.uploadSub}>JPG, PNG · Max 5MB · Recommended 1200×630</Text>
      </TouchableOpacity>

      <PrimaryButton
        title="Publish Event 🎉"
        onPress={handleCreate}
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
    backgroundColor: '#FDF2F8', borderRadius: 16,
    padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: '#FBCFE8',
  },
  bannerTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },
  bannerSub: { fontSize: 13, color: Colors.subtext, marginTop: 2 },
  fieldGroup: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  input: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 13, fontSize: 15,
    color: Colors.text, backgroundColor: '#fff',
  },
  textArea: { height: 120, paddingTop: 13 },
  charCount: { fontSize: 11, color: Colors.subtext, textAlign: 'right', marginTop: 4 },
  row2: { flexDirection: 'row', gap: 12 },
  inputIcon: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 13,
    backgroundColor: '#fff',
  },
  inputInline: { flex: 1, fontSize: 14, color: Colors.text },
  fieldNote: { fontSize: 12, color: Colors.subtext, marginTop: 5 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catCard: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: '#fff',
  },
  catCardActive: { backgroundColor: '#FDF2F8', borderColor: Colors.accent },
  catIcon: { fontSize: 15 },
  catLabel: { fontSize: 12, fontWeight: '600', color: Colors.subtext },
  catLabelActive: { color: Colors.accent },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 18,
    borderWidth: 1, borderColor: Colors.border,
  },
  toggleSub: { fontSize: 12, color: Colors.subtext, marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  priceCurrency: { fontSize: 22, fontWeight: '800', color: Colors.text },
  priceInput: { flex: 1, fontSize: 22, fontWeight: '700' },
  uploadBox: {
    borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed',
    borderRadius: 16, padding: 28, alignItems: 'center', marginBottom: 20,
    backgroundColor: '#FAFAFA',
  },
  uploadTitle: { fontSize: 15, fontWeight: '600', color: Colors.text, marginTop: 10 },
  uploadSub: { fontSize: 12, color: Colors.subtext, marginTop: 4 },
});
