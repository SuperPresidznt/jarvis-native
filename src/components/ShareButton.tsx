/**
 * ShareButton Component
 * Reusable button for copying deep links to clipboard
 */

import React from 'react';
import { IconButton, Menu } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';
import { HIT_SLOP } from '../constants/ui';

interface ShareButtonProps {
  onCopyLink: () => void;
  iconColor?: string;
  size?: number;
}

export default function ShareButton({ onCopyLink, iconColor, size = 20 }: ShareButtonProps) {
  const { colors } = useTheme();
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleCopyLink = () => {
    closeMenu();
    onCopyLink();
  };

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <IconButton
          icon="share-variant"
          size={size}
          iconColor={iconColor || colors.text.secondary}
          onPress={openMenu}
          hitSlop={HIT_SLOP}
        />
      }
      contentStyle={{
        backgroundColor: colors.background.secondary,
      }}
    >
      <Menu.Item
        onPress={handleCopyLink}
        title="Copy Link"
        leadingIcon="link"
        titleStyle={{ color: colors.text.primary }}
      />
    </Menu>
  );
}
