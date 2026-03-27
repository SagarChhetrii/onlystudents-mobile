import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, BorderRadius, Spacing, Typography, Shadows } from '@/constants/theme';
import ModernButton from '@/components/ui/ModernButton';

const EVENT_CATEGORIES = [
  { id: 'tech', label: 'Tech', icon: 'code-braces' },
  { id: 'culture', label: 'Culture', icon: 'music' },
  { id: 'startup', label: 'Startup', icon: 'rocket-launch' },
  { id: 'creative', label: 'Creative', icon: 'palette' },
  { id: 'sports', label: 'Sports', icon: 'soccer' },
  { id: 'seminar', label: 'Seminar', icon: 'microphone' },
  { id: 'workshop', label: 'Workshop', icon: 'wrench' },
  { id: 'other', label: 'Other', icon: 'star' },
];


// ============================================================================
// MAIN COMPONENT
// ============================================================================
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Event title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!date.trim()) newErrors.date = 'Date is required';
    if (!category) newErrors.category = 'Please select a category';
    if (!isFree && !fee.trim()) newErrors.fee = 'Fee is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validateForm()) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('✨ Event Created!', 'Your event is now live and visible to students.', [
        { text: 'View Events', onPress: () => router.replace('/(tabs)/events') },
      ]);
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="chevron-left" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Event</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Event Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconBox}>
              <MaterialCommunityIcons name="information-outline" size={18} color={Colors.white} />
            </View>
            <Text style={styles.sectionTitle}>Event Details</Text>
          </View>

          {/* Title Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Event Title *</Text>
            <View style={[styles.input, errors.title ? styles.inputError : undefined]}>
              <MaterialCommunityIcons name="pencil" size={16} color={Colors.textSecondary} />
              <TextInput
                style={styles.inputText}
                placeholder="e.g. Annual Hackathon 2025"
                placeholderTextColor={Colors.textSecondary}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errors.title) setErrors({ ...errors, title: '' });
                }}
                maxLength={100}
              />
            </View>
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            <Text style={styles.charCount}>{title.length}/100</Text>
          </View>

          {/* Description Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Description *</Text>
            <View style={[styles.textArea, errors.description ? styles.inputError : undefined]}>
              <TextInput
                style={styles.textAreaInput}
                placeholder="Describe your event, agenda, expectations, prizes..."
                placeholderTextColor={Colors.textSecondary}
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  if (errors.description) setErrors({ ...errors, description: '' });
                }}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
              />
            </View>
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>

          {/* Category Selection */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.categoryGrid}>
              {EVENT_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => {
                    setCategory(cat.id);
                    if (errors.category) setErrors({ ...errors, category: '' });
                  }}
                  style={[
                    styles.categoryCard,
                    category === cat.id && styles.categoryCardActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={cat.icon as any}
                    size={22}
                    color={category === cat.id ? Colors.white : Colors.primary}
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      category === cat.id && styles.categoryLabelActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>
        </View>

        {/* When & Where Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconBox}>
              <MaterialCommunityIcons name="calendar-clock" size={18} color={Colors.white} />
            </View>
            <Text style={styles.sectionTitle}>When & Where</Text>
          </View>

          {/* Date and Time Row */}
          <View style={styles.twoColumnRow}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Date *</Text>
              <View style={[styles.input, errors.date ? styles.inputError : undefined]}>
                <MaterialCommunityIcons name="calendar" size={16} color={Colors.textSecondary} />
                <TextInput
                  style={styles.inputText}
                  placeholder="Mar 15, 2025"
                  placeholderTextColor={Colors.textSecondary}
                  value={date}
                  onChangeText={(text) => {
                    setDate(text);
                    if (errors.date) setErrors({ ...errors, date: '' });
                  }}
                />
              </View>
              {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
            </View>

            <View style={styles.halfField}>
              <Text style={styles.label}>Time</Text>
              <View style={styles.input}>
                <MaterialCommunityIcons name="clock-outline" size={16} color={Colors.textSecondary} />
                <TextInput
                  style={styles.inputText}
                  placeholder="9:00 AM"
                  placeholderTextColor={Colors.textSecondary}
                  value={time}
                  onChangeText={setTime}
                />
              </View>
            </View>
          </View>

          {/* Location Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Location *</Text>
            <View style={[styles.input, errors.location ? styles.inputError : undefined]}>
              <MaterialCommunityIcons name="map-marker" size={16} color={Colors.textSecondary} />
              <TextInput
                style={styles.inputText}
                placeholder="Building, Campus, City"
                placeholderTextColor={Colors.textSecondary}
                value={location}
                onChangeText={(text) => {
                  setLocation(text);
                  if (errors.location) setErrors({ ...errors, location: '' });
                }}
              />
            </View>
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
          </View>

          {/* Max Capacity Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Max Capacity</Text>
            <View style={styles.input}>
              <MaterialCommunityIcons name="account-multiple" size={16} color={Colors.textSecondary} />
              <TextInput
                style={styles.inputText}
                placeholder="e.g. 500"
                placeholderTextColor={Colors.textSecondary}
                value={maxCapacity}
                onChangeText={setMaxCapacity}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Pricing Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconBox}>
              <MaterialCommunityIcons name="currency-rupee" size={18} color={Colors.white} />
            </View>
            <Text style={styles.sectionTitle}>Pricing</Text>
          </View>

          {/* Free Event Toggle */}
          <View style={styles.toggleContainer}>
            <View style={styles.toggleLeft}>
              <Text style={styles.toggleLabel}>Free Event</Text>
              <Text style={styles.toggleSubText}>Free entry for all students</Text>
            </View>
            <Switch
              value={isFree}
              onValueChange={setIsFree}
              trackColor={{ false: Colors.border, true: Colors.success + '40' }}
              thumbColor={isFree ? Colors.success : Colors.textSecondary}
            />
          </View>

          {/* Fee Input (Conditional) */}
          {!isFree && (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Registration Fee *</Text>
              <View style={[styles.input, errors.fee ? styles.inputError : undefined]}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={[styles.inputText, styles.feeInput]}
                  placeholder="299"
                  placeholderTextColor={Colors.textSecondary}
                  value={fee}
                  onChangeText={(text) => {
                    setFee(text);
                    if (errors.fee) setErrors({ ...errors, fee: '' });
                  }}
                  keyboardType="numeric"
                />
              </View>
              {errors.fee && <Text style={styles.errorText}>{errors.fee}</Text>}
            </View>
          )}
        </View>

        {/* Tags Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconBox}>
              <MaterialCommunityIcons name="tag-multiple" size={18} color={Colors.white} />
            </View>
            <Text style={styles.sectionTitle}>Tags</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Add Tags</Text>
            <View style={styles.input}>
              <MaterialCommunityIcons name="tag-multiple" size={16} color={Colors.textSecondary} />
              <TextInput
                style={styles.inputText}
                placeholder="Hackathon, AI/ML, Open to All..."
                placeholderTextColor={Colors.textSecondary}
                value={tags}
                onChangeText={setTags}
              />
            </View>
            <Text style={styles.helperText}>Comma-separated tags help students find your event</Text>
          </View>
        </View>

        {/* Upload Section */}
        <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8}>
          <MaterialCommunityIcons name="image-plus" size={44} color={Colors.primary} />
          <Text style={styles.uploadTitle}>Add Cover Image</Text>
          <Text style={styles.uploadSubtext}>JPG, PNG · Max 5MB · 1200×630 recommended</Text>
        </TouchableOpacity>

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <ModernButton
            label={loading ? 'Publishing...' : 'Publish Event'}
            onPress={handleCreate}
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={loading}
          />
          <ModernButton
            label="Cancel"
            onPress={() => router.back()}
            variant="secondary"
            size="lg"
            fullWidth
            disabled={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


// ============================================================================
// STYLES
// ============================================================================
const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    paddingBottom: Spacing.lg,
  },

  // ========================================================================
  // HEADER
  // ========================================================================
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },

  // ========================================================================
  // SECTIONS
  // ========================================================================
  section: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },

  sectionIconBox: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },

  // ========================================================================
  // FIELD GROUP
  // ========================================================================
  fieldGroup: {
    marginBottom: Spacing.lg,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },

  // ========================================================================
  // INPUT FIELDS
  // ========================================================================
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    height: 48,
  },

  inputText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    padding: 0,
  },

  inputError: {
    borderColor: Colors.error,
    backgroundColor: Colors.error + '08',
  },

  feeInput: {
    fontSize: 18,
    fontWeight: '600',
  },

  // ========================================================================
  // TEXT AREA
  // ========================================================================
  textArea: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    minHeight: 100,
  },

  textAreaInput: {
    flex: 1,
    width: '100%',
    fontSize: 14,
    color: Colors.text,
    padding: 0,
    textAlignVertical: 'top',
  },

  charCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },

  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: Spacing.xs,
    fontWeight: '600',
  },

  helperText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    fontStyle: 'italic',
  },

  // ========================================================================
  // CATEGORY GRID
  // ========================================================================
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },

  categoryCard: {
    width: '23%',
    aspectRatio: 1.15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs,
  },

  categoryCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  categoryLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.xs,
    textAlign: 'center',
    lineHeight: 12,
  },

  categoryLabelActive: {
    color: Colors.white,
  },

  // ========================================================================
  // TWO COLUMN ROW
  // ========================================================================
  twoColumnRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },

  halfField: {
    flex: 1,
  },

  // ========================================================================
  // TOGGLE CONTAINER
  // ========================================================================
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.primary + '08',
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },

  toggleLeft: {
    flex: 1,
  },

  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },

  toggleSubText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  currencySymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },

  // ========================================================================
  // UPLOAD SECTION
  // ========================================================================
  uploadBox: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    ...Shadows.sm,
  },

  uploadTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.md,
  },

  uploadSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },

  // ========================================================================
  // BUTTONS
  // ========================================================================
  buttonGroup: {
    marginHorizontal: Spacing.base,
    gap: Spacing.md,
  },
});
