/**
 * JournalNoteModal Component
 * Modal for adding/editing journal notes for a specific date
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { useTheme } from '../../theme/ThemeProvider';
import {
  typography,
  spacing,
  borderRadius,
  shadows,
  getColors,
} from '../../theme';
import { HIT_SLOP } from '../../constants/ui';
import * as journalDB from '../../database/journal';
import { makeButton, makeTextInput, makeHeader } from '../../utils/accessibility';

interface JournalNoteModalProps {
  visible: boolean;
  date: string; // YYYY-MM-DD format
  onClose: () => void;
  onSaved?: () => void;
}

const MAX_CONTENT_LENGTH = 2000;

export const JournalNoteModal: React.FC<JournalNoteModalProps> = ({
  visible,
  date,
  onClose,
  onSaved,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [existingEntry, setExistingEntry] = useState<journalDB.JournalEntry | null>(null);

  // Load existing entry when modal opens
  useEffect(() => {
    const loadEntry = async () => {
      setIsLoading(true);
      try {
        const entry = await journalDB.getEntryByDate(date);
        setExistingEntry(entry);
        setContent(entry?.content || '');
      } catch (error) {
        console.error('[JournalNoteModal] Error loading entry:', error);
        setContent('');
      } finally {
        setIsLoading(false);
      }
    };

    if (visible && date) {
      loadEntry();
    }
  }, [visible, date]);

  const handleSave = async () => {
    if (isSaving) return;

    const trimmedContent = content.trim();

    // If no content and no existing entry, just close
    if (!trimmedContent && !existingEntry) {
      onClose();
      return;
    }

    setIsSaving(true);
    try {
      if (trimmedContent) {
        await journalDB.saveEntry(date, trimmedContent);
      } else if (existingEntry) {
        // Delete entry if content is cleared
        await journalDB.deleteEntry(date);
      }
      onSaved?.();
      onClose();
    } catch (error) {
      console.error('[JournalNoteModal] Error saving entry:', error);
      Alert.alert('Error', 'Failed to save journal entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existingEntry) return;

    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsSaving(true);
            try {
              await journalDB.deleteEntry(date);
              onSaved?.();
              onClose();
            } catch (error) {
              console.error('[JournalNoteModal] Error deleting entry:', error);
              Alert.alert('Error', 'Failed to delete entry. Please try again.');
            } finally {
              setIsSaving(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const remainingChars = MAX_CONTENT_LENGTH - content.length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title} {...makeHeader(existingEntry ? 'Edit Journal' : 'Add Journal', 1)}>
                {existingEntry ? 'Edit Journal' : 'Add Journal'}
              </Text>
              <Text style={styles.dateText}>{formatDate(date)}</Text>
            </View>
            <IconButton
              icon="close"
              onPress={onClose}
              iconColor={colors.text.tertiary}
              size={20}
              hitSlop={HIT_SLOP}
              {...makeButton('Close', 'Double tap to close without saving')}
            />
          </View>

          <View style={styles.body}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.label}>
                  What happened today? How are you feeling?
                </Text>
                <TextInput
                  value={content}
                  onChangeText={setContent}
                  placeholder="Write your thoughts, reflections, or notes for this day..."
                  placeholderTextColor={colors.text.placeholder}
                  style={[styles.input, isFocused && styles.inputFocused]}
                  multiline
                  numberOfLines={8}
                  maxLength={MAX_CONTENT_LENGTH}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  autoFocus={!existingEntry}
                  {...makeTextInput('Journal content', content, 'Write your journal entry')}
                />
                <Text
                  style={[
                    styles.charCount,
                    remainingChars < 100 && styles.charCountWarning,
                  ]}
                >
                  {remainingChars} characters remaining
                </Text>

                {/* Quick prompts for empty entries */}
                {!existingEntry && content.trim().length === 0 && (
                  <View style={styles.prompts}>
                    <Text style={styles.promptsLabel}>Quick prompts:</Text>
                    <View style={styles.promptButtons}>
                      {[
                        'Today I am grateful for...',
                        'Today I accomplished...',
                        'I am feeling...',
                        'Tomorrow I want to...',
                      ].map((prompt) => (
                        <TouchableOpacity
                          key={prompt}
                          onPress={() => setContent(prompt)}
                          style={styles.promptButton}
                          {...makeButton(prompt, 'Tap to use this prompt')}
                        >
                          <Text style={styles.promptButtonText}>{prompt}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}
          </View>

          <View style={styles.footer}>
            {existingEntry && (
              <TouchableOpacity
                onPress={handleDelete}
                style={[styles.button, styles.deleteButton]}
                disabled={isSaving}
                {...makeButton('Delete entry', 'Double tap to delete this journal entry')}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onClose}
              style={[styles.button, styles.cancelButton]}
              disabled={isSaving}
              {...makeButton('Cancel', 'Double tap to close without saving')}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.button, styles.saveButton]}
              disabled={isSaving || isLoading}
              {...makeButton('Save entry', 'Double tap to save your journal entry')}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    content: {
      backgroundColor: colors.background.secondary,
      borderRadius: borderRadius.xl,
      width: '100%',
      maxWidth: 500,
      maxHeight: '90%',
      ...shadows.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: spacing.base,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.subtle,
    },
    headerContent: {
      flex: 1,
    },
    title: {
      fontSize: typography.size.xl,
      fontWeight: typography.weight.semibold,
      color: colors.text.primary,
    },
    dateText: {
      fontSize: typography.size.sm,
      color: colors.text.tertiary,
      marginTop: spacing.xs,
    },
    body: {
      padding: spacing.base,
    },
    loadingContainer: {
      padding: spacing.xl,
      alignItems: 'center',
    },
    loadingText: {
      fontSize: typography.size.base,
      color: colors.text.tertiary,
    },
    label: {
      fontSize: typography.size.sm,
      color: colors.text.secondary,
      marginBottom: spacing.md,
    },
    input: {
      backgroundColor: colors.background.primary,
      borderRadius: borderRadius.md,
      borderWidth: 1.5,
      borderColor: colors.border.default,
      padding: spacing.md,
      color: colors.text.primary,
      fontSize: typography.size.base,
      textAlignVertical: 'top',
      minHeight: 160,
      lineHeight: typography.size.base * typography.lineHeight.relaxed,
    },
    inputFocused: {
      borderColor: colors.primary.main,
    },
    charCount: {
      fontSize: typography.size.xs,
      color: colors.text.tertiary,
      textAlign: 'right',
      marginTop: spacing.xs,
    },
    charCountWarning: {
      color: colors.warning,
    },
    prompts: {
      marginTop: spacing.lg,
    },
    promptsLabel: {
      fontSize: typography.size.sm,
      color: colors.text.tertiary,
      marginBottom: spacing.sm,
    },
    promptButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    promptButton: {
      backgroundColor: colors.background.tertiary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
      borderWidth: 1,
      borderColor: colors.border.subtle,
    },
    promptButtonText: {
      fontSize: typography.size.sm,
      color: colors.text.secondary,
    },
    footer: {
      flexDirection: 'row',
      gap: spacing.sm,
      padding: spacing.base,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border.subtle,
    },
    button: {
      flex: 1,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.base,
      borderRadius: borderRadius.md,
      alignItems: 'center',
    },
    deleteButton: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.error,
      flex: 0.7,
    },
    deleteButtonText: {
      fontSize: typography.size.base,
      fontWeight: typography.weight.medium,
      color: colors.error,
    },
    cancelButton: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.border.default,
    },
    cancelButtonText: {
      fontSize: typography.size.base,
      fontWeight: typography.weight.medium,
      color: colors.text.secondary,
    },
    saveButton: {
      backgroundColor: colors.primary.main,
    },
    saveButtonText: {
      fontSize: typography.size.base,
      fontWeight: typography.weight.semibold,
      color: '#FFFFFF',
    },
  });

export default JournalNoteModal;
