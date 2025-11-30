import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'

const Statistics = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/developing.gif")}
          style={styles.devImage}
        />
        <Typo   >
          Module Under Active Development
        </Typo>
      </View>
    </ScreenWrapper>
  )
}

export default Statistics

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  devImage: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 40
  }
})
