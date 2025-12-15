import Buttton from "@/components/Buttton";
import HomeCard from "@/components/HomeCard";
import ModalWrapper from "@/components/ModalWrapper";
import TransctionList from "@/components/TransctionList";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";
import { verticalScale } from "@/utils/styling";
 
import { Image } from "expo-image";
import { router } from "expo-router";
import { limit, orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const HomeScreen = () => {
  const { user } = useAuth();

  const constraints = [
    where("uid", "==", user?.uid),
    orderBy("date" , "desc"), 
    limit(90)
  ];

    const {
      data: recentTransactions,
      error,
      loading: transactionsLoading,
    } = useFetchData<TransactionType>('transactions', constraints);

  return (
    <ModalWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <Image
              style={styles.avatar}
              source={user?.image}
              contentFit="cover"
              transition={100}
            />

            <View style={styles.textContainer}>
              <Typo size={16} color={colors.neutral400}>
                Good to see you,
              </Typo>
              <Typo size={16} fontWeight={"500"}>
                {user?.name}
              </Typo>
            </View>

            <TouchableOpacity style={styles.search}>
              <Icons.MagnifyingGlass
                size={verticalScale(22)}
                color={colors.neutral200}
                weight="bold"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <HomeCard />
          </View>

          <TransctionList 
            title="Recent Transctions" 
            data={recentTransactions} 
            loading={transactionsLoading} 
            emptyListMessage="No Transctions added yet!"
          />

        </ScrollView>

        <Buttton style={styles.floatingButton} onPress={()=> router.push('/(modals)/TransctionModal')}>
           <Icons.Plus
            color={colors.black}
            weight="bold"
            size={verticalScale(24)}
           /> 
        </Buttton>
      </View>
    </ModalWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(25),
  },

  header: {
    marginBottom: spacingY._10,
  },

  search: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 50,
    marginLeft: "auto",
  },

  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },

  scrollView: {
    flex: 1,
  },

  scrollViewContent: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },

  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    width: "100%",
  },

  textContainer: {
    justifyContent: "center",
  },
});
