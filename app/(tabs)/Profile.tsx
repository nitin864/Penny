import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { auth } from "@/config/firebase";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { getProfileImage } from "@/services/imageServices";
import { accountOptionType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import * as Icons from "phosphor-react-native";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Logout error:", err);
    }
  };

  const showLogoutAlert = () => {
    Alert.alert("Confirm", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("canceled Logout function"),
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => handleLogout(),
        style: "destructive",
      },
    ]);
  };

  const handlePress = (item: accountOptionType) => {
    if (item.title === "Logout") {
      showLogoutAlert();
      return;
    }

    if (item.routeName) {
      router.push(item.routeName);
      return;
    }

     
    console.log("Pressed:", item.title);
  };

  const accountOptions: accountOptionType[] = [
    {
      title: "Edit Profile", 
      icon: <Icons.User size={26} color={colors.white} weight="fill" />,
      bgColor: "#6366f1",
      routeName: "/(modals)/profileModal",    },
    {
      title: "Settings",
      icon: <Icons.Gear size={26} color={colors.white} weight="fill" />,
      bgColor: "#059669",
    },
    {
      title: "Privacy Policy",
      icon: <Icons.Lock size={26} color={colors.white} weight="fill" />,
      bgColor: colors.neutral600,
    },
    {
      title: "Logout",
      icon: <Icons.Power size={26} color={colors.white} weight="fill" />,
      bgColor: "#e11d48",
    },
  ];

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Profile" style={{ marginVertical: spacingY._10 }} />

        {/* userimage */}
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={getProfileImage(user?.image)}
              contentFit="cover"
              transition={100}
            />
          </View>
        </View>

        <View style={styles.nameContainer}>
          <Typo size={24} fontWeight="600" color={colors.neutral100}>
            {user?.name}
          </Typo>
          <Typo size={15} color={colors.neutral400}>
            {user?.email}
          </Typo>
        </View>

        <View style={styles.accountOptions}>
          {accountOptions.map((item, index) => {
            return (
              <View style={styles.listItem} key={index}>
                <TouchableOpacity
                  style={styles.flexRow}
                  onPress={() => handlePress(item)}         
                >
                  {/* icon */}
                  <View
                    style={[
                      styles.listIcon,
                      {
                        backgroundColor: item?.bgColor,
                      },
                    ]}
                  >
                    {item.icon}
                  </View>

                  {/* title */}
                  <Typo size={16} style={{ flex: 1 }} fontWeight="500">
                    {item.title}
                  </Typo>

                  {/* arrow */}
                  <Icons.CaretRight
                    size={verticalScale(20)}
                    weight="bold"
                    color={colors.white}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },

  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15,
    marginBottom: 25,
  },

  avatarContainer: {
    height: verticalScale(150),
    width: verticalScale(150),
    borderRadius: 200,
    borderWidth: 4,
    borderColor: "#3b82f6", // blue border
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
  },

  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 8,
    borderRadius: 50,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
  },

  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },

  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },

  listItem: {
    marginBottom: verticalScale(17),
  },

  accountOptions: {
    marginTop: spacingY._35,
  },

  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
});
