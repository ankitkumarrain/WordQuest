import React, { ReactNode } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { borderRadius } from '@/constants/borderRadius';
import { spacing } from '@/constants/spacing';
import { shadows } from '@/constants/shadows';
import { Icon } from './Icon';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  closeOnBackdropPress?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  footer,
  showCloseButton = true,
  closeOnBackdropPress = true,
  style,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={closeOnBackdropPress ? onClose : undefined}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.card, shadows.lg, style]}>
              {(title || showCloseButton) && (
                <View style={styles.header}>
                  {title ? (
                    <Text style={[typography.h2, styles.title]}>{title}</Text>
                  ) : (
                    <View />
                  )}
                  {showCloseButton && (
                    <Pressable
                      onPress={onClose}
                      style={styles.closeBtn}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Icon name="close" size={22} color={colors.textSecondary} />
                    </Pressable>
                  )}
                </View>
              )}
              <View style={styles.body}>{children}</View>
              {footer && <View style={styles.footer}>{footer}</View>}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.backgroundOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xxl,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorderLight,
    padding: spacing.xl,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
  },
  closeBtn: {
    padding: spacing.xs,
    borderRadius: borderRadius.circle,
    backgroundColor: colors.surface,
  },
  body: {
    marginBottom: spacing.md,
  },
  footer: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
});
