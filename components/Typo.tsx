import { colors } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { TextStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

interface TypoProps extends TextProps {
  size?: number;
  color?: string;
  fontWeight?: string;
  style?: any;
  children?: React.ReactNode;
}

const Typo = ({
  size = 16,
  color = colors.text,
  fontWeight = "400",
  style,
  children,
  ...textProps
}: TypoProps) => {
  const textStyle: TextStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(18),
    color,
    fontWeight: "400",
  };

  return (
    <Text {...textProps} style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;

const styles = StyleSheet.create({});
