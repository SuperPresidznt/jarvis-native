/**
 * AI Chat Screen
 * Primary interface for interacting with the AI assistant
 * PRODUCTION-READY with proper safe areas and typography
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput as RNTextInput,
} from 'react-native';
import {
  TextInput,
  IconButton,
  Text,
  Card,
  ActivityIndicator,
  FAB,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import { ChatMessage } from '../../types';
import { aiApi } from '../../services/ai.api';
import { colors, typography, spacing, borderRadius, textStyles, shadows } from '../../theme';

export default function AIChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await aiApi.chat({
        message: userMessage.content,
        sessionId,
      });

      setSessionId(response.sessionId);
      setMessages((prev) => [...prev, response.message]);

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    // TODO: Implement voice input in Phase 4
    Alert.alert('Voice Input', 'Voice input will be available in the next update');
  };

  const speakMessage = (text: string) => {
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 1.0,
    });
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
        ]}
      >
        <Card
          style={[
            styles.messageCard,
            isUser ? styles.userMessageCard : styles.assistantMessageCard,
          ]}
        >
          <Card.Content style={styles.messageContent}>
            <Text
              variant="bodyMedium"
              style={isUser ? styles.userMessageText : styles.assistantMessageText}
            >
              {item.content}
            </Text>

            {!isUser && (
              <View style={styles.messageActions}>
                <IconButton
                  icon="volume-high"
                  size={18}
                  iconColor={colors.text.tertiary}
                  onPress={() => speakMessage(item.content)}
                  style={styles.actionButton}
                />
              </View>
            )}
          </Card.Content>
        </Card>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <View style={styles.container}>
        {messages.length === 0 ? (
          <View style={[styles.emptyContainer, { paddingTop: insets.top + spacing['4xl'] }]}>
            <Text variant="displaySmall" style={styles.emptyTitle}>
              Hi, I'm Jarvis
            </Text>
            <Text variant="bodyLarge" style={styles.emptySubtitle}>
              Your AI-powered personal assistant
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              I can help you with:
            </Text>
            <View style={styles.featureList}>
              <Text variant="bodyMedium" style={styles.featureItem}>
                • Managing tasks and projects
              </Text>
              <Text variant="bodyMedium" style={styles.featureItem}>
                • Tracking habits and goals
              </Text>
              <Text variant="bodyMedium" style={styles.featureItem}>
                • Scheduling and calendar management
              </Text>
              <Text variant="bodyMedium" style={styles.featureItem}>
                • Financial planning and budgeting
              </Text>
              <Text variant="bodyMedium" style={styles.featureItem}>
                • Quick note capture and organization
              </Text>
            </View>
            <Text variant="bodyMedium" style={styles.emptyPrompt}>
              Ask me anything to get started!
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[styles.messageList, { paddingBottom: spacing.lg }]}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
          <View style={styles.inputWrapper}>
            <IconButton
              icon="microphone"
              onPress={handleVoiceInput}
              disabled={isLoading}
              iconColor={colors.text.tertiary}
              size={22}
              style={styles.iconButton}
            />
            <RNTextInput
              placeholder="Ask Jarvis anything..."
              placeholderTextColor={colors.text.placeholder}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={1000}
              editable={!isLoading}
              style={styles.input}
              onSubmitEditing={handleSend}
            />
            <IconButton
              icon="send"
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
              iconColor={inputText.trim() && !isLoading ? colors.primary.main : colors.text.disabled}
              size={22}
              style={styles.iconButton}
            />
          </View>
        </View>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary.main} />
            <Text variant="bodySmall" style={styles.loadingText}>
              Jarvis is thinking...
            </Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['3xl'],
  },
  emptyTitle: {
    ...textStyles.h1,
    color: colors.primary.main,
    marginBottom: spacing.md,
  },
  emptySubtitle: {
    ...textStyles.bodySecondary,
    fontSize: typography.size.md,
    marginBottom: spacing['3xl'],
  },
  emptyText: {
    ...textStyles.body,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.lg,
  },
  featureList: {
    alignSelf: 'stretch',
    marginBottom: spacing['3xl'],
    paddingHorizontal: spacing.sm,
  },
  featureItem: {
    ...textStyles.bodySecondary,
    fontSize: typography.size.base,
    marginBottom: spacing.md,
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
  },
  emptyPrompt: {
    ...textStyles.bodySecondary,
    fontStyle: 'italic',
  },
  messageList: {
    padding: spacing.lg,
    paddingTop: spacing.base,
  },
  messageContainer: {
    marginBottom: spacing.base,
    maxWidth: '85%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  assistantMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageCard: {
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  userMessageCard: {
    backgroundColor: colors.primary.main,
  },
  assistantMessageCard: {
    backgroundColor: colors.background.secondary,
  },
  messageContent: {
    padding: spacing.sm,
  },
  userMessageText: {
    color: '#FFFFFF',
    fontSize: typography.size.base,
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
    fontWeight: typography.weight.regular,
  },
  assistantMessageText: {
    ...textStyles.body,
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
  },
  messageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.xs,
  },
  actionButton: {
    margin: 0,
  },
  inputContainer: {
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    ...shadows.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    paddingHorizontal: spacing.xs,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    color: colors.text.primary,
    fontSize: typography.size.base,
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
    fontWeight: typography.weight.regular,
  },
  iconButton: {
    margin: 0,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
  },
  loadingText: {
    ...textStyles.caption,
    marginLeft: spacing.md,
  },
});
