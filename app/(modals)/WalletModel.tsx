import BackButton from "@/components/BackButton";
import Buttton from "@/components/Buttton";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletServices";
import { WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import * as Icons from 'phosphor-react-native';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View
} from "react-native";

const WalletModel = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const OnDelete = async()=> {
     if(!oldWallet?.id) return;
     setLoading(true);
     const res = await deleteWallet(oldWallet?.id);
     setLoading(false);
     if (res.success){
      router.back();

     }else{
      Alert.alert("Wallet" , res.msg);
     }
  };

 const deleteAlert = ()=> {
  Alert.alert("Confirm" , "Are you sure you want to delete this wallet? \nThis will remove all your recent transactions related to this wallet.", 
    [
      {
        text: "Cancel",
        onPress: ()=> console.log("cancel delete"),
        style: "cancel"
      },
      {
        text: "Delete",
        onPress: ()=> OnDelete(),
        style: "destructive"
      }
    ]
  )
 }

  const oldWallet = useLocalSearchParams<{
    name?: string;
    image?: string;
    id?: string;
  }>();

  
  useEffect(() => {
    if (oldWallet?.id) {
      setWallet(prev => ({
        ...prev,
        name: oldWallet.name ?? prev.name,
        // cast if your WalletType.image is not string
        image: (oldWallet.image as any) ?? prev.image,
      }));
    }
  }, []); 
  const onSubmit = async () => {
    let { name, image } = wallet;
    if (!name.trim() || !image) {
      Alert.alert("Wallet", "Please fill all fields");
      return;
    }

    const data: WalletType = {
      name,
      image,
      uid: user?.uid,
    };

    if (oldWallet?.id) data.id = oldWallet.id as any;

    setLoading(true);
    const res = await createOrUpdateWallet(data);
    setLoading(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet", res.msg);
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldWallet?.id ? "Update Wallet" : "New Wallet"}
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
            <ImageUpload
              file={wallet.image}
              onSelect={(file) => setWallet({ ...wallet, image: file })}
              onClear={() => setWallet({ ...wallet, image: null })}
              placeholder="Upload Icon"
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>

        {

          oldWallet?.id && !loading && (
            <Buttton 
             onPress={deleteAlert}
            style={{ backgroundColor: colors.rose, paddingHorizontal: spacingX._15}}>
               <Icons.Trash
                 color={colors.white}
                 size={verticalScale(24)}
                 weight="bold"
               />  
            </Buttton>
          )

        }
        <Buttton onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight="700">
            {oldWallet?.id ? "Update Wallet" : "Add Wallet"}
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
