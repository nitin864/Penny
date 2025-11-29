import Buttton from '@/components/Buttton'
import Typo from '@/components/Typo'
import { auth } from '@/config/firebase'
import { colors } from '@/constants/theme'
import { useAuth } from '@/context/authContext'
import { signOut } from 'firebase/auth'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Home = () => {
  const {user} = useAuth();
  console.log("user: " , user);

  

  const handleLogout = async() => {
    await signOut(auth);
  }

  return (
    <View>
      <Text>index</Text>
      <Buttton onPress={handleLogout}>
        <Typo color={colors.black}>
            Logout
        </Typo>
      </Buttton>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})