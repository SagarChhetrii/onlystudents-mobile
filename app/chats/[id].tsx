import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '@/components/ui/Avatar';
import { chatThreads, currentUser } from '@/data/mockData';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useAppMode } from '@/constants/appMode';

function getNowTimeLabel() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export default function ChatDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { isFreelancerMode } = useAppMode();
  const {
    id,
    freelancerId,
    freelancerName,
    freelancerAvatar,
    projectTitle,
  } = useLocalSearchParams<{
    id: string;
    freelancerId?: string;
    freelancerName?: string;
    freelancerAvatar?: string;
    projectTitle?: string;
  }>();
  const [draft, setDraft] = useState('');

  const thread = chatThreads.find((item) => item.id === id);

  const resolvedThread = thread ?? {
    id,
    freelancerId: freelancerId ?? 'unknown',
    freelancerName: freelancerName ?? 'Freelancer',
    freelancerAvatar: freelancerAvatar ?? '',
    clientName: currentUser.name,
    clientAvatar: currentUser.avatar,
    projectTitle: projectTitle ?? 'New Project Discussion',
    status: 'inquiry' as const,
    messages: [],
  };

  const [localMessages, setLocalMessages] = useState(() => resolvedThread.messages);

  const counterpartName = isFreelancerMode ? resolvedThread.clientName : resolvedThread.freelancerName;
  const counterpartAvatar = isFreelancerMode ? resolvedThread.clientAvatar : resolvedThread.freelancerAvatar;
  const myRole = isFreelancerMode ? 'freelancer' : 'client';

  const headerSubtitle = useMemo(() => {
    if (resolvedThread.status === 'completed') {
      return 'Project completed';
    }
    if (resolvedThread.status === 'in-progress') {
      return 'Project in progress';
    }
    return 'Inquiry stage';
  }, [resolvedThread.status]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)/chats');
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text) {
      return;
    }

    setLocalMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        senderRole: myRole,
        senderName: currentUser.name,
        text,
        time: getNowTimeLabel(),
        isRead: false,
      },
    ]);

    setDraft('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
    >
      <View style={[styles.header, { paddingTop: insets.top + Spacing.xs }]}> 
        <TouchableOpacity style={styles.headerBackButton} onPress={handleBack} activeOpacity={0.86}>
          <MaterialCommunityIcons name="chevron-left" size={22} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Avatar uri={counterpartAvatar} size={36} />
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle} numberOfLines={1}>{counterpartName}</Text>
            <Text style={styles.headerSub}>{headerSubtitle}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.headerActionButton}
          onPress={() => Alert.alert('Info', resolvedThread.projectTitle)}
          activeOpacity={0.86}
        >
          <MaterialCommunityIcons name="information-outline" size={20} color={Colors.primaryDark} />
        </TouchableOpacity>
      </View>

      <View style={styles.projectStrip}>
        <MaterialCommunityIcons name="briefcase-outline" size={14} color={Colors.primaryDark} />
        <Text style={styles.projectStripText} numberOfLines={1}>{resolvedThread.projectTitle}</Text>
      </View>

      <FlatList
        data={localMessages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const mine = item.senderRole === myRole;
          return (
            <View style={[styles.messageRow, mine ? styles.messageRowMine : styles.messageRowOther]}>
              <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}>
                <Text style={[styles.messageText, mine ? styles.messageTextMine : styles.messageTextOther]}>{item.text}</Text>
                <Text style={[styles.messageTime, mine ? styles.messageTimeMine : styles.messageTimeOther]}>{item.time}</Text>
              </View>
            </View>
          );
        }}
      />

      <View style={[styles.composerWrap, { paddingBottom: Math.max(insets.bottom, Spacing.sm) }]}> 
        <View style={styles.composerRow}>
          <TextInput
            style={styles.composerInput}
            placeholder={isFreelancerMode ? 'Reply to client...' : 'Write a message to freelancer...'}
            placeholderTextColor={Colors.textSecondary}
            value={draft}
            onChangeText={setDraft}
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            style={[styles.sendButton, draft.trim().length === 0 && styles.sendButtonDisabled]}
            activeOpacity={0.86}
            onPress={handleSend}
            disabled={draft.trim().length === 0}
          >
            <MaterialCommunityIcons name="send" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  notFoundText: {
    ...Typography.h4,
    color: Colors.textSecondary,
  },
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '700',
  },
  headerSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  headerActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  projectStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  projectStripText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '700',
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.base,
    gap: Spacing.sm,
  },
  messageRow: {
    width: '100%',
    flexDirection: 'row',
  },
  messageRowMine: {
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: 7,
  },
  bubbleMine: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 6,
  },
  bubbleOther: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 6,
  },
  messageText: {
    ...Typography.body,
  },
  messageTextMine: {
    color: Colors.white,
  },
  messageTextOther: {
    color: Colors.text,
  },
  messageTime: {
    ...Typography.caption,
    marginTop: 4,
  },
  messageTimeMine: {
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'right',
  },
  messageTimeOther: {
    color: Colors.textSecondary,
  },
  composerWrap: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  composerRow: {
    minHeight: 48,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: Spacing.md,
    paddingRight: 6,
    paddingVertical: 6,
    gap: Spacing.sm,
  },
  composerInput: {
    flex: 1,
    maxHeight: 120,
    ...Typography.body,
    color: Colors.text,
    paddingTop: 4,
    paddingBottom: 4,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
});
