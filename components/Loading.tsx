import { colors } from '@/constants/theme'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Loading = ({
    size = "large", 
    color = colors.primary
}) => {
  return (
    <View>
      <Text>Loading</Text>
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({})