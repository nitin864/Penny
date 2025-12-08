import BackButton from "@/components/BackButton";
import Buttton from "@/components/Buttton";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletServices";
import { WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

const WalletModel = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const oldWallet = useLocalSearchParams<{
    name?: string;
    image?: string;
    id?: string;
  }>();

  const OnDelete = async () => {
    if (!oldWallet?.id) return;
    setLoading(true);
    const res = await deleteWallet(oldWallet.id as string);
    setLoading(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet", res.msg);
    }
  };

  const deleteAlert = () => {
    Alert.alert(
      "Delete wallet?",
      "This will remove this wallet and recent transactions linked to it.",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => OnDelete(),
          style: "destructive",
        },
      ]
    );
  };

  useEffect(() => {
    if (oldWallet?.id) {
      setWallet((prev) => ({
        ...prev,
        name: oldWallet.name ?? prev.name,
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

  const isEditMode = !!oldWallet?.id;

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={isEditMode ? "Update Wallet" : "New Wallet"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <View style={styles.subtitleRow}>
          <Typo size={13} color={colors.neutral400}>
            {isEditMode
              ? "Change wallet name or icon."
              : "Create a wallet to track your money."}
          </Typo>

          {isEditMode && (
            <View style={styles.editBadge}>
              <Icons.PencilSimple
                size={14}
                color={colors.primary}
                weight="bold"
              />
              <Typo size={12} color={colors.primary}>
                Editing
              </Typo>
            </View>
          )}
        </View>

        <ScrollView contentContainerStyle={styles.form} bounces={false}>
          <View style={styles.formCard}>
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200}>Wallet Name</Typo>
              <Input
                placeholder="Salary, Cash, Savings..."
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
              <Typo
                size={11}
                color={colors.neutral500}
                style={{ marginTop: spacingY._5 }}
              >
                Tip: Use simple icons so you can recognize wallets quickly.
              </Typo>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {isEditMode && !loading && (
          <Buttton
            onPress={deleteAlert}
            style={styles.deleteButton}
          >
            <Icons.Trash
              color={colors.rose}
              size={verticalScale(20)}
              weight="bold"
            />
            <Typo
              size={13}
              color={colors.rose}
              fontWeight="600"
              style={{ marginLeft: 6 }}
            >
              Delete
            </Typo>
          </Buttton>
        )}

        <Buttton
          onPress={onSubmit}
          loading={loading}
          style={styles.primaryButton}
        >
          <Typo color={colors.black} fontWeight="700">
            {isEditMode ? "Save Changes" : "Add Wallet"}
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

  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacingY._5,
  },

  editBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacingX._10,
    paddingVertical: spacingY._10,
    borderRadius: radius._20,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.neutral900,
    gap: 4,
  },

  form: {
    paddingTop: spacingY._10,
    paddingBottom: spacingY._20,
  },

  formCard: {
    gap: spacingY._20,
    borderRadius: radius._20,
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._20,
    backgroundColor: colors.neutral800,
    
  },

  inputContainer: {
    gap: spacingY._10 ?? spacingY._10,
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

  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._10,
    borderRadius: radius._20,
    borderWidth: 1,
    borderColor: colors.rose,
    backgroundColor: "transparent",
  },

  primaryButton: {
    flex: 1,
  },
});
