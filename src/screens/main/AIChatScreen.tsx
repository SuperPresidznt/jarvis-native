/**
 * AI Chat Screen
 * Primary interface for interacting with the AI assistant
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  TextInput,
  IconButton,
  Text,
  Card,
  ActivityIndicator,
  FAB,
} from 'react-native-paper';
import * as Speech from 'expo-speech';
import { ChatMessage } from '../../types';
import { aiApi } from '../../services/ai.api';

export default function AIChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const flatListRef = useRef<FlatList>(null);

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
          <Card.Content>
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
                  size={16}
                  onPress={() => speakMessage(item.content)}
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
          <View style={styles.emptyContainer}>
            <Text variant="headlineMedium" style={styles.emptyTitle}>
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
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            placeholder="Ask Jarvis anything..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
            disabled={isLoading}
            style={styles.input}
            right={
              <TextInput.Icon
                icon="send"
                onPress={handleSend}
                disabled={!inputText.trim() || isLoading}
              />
            }
            left={
              <TextInput.Icon
                icon="microphone"
                onPress={handleVoiceInput}
                disabled={isLoading}
              />
            }
          />
        </View>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" />
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
    backgroundColor: '#F2F2F7',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#8E8E93',
    marginBottom: 24,
  },
  emptyText: {
    color: '#000000',
    marginBottom: 16,
  },
  featureList: {
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  featureItem: {
    color: '#3C3C43',
    marginBottom: 8,
  },
  emptyPrompt: {
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  messageList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  assistantMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageCard: {
    elevation: 2,
  },
  userMessageCard: {
    backgroundColor: '#007AFF',
  },
  assistantMessageCard: {
    backgroundColor: '#FFFFFF',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  assistantMessageText: {
    color: '#000000',
  },
  messageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  input: {
    maxHeight: 100,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginLeft: 8,
    color: '#8E8E93',
  },
});
