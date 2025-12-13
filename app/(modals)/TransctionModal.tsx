import BackButton from "@/components/BackButton";
import Buttton from "@/components/Buttton";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { deleteWallet } from "@/services/walletServices";
import { TransactionType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
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

  const oldTransctions = useLocalSearchParams<{
    name?: string;
    image?: string;
    id?: string;
  }>();

  const OnDelete = async () => {
    if (!oldTransctions?.id) return;
    setLoading(true);
    const res = await deleteWallet(oldTransctions.id as string);
    setLoading(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("transctions", res.msg);
    }
  };

  const deleteAlert = () => {
    Alert.alert(
      "Delete transctions?",
      "This will remove this transctions and recent transactions linked to it.",
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

    const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    
        const renderLabel = () => {
      if (value || isFocus) {
        return (
          <Text style={[styles.label, isFocus && { color: 'blue' }]}>
            Dropdown label
          </Text>
        );
      }
      return null;
    };

  // useEffect(() => {
  //   if (oldTransctions?.id) {
  //     setTransctions((prev) => ({
  //       ...prev,
  //       name: oldTransctions.name ?? prev.name,
  //       image: (oldTransctions.image as any) ?? prev.image,
  //     }));
  //   }
  // }, []);

   const onSubmit = async () => {
  //   let { name, image } = transction;
  //   if (!name.trim() || !image) {
  //     Alert.alert("transctions", "Please fill all fields");
  //     return;
  //   }

  //   const data: transctionsType = {
  //     name,
  //     image,
  //     uid: user?.uid,
  //   };

  //   if (oldTransctions?.id) data.id = oldTransctions.id as any;

  //   setLoading(true);
  //   const res = await createOrUpdatetransctions(data);
  //   setLoading(false);

  //   if (res.success) {
  //     router.back();
  //   } else {
  //     Alert.alert("transctions", res.msg);
  //   }
   };

  const isEditMode = !!oldTransctions?.id;

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={isEditMode ? "Update transctions" : "New transctions"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <View style={styles.subtitleRow}>
          <Typo size={13} color={colors.neutral400}>
            {isEditMode
              ? "Change transctions name or icon."
              : "Create a transctions to track your money."}
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

        <ScrollView contentContainerStyle={styles.form} bounces={false} showsVerticalScrollIndicator={false}>
          <View style={styles.formCard}>
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200}>Type</Typo>
               
          <Dropdown
          style={styles.dropdownContainer}
          placeholderStyle={styles.dropdownPlaceholder}
          activeColor={colors.neutral700}
          selectedTextStyle={styles.dropdownSelectedText}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.dropdownIcon}
          data={data}
          search
          maxHeight={300}
          itemTextStyle={styles.dropdownItemText}
          itemContainerStyle={styles.dropdownItemContainer}
          containerStyle={styles.dropdownListContainer}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={value}
   
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
 
          />
                
                
            </View>

            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200}>Transctions Icon</Typo>
              <ImageUpload
                file={transction.image}
                onSelect={(file) => setTransction({ ...transction, image: file })}
                onClear={() => setTransction({ ...transction, image: null })}
                
              />
              <Typo
                size={11}
                color={colors.neutral500}
                style={{ marginTop: spacingY._5 }}
              >
                Tip: Use simple icons so you can recognize transctionss quickly.
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
            {isEditMode ? "Save Changes" : "Add transctions"}
          </Typo>
        </Buttton>
      </View>
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
  dropdownItemText:  {color: colors.white},

  /* ---------- Date Picker ---------- */
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15
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
