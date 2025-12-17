 
import CustomTabs from '@/components/CustomTabs'
import { Tabs } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

const _layout = () => {
  return (
    <Tabs tabBar={(props) => <CustomTabs {...props} />} screenOptions={{ headerShown: false }}>
    <Tabs.Screen name='index' />
    <Tabs.Screen name='statistics' />
    <Tabs.Screen name='Wallet' />
    <Tabs.Screen name='Profile' />
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({})