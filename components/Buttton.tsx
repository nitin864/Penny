import { colors, radius } from '@/constants/theme'
import { CustomButtonProps } from '@/types'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Loading from './Loading'

const Buttton = ({
    style,
    onPress,
    loading = false,
    children
}: CustomButtonProps) => {

   if(loading){
    return(
        <View style={[styles.button , style , {backgroundColor : "transparent"}]}>
            ///loading component here
            <Loading/>
        </View>
    )
   }

  return (
    <TouchableOpacity onPress={onPress} style={[styles.button , style]}>
      {children}
    </TouchableOpacity>
  )
}

export default Buttton

const styles = StyleSheet.create({

  button : {
    backgroundColor : colors.primary,
    borderRadius : radius._17,
    borderCurve : "continuous",
    justifyContent: "center",
    alignItems: "center",
  }

})