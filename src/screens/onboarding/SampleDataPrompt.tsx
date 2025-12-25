/**
 * Sample Data Prompt
 * Modal asking users if they want example data
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface SampleDataPromptProps {
  visible: boolean;
  onAccept: () => Promise<void>;
  onDecline: () => void;
}

export default function SampleDataPrompt({
  visible,
  onAccept,
  onDecline,
}: SampleDataPromptProps) {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await onAccept();
    } catch (error) {
      console.error('[SampleDataPrompt] Error accepting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View
          style={[
            styles.modal,
            {
              backgroundColor: colors.background.secondary,
              shadowColor: colors.text.primary,
            },
          ]}
        >
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: `${colors.primary}20`,
              },
            ]}
          >
            <Text style={styles.icon}>📦</Text>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Load Sample Data?
          </Text>

          {/* Description */}
          <Text style={[styles.description, { color: colors.text.secondary }]}>
            Would you like to populate the app with example data? This helps you explore
            features right away.
          </Text>

          {/* What's Included */}
          <View style={styles.includesContainer}>
            <Text style={[styles.includesTitle, { color: colors.text.primary }]}>
              What's included:
            </Text>
            <Text style={[styles.includeItem, { color: colors.text.secondary }]}>
              • 3 sample tasks with different priorities
            </Text>
            <Text style={[styles.includeItem, { color: colors.text.secondary }]}>
              • 2 daily habits to track
            </Text>
            <Text style={[styles.includeItem, { color: colors.text.secondary }]}>
              • 2 upcoming calendar events
            </Text>
            <Text style={[styles.includeItem, { color: colors.text.secondary }]}>
              • 5 finance transactions
            </Text>
          </View>

          {/* Note */}
          <Text style={[styles.note, { color: colors.text.secondary }]}>
            You can delete this data anytime from Settings.
          </Text>

          {/* Buttons */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary.main} />
              <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
                Loading sample data...
              </Text>
            </View>
          ) : (
            <View style={styles.buttons}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.declineButton,
                  { borderColor: colors.border.default },
                ]}
                onPress={onDecline}
                activeOpacity={0.7}
              >
                <Text style={[styles.declineButtonText, { color: colors.text.primary }]}>
                  Start Fresh
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary.main }]}
                onPress={handleAccept}
                activeOpacity={0.8}
              >
                <Text style={styles.acceptButtonText}>Load Examples</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  includesContainer: {
    marginBottom: 16,
  },
  includesTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  includeItem: {
    fontSize: 14,
    lineHeight: 22,
    marginLeft: 8,
  },
  note: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  declineButton: {
    borderWidth: 1.5,
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
