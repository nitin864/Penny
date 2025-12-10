import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
const index = () => {
  const { user } = useAuth();

  return (
    <ModalWrapper>
      <View style={styles.container}>
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
              <Icons.MagnifyingGlassIcon
                size={verticalScale(22)}
                color={colors.neutral200}
                weight="bold"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ModalWrapper>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(25),
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  scrollViewStyle: {
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
