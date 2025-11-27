import { BackButtonProps } from '@/types';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

const BackButton = ({
    style,
    iconSize = 26
}: BackButtonProps) => {

  const router = useRouter();

  return (
    <TouchableOpacity onPress={()=> router.back()} style={[styles.backButton]}>
       <Ionicons name="chevron-back" style={styles.backIcon} />
    </TouchableOpacity>
  )
}

export default BackButton

const styles = StyleSheet.create({

backButton: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "rgba(255,255,255,0.15)", // subtle frosted circle
  justifyContent: "center",
  alignItems: "center",

  // shadow for iOS & Android
  shadowColor: "#000",
  shadowOpacity: 0.12,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
  elevation: 3,
},
backIcon: {
  fontSize: 22,
  color: "#fff", // adjust if dark mode
},

})