# Components Directory

This directory contains reusable UI components shared across multiple screens.

## Component Structure

Each component should follow this pattern:

```typescript
/**
 * ComponentName
 * Brief description of what this component does
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface ComponentNameProps {
  // Define props here
  title: string;
  onPress?: () => void;
}

export default function ComponentName({ title, onPress }: ComponentNameProps) {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Styles here
  },
});
```

## Planned Components

As you build out features, create these components:

### UI Components
- `Button.tsx` - Custom button styles
- `Card.tsx` - Reusable card component
- `Input.tsx` - Custom text input
- `Avatar.tsx` - User avatar
- `Badge.tsx` - Status badges
- `Chip.tsx` - Tag chips

### Feature Components
- `TaskCard.tsx` - Individual task item
- `HabitCard.tsx` - Habit tracking card
- `CalendarEvent.tsx` - Calendar event item
- `FinanceCard.tsx` - Finance summary card
- `ChatBubble.tsx` - Chat message bubble
- `VoiceButton.tsx` - Voice input button

### Layout Components
- `Screen.tsx` - Screen wrapper with safe area
- `Header.tsx` - Custom header
- `EmptyState.tsx` - Empty state placeholder
- `LoadingSpinner.tsx` - Loading indicator
- `ErrorBoundary.tsx` - Error handling

### Form Components
- `FormInput.tsx` - Form text input
- `FormButton.tsx` - Form submit button
- `FormSelect.tsx` - Dropdown select
- `DatePicker.tsx` - Date picker input
- `TimePicker.tsx` - Time picker input

## Usage Example

```typescript
// In a screen file
import TaskCard from '../../components/TaskCard';

function TasksScreen() {
  return (
    <View>
      <TaskCard
        task={task}
        onPress={() => handleTaskPress(task.id)}
        onComplete={() => handleComplete(task.id)}
      />
    </View>
  );
}
```

## Best Practices

1. **Keep components small and focused** - Each component should do one thing well
2. **Use TypeScript interfaces** - Define props with TypeScript
3. **Extract styles** - Use StyleSheet.create for performance
4. **Make components reusable** - Accept props for customization
5. **Document props** - Add comments for complex props
6. **Handle edge cases** - Check for null/undefined
7. **Use React Native Paper** - Prefer Paper components for consistency
8. **Memoize when needed** - Use React.memo for expensive components

## Example: TaskCard Component

```typescript
/**
 * TaskCard
 * Displays a single task with title, status, and actions
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Checkbox, IconButton } from 'react-native-paper';
import { Task, TaskStatus } from '../types';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onPress, onComplete, onDelete }: TaskCardProps) {
  const isCompleted = task.status === TaskStatus.COMPLETED;

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.content}>
        <Checkbox
          status={isCompleted ? 'checked' : 'unchecked'}
          onPress={() => onComplete(task.id)}
        />

        <View style={styles.textContainer}>
          <Text
            variant="bodyLarge"
            style={[styles.title, isCompleted && styles.completedText]}
          >
            {task.title}
          </Text>
          {task.dueDate && (
            <Text variant="bodySmall" style={styles.dueDate}>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </Text>
          )}
        </View>

        <IconButton
          icon="delete"
          size={20}
          onPress={() => onDelete(task.id)}
        />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  dueDate: {
    color: '#8E8E93',
    marginTop: 4,
  },
});
```

## When to Create a Component

Create a new component when:
- You use the same UI pattern in 2+ places
- A screen component gets too large (> 200 lines)
- You want to test a piece of UI in isolation
- You need to share logic between screens

Keep components in screens when:
- Only used in one place
- Tightly coupled to screen logic
- Very simple (< 30 lines)
