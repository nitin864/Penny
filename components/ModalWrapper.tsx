import { colors, spacingY } from '@/constants/theme';
import { ModalWrapperProps } from '@/types';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';


const isAndroid = Platform.OS == "android";
 
const ModalWrapper = ({
  style,
  children,
  bg = colors.neutral800,
}: ModalWrapperProps) => {
  return (
    <View style={[styles.container, { backgroundColor: bg }, style && style]}>
      {children}
    </View>
  );
};

export default ModalWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: isAndroid ? 20 : spacingY._15 ,
    paddingBottom: isAndroid ? spacingY._10: spacingY._20,
  },
});
