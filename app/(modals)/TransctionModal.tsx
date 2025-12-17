import BackButton from "@/components/BackButton";
import Buttton from "@/components/Buttton";
import { expenseCategories, transactionTypes } from "@/components/data";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import useFetchData from "@/hooks/useFetchData";
import { createOrUpdateTransaction, deleteTransaction } from "@/services/transctionServices";
import { TransactionType, WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const TransctionModal = () => {
  const { user } = useAuth();
  const [transction, setTransction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);

type paramType = {
  id: string;
  type: string;
  amount: string;
  category: string;
  date: string;
  description: string;
  image?: any;
  uid?: string;
  walletId: string;
};

const oldTransctions = useLocalSearchParams() as paramType;


  const OnDelete = async () => {
    if (!oldTransctions?.id) return;
    setLoading(true);
    const res = await deleteTransaction(oldTransctions?.id , oldTransctions.walletId );
    setLoading(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("Transaction", res.msg);
    }
  };

  const deleteAlert = () => {
    Alert.alert(
      "Delete transaction?",
      "This will remove this transaction and recent transaction linked to it.",
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

  const [isFocus, setIsFocus] = useState(false);
  const {
    data: wallets = [],
    error: walletError,
    loading: walletLoading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || transction.date;
    setTransction({ ...transction, date: currentDate });
    setShowDatePicker(false);
  };

  useEffect(() => {
  if (oldTransctions?.id) {
    setTransction({
      type: oldTransctions.type,
      amount: Number(oldTransctions.amount),
      description: oldTransctions.description || "",
      category: oldTransctions.category || "",
      date: new Date(oldTransctions.date),
      walletId: oldTransctions.walletId,
      image: oldTransctions.image,
    });
  }
}, []);


  const onSubmit = async () => {
     const {type, amount , description , category, date , walletId , image} = transction;

     if(!walletId || !date || !amount || (type == "expense" && !category)){
      Alert.alert("Transaction", "Please fill all the fields");
      return;
     }

     let transactionData: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image : image ? image: null,
      uid: user?.uid
     }
     

 
     if(oldTransctions?.id) transactionData.id = oldTransctions.id;

     setLoading(true);
     const res = await createOrUpdateTransaction(transactionData);

     setLoading(false);
      if(res.success){
        router.back();
      }else{
        Alert.alert("Transaction" , res.msg)
      }
  };

  const isEditMode = !!oldTransctions?.id;

  return (
    <ModalWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={styles.container}>
          <Header
            title={isEditMode ? "Update transactions" : "New transactions"}
            leftIcon={<BackButton />}
            style={{ marginBottom: spacingY._10 }}
          />

          <View style={styles.subtitleRow}>
            <Typo size={13} color={colors.neutral400}>
              {isEditMode
                ? "Change transactions name or icon."
                : "Create a transactions to track your money."}
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

          <ScrollView
            contentContainerStyle={styles.form}
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formCard}>
              {/*  Transction Type*/}

              <View style={styles.inputContainer}>
                <Typo color={colors.neutral200} size={16}>
                  Type
                </Typo>

                <Dropdown
                  style={styles.dropdownContainer}
                  activeColor={colors.neutral700}
                  selectedTextStyle={styles.dropdownSelectedText}
                  iconStyle={styles.dropdownIcon}
                  data={transactionTypes}
                  maxHeight={300}
                  itemTextStyle={styles.dropdownItemText}
                  itemContainerStyle={styles.dropdownItemContainer}
                  containerStyle={styles.dropdownListContainer}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? "Select item" : "..."}
                  searchPlaceholder="Search..."
                  value={transction.type}
                  onChange={(item) => {
                    setTransction({ ...transction, type: item.value });
                  }}
                />
              </View>

              {/* Wallets*/}

              <View style={styles.inputContainer}>
                <Typo color={colors.neutral200} size={16}>
                  Wallet
                </Typo>

                <Dropdown
                  style={styles.dropdownContainer}
                  placeholderStyle={styles.dropdownPlaceholder}
                  activeColor={colors.neutral700}
                  selectedTextStyle={styles.dropdownSelectedText}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.dropdownIcon}
                  data={wallets.map((wallet) => ({
                    label: `${wallet?.name} (₹${wallet.amount})`,
                    value: wallet?.id,
                  }))}
                  search
                  maxHeight={300}
                  itemTextStyle={styles.dropdownItemText}
                  itemContainerStyle={styles.dropdownItemContainer}
                  containerStyle={styles.dropdownListContainer}
                  labelField="label"
                  valueField="value"
                  placeholder={"Select Wallet"}
                  searchPlaceholder="Search..."
                  value={transction.walletId}
                  onChange={(item) => {
                    setTransction({
                      ...transction,
                      walletId: item.value || "",
                    });
                  }}
                />
              </View>

              {/* Expense Categories*/}

              {transction.type === "expense" && (
                <View style={styles.inputContainer}>
                  <Typo color={colors.neutral200} size={16}>
                    Expense Categories
                  </Typo>

                  <Dropdown
                    style={styles.dropdownContainer}
                    placeholderStyle={styles.dropdownPlaceholder}
                    activeColor={colors.neutral700}
                    selectedTextStyle={styles.dropdownSelectedText}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.dropdownIcon}
                    data={Object.values(expenseCategories)}
                    search
                    maxHeight={300}
                    itemTextStyle={styles.dropdownItemText}
                    itemContainerStyle={styles.dropdownItemContainer}
                    containerStyle={styles.dropdownListContainer}
                    labelField="label"
                    valueField="value"
                    placeholder={"Select Category"}
                    searchPlaceholder="Search..."
                    value={transction.category}
                    onChange={(item) => {
                      setTransction({
                        ...transction,
                        category: item.value || "",
                      });
                    }}
                  />
                </View>
              )}

              {/* Date Picker*/}

              <View style={styles.inputContainer}>
                <Typo color={colors.neutral200} size={16}>
                  Date
                </Typo>
                {!showDatePicker && (
                  <Pressable
                    style={styles.dateInput}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Typo size={14}>
                      {(transction.date as Date).toLocaleDateString()}
                    </Typo>
                  </Pressable>
                )}

                {showDatePicker && (
                  <View style={Platform.OS == "ios" && styles.iosDatePicker}>
                    <DateTimePicker
                      themeVariant="dark"

                      value={transction.date as Date}
                      textColor={colors.white}
                      mode="date"
                      display={Platform.OS == "ios" ? "spinner" : "default"}
                      onChange={onDateChange}
                    />
                  </View>
                )}
              </View>

              {/* Amount */}
              <View style={styles.inputContainer}>
                <Typo color={colors.neutral200} size={16}>
                  Amount
                </Typo>

                <Input
                  placeholder="Salary"
                  keyboardType="numeric"
                  returnKeyType="done"
                  blurOnSubmit
                  value={transction.amount?.toString()}
                  onChangeText={(value) =>
                    setTransction({
                      ...transction,
                      amount: Number(value.replace(/[^0-9]/g, "")),
                    })
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.flexRow}>
                  <Typo color={colors.neutral200} size={16}>
                    Description
                  </Typo>
                  <Typo color={colors.neutral500} size={14}>
                    (optional)
                  </Typo>
                </View>

                <Input
                  value={transction.description}
                  multiline
                  containerStyle={{
                    flexDirection: "row",
                    height: verticalScale(100),
                    alignItems: "flex-start",
                    paddingVertical: 15,
                  }}
                  inputStyle={{
                    textAlignVertical: "top",
                  }}
                  onChangeText={(value) =>
                    setTransction({
                      ...transction,
                      description: value,
                    })
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.flexRow}>
                  <Typo color={colors.neutral200} size={16}>
                    Receipt
                  </Typo>
                  <Typo color={colors.neutral500} size={14}>
                    (optional)
                  </Typo>
                </View>

                <ImageUpload
                  file={transction.image}
                  onSelect={(file) =>
                    setTransction({ ...transction, image: file })
                  }
                  onClear={() => setTransction({ ...transction, image: null })}
                />
                <Typo
                  size={11}
                  color={colors.neutral500}
                  style={{ marginTop: spacingY._5 }}
                >
                  Tip: Upload the receipt so you can easily verify and track this transaction later.
                </Typo>
              </View>
            </View>
          </ScrollView>
        </View>

        <View style={styles.footer}>
          {isEditMode && !loading && (
            <Buttton onPress={deleteAlert} style={styles.deleteButton}>
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
              {isEditMode ? "Update" : "Submit"}
            </Typo>
          </Buttton>
        </View>
      </KeyboardAvoidingView>
    </ModalWrapper>
  );
};

export default TransctionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(25),
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
  /* ---------- Containers ---------- */

  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
  },

  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },

  /* ---------- Dropdown ---------- */
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
    backgroundColor: colors.neutral900,
  },
  inputSearchStyle: {
    height: verticalScale(40),
    fontSize: verticalScale(14),
    color: colors.white,
    backgroundColor: colors.neutral800,
    borderRadius: radius._10,
    paddingHorizontal: spacingX._10,
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },

  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },

  dropdown: {
    height: verticalScale(54),
  },

  dropdownText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },

  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },

  dropdownPlaceholder: {
    color: colors.white,
  },

  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
  },
  dropdownItemText: { color: colors.white },

  /* ---------- Date Picker ---------- */
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },

  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingX._7,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._10,
  },

  iosDatePicker: {
    // backgroundColor: "red",
  },

  /* ---------- Platform Specific ---------- */
  androidDropDown: {
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    fontSize: verticalScale(14),
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
  },

  iosDropDown: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    borderWidth: 1,
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },

  /* ---------- Shadows ---------- */
  shadowBox: {
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
});
