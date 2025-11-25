import { colors } from '@/constants/theme'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const index = () => {
  return (
    <View style={styles.container}>
      <Text>index</Text>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
 
  container :{
    flex:1,
    justifyContent: 'center',
    alignContent : "center",
    backgroundColor: colors.neutral900
  }

})