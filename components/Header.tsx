import { HeaderProps } from '@/types'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Typo from './Typo'

const Header = ({ title = "", leftIcon, style }: HeaderProps) => {
  return (
    <View style={[styles.container, style]}>

      {/* LEFT */}
      <View style={styles.side}>
        {leftIcon}
      </View>

      {/* CENTER TITLE */}
      <View style={styles.center}>
        {title !== "" && (
          <Typo
            size={22}
            fontWeight="600"
            numberOfLines={1}
            style={styles.title}
          >
            {title}
          </Typo>
        )}
      </View>

      {/* RIGHT (empty placeholder keeps center PERFECT) */}
      <View style={styles.side} />
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  // Fixed width areas on left + right
  side: {
    width: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  title: {
    textAlign: "center",
  },
})
