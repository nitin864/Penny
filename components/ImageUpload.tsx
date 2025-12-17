import { colors, radius } from '@/constants/theme'
import { getFilePath } from '@/services/imageServices'
import { ImageUploadProps } from '@/types'
import { scale, verticalScale } from '@/utils/styling'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import * as Icons from "phosphor-react-native"
import React from 'react'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import Typo from './Typo'

const ImageUpload = ({
  file = null,
  onSelect,
  onClear,
  containerStyle,
  imageStyle,
  placeholder = ""
}: ImageUploadProps) => {

  const pickImage = async ()=> {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (!permissionResult.granted) {
          Alert.alert('Permission required', 'Permission to access the media library is required.');
          return;
        }
    
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.5,
        });
    
    
        if (!result.canceled) {
           onSelect(result.assets[0]);
        }
  }


  return (
    <View style={[styles.container, containerStyle]}>

      {/* If no file - show upload UI */}
      {!file && (
        <TouchableOpacity 

          onPressIn={pickImage}
          style={[styles.inputContainer ,containerStyle && containerStyle]}
          onPress={onSelect}
          activeOpacity={0.7}
        >
          <Icons.UploadSimple size={32} color={colors.neutral200} />

          {placeholder !== "" && (
            <Typo size={15} color={colors.neutral200} style={{ marginTop: 8 }}>
              {placeholder}
            </Typo>
          )}
        </TouchableOpacity>
      )}

      { 
        file && (
            <View style={[styles.image, imageStyle && imageStyle]}>
            <Image
               style={{flex: 1}}
               source={getFilePath(file)}
               contentFit="cover"
               transition={100}
            />
            <TouchableOpacity style={styles.deleteIcon} onPress={onClear}>
                <Icons.XCircle
                 size={24}
                 weight='fill'
                 color={colors.white}
                /> 
            </TouchableOpacity>

            </View>    
        )
      }
 

    </View>
  )
}

export default ImageUpload

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    height: verticalScale(54),
    backgroundColor: colors.neutral700,
    borderRadius: radius._15,
    alignItems: "center",
    gap: "10",
    borderWidth: 1,
    borderColor: colors.neutral500,
    borderStyle: "dashed"
  },
  image: {
     height: scale(150),
     width: scale(150),
     borderRadius: radius._15,
     borderCurve: "continuous",
     overflow: "hidden"
  },

  deleteIcon: {
    position: "absolute",
    top: scale(6),
    right: scale(6),
    shadowOffset: { width: 0, height: 5},
    shadowOpacity: 1,
    shadowRadius: 10
  }
})
