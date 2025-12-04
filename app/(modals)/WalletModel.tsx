import BackButton from "@/components/BackButton";
import Buttton from "@/components/Buttton";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { updateUser } from "@/services/userService";
import { WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    View
} from "react-native";

const WalletModel = () => {
  const { user, updateUserData } = useAuth();
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
 
   
  const onpickImage = async () => {
 
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
      ///setUserData({...userData, image: result.assets[0]});
    }
  };


  const onSubmit = async () => {
    let { name, image } = wallet;
    if (!name.trim()) {
      Alert.alert("User", "Please fill all fields");
      return;
    }

    setLoading(true);
    const res = await updateUser(user?.uid as string, wallet);
    setLoading(false);

    if (res.success) {
      // refresh user data in context (if this is what updateUserData does)
      updateUserData(user?.uid as string);
      router.back();
    } else {
      Alert.alert("User", res.msg);
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="New Wallet"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView contentContainerStyle={styles.form}>
 

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Name</Typo>
            <Input
              placeholder="Salary"
              value={wallet.name}
              onChangeText={(value) =>
                setWallet({ ...wallet, name: value })
              }
            />
          </View>
            <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Icon</Typo>
            //here add a custom image picker for wallet icon
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Buttton onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight="700">
            Add Wallet
          </Typo>
        </Buttton>
      </View>
    </ModalWrapper>
  );
};

export default WalletModel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingX._20,
    // paddingVertical: spacingY._30,
  },

  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
    gap: scale(12),
  },

  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },

  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },

  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },

  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,

    height: verticalScale(40),
    width: verticalScale(40),
    borderRadius: 100,

    backgroundColor: colors.neutral100,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },

  inputContainer: {
    gap: spacingY._10,
  },
});
