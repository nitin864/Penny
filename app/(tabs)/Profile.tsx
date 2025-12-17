import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { auth } from "@/config/firebase";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { getProfileImage } from "@/services/imageServices";
import { accountOptionType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import * as Icons from "phosphor-react-native";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showDevSection, setShowDevSection] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      
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
 
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => 
      console.error("Failed to open URL:", err)
    );
  };

  const accountOptions: accountOptionType[] = [
    {
      title: "Edit Profile",
      icon: <Icons.User size={26} color={colors.white} weight="fill" />,
      bgColor: "#6366f1",
      routeName: "/(modals)/profileModal",
    },
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

  const socialLinks = [
    {
      name: "GitHub",
      icon: "logo-github",
      url: "https://github.com/nitin864",
      color: "#181717",
    },
    {
      name: "LinkedIn",
      icon: "logo-linkedin",
      url: "https://linkedin.com/in/nitin864",
      color: "#0A66C2",
    },
    {
      name: "Twitter",
      icon: "logo-twitter",
      url: "https://x.com/rajnitin793",
      color: "#1DA1F2",
    },
    {
      name: "Portfolio",
      icon: "globe-outline",
      url: "https://nitin-theta.vercel.app/",
      color: "#6366f1",
    },
  ];

  const techStack = [
    { name: "React Native", icon: "⚛️" },
    { name: "Next.js", icon: "▲" },
    { name: "Node.js", icon: "🟢" },
    { name: "MongoDB", icon: "🍃" },
    { name: "Firebase", icon: "🔥" },
    { name: "TypeScript", icon: "💠" },
  ];

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.container,
          {
            paddingBottom: insets.bottom + verticalScale(28),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Header title="Profile" style={{ marginVertical: spacingY._10 }} />

        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={[colors.neutral900, colors.neutral800]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          >
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={getProfileImage(user?.image)}
                contentFit="cover"
                transition={100}
              />
              <View style={styles.avatarBorder} />
            </View>

            <View style={styles.nameContainer}>
              <Typo size={20} fontWeight="700" color={colors.white}>
                {user?.name}
              </Typo>
              <Typo size={13} color="rgba(255,255,255,0.8)">
                {user?.email}
              </Typo>
            </View>
          </LinearGradient>
        </View>

        {/* Account Options */}
        <View style={styles.accountOptions}>
          {accountOptions.map((item, index) => {
            return (
              <View style={styles.listItem} key={index}>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handlePress(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
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

                    <Typo size={16} style={{ flex: 1 }} fontWeight="500">
                      {item.title}
                    </Typo>

                    <Icons.CaretRight
                      size={verticalScale(20)}
                      weight="bold"
                      color={colors.neutral400}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Developer Section Toggle */}
        <TouchableOpacity
          style={styles.devSectionToggle}
          onPress={() => setShowDevSection(!showDevSection)}
          activeOpacity={0.7}
        >
          <View style={styles.devToggleContent}>
            <Ionicons name="code-slash" size={scale(22)} color={colors.primary} />
            <Typo size={16} fontWeight="600" color={colors.white}>
              About Developer
            </Typo>
          </View>
          <Ionicons 
            name={showDevSection ? "chevron-up" : "chevron-down"} 
            size={scale(22)} 
            color={colors.neutral400} 
          />
        </TouchableOpacity>

        {/* Developer Details Section */}
        {showDevSection && (
          <View style={styles.devSection}>
            {/* Developer Header */}
            <View style={styles.devHeader}>
              <View style={styles.devAvatarContainer}>
                <Image
                  source={{ uri: "https://avatars.githubusercontent.com/u/91000126?v=4" }}
                  style={styles.devAvatar}
                  contentFit="cover"
                />
              </View>
              <View style={styles.devInfo}>
                <Typo size={18} fontWeight="700" color={colors.white}>
                  Nitin
                </Typo>
                <Typo size={12} color={colors.neutral400}>
                  Full-Stack Developer
                </Typo>
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={scale(11)} color={colors.neutral400} />
                  <Typo size={11} color={colors.neutral400}>
                    Kolkata, India
                  </Typo>
                </View>
              </View>
            </View>

            {/* Bio */}
            <View style={styles.bioContainer}>
              <Typo size={13} color={colors.neutral300} style={styles.bioText}>
                💻 Self-taught Full-Stack & React Native Developer passionate about 
                building mobile apps and real-time systems that solve real-world problems.
              </Typo>
              <Typo size={12} color={colors.neutral400} style={styles.bioQuote}>
                "Mine linux kernel boots faster than your thoughts...!"
              </Typo>
            </View>

            {/* Tech Stack */}
            <View style={styles.techStackContainer}>
              <Typo size={14} fontWeight="600" color={colors.white} style={styles.sectionTitle}>
                Tech Stack
              </Typo>
              <View style={styles.techGrid}>
                {techStack.map((tech, index) => (
                  <View key={index} style={styles.techBadge}>
                    <Typo size={16}>{tech.icon}</Typo>
                    <Typo size={11} color={colors.neutral300}>
                      {tech.name}
                    </Typo>
                  </View>
                ))}
              </View>
            </View>

            {/* Projects */}
            <View style={styles.projectsContainer}>
              <Typo size={14} fontWeight="600" color={colors.white} style={styles.sectionTitle}>
                Featured Projects
              </Typo>
              
              <TouchableOpacity 
                style={styles.projectCard}
                onPress={() => openLink("https://github.com/nitin864/CineCue")}
              >
                <View style={styles.projectHeader}>
                  <Ionicons name="film" size={scale(20)} color="#6366f1" />
                  <Typo size={15} fontWeight="600" color={colors.white}>
                    CineCue
                  </Typo>
                </View>
                <Typo size={12} color={colors.neutral400} style={styles.projectDesc}>
                  Movie discovery app with TMDB API integration
                </Typo>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.projectCard}
                onPress={() => openLink("https://github.com/nitin864/Real_time_tracking_system")}
              >
                <View style={styles.projectHeader}>
                  <Ionicons name="navigate" size={scale(20)} color="#10b981" />
                  <Typo size={15} fontWeight="600" color={colors.white}>
                    Real-Time Tracker
                  </Typo>
                </View>
                <Typo size={12} color={colors.neutral400} style={styles.projectDesc}>
                  Live GPS tracking with Socket.IO & Leaflet.js
                </Typo>
              </TouchableOpacity>
            </View>

            {/* Social Links */}
            <View style={styles.socialContainer}>
              <Typo size={14} fontWeight="600" color={colors.white} style={styles.sectionTitle}>
                Connect
              </Typo>
              <View style={styles.socialGrid}>
                {socialLinks.map((social, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.socialButton, { backgroundColor: social.color }]}
                    onPress={() => openLink(social.url)}
                    activeOpacity={0.8}
                  >
                    <Ionicons 
                      name={social.icon as any} 
                      size={scale(20)} 
                      color={colors.white} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Typo size={18} fontWeight="700" color={colors.primary}>
                  17
                </Typo>
                <Typo size={11} color={colors.neutral400}>
                  Repositories
                </Typo>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Typo size={18} fontWeight="700" color={colors.primary}>
                  8
                </Typo>
                <Typo size={11} color={colors.neutral400}>
                  Followers
                </Typo>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Typo size={18} fontWeight="700" color={colors.primary}>
                  3+
                </Typo>
                <Typo size={11} color={colors.neutral400}>
                  Years Exp
                </Typo>
              </View>
            </View>

            {/* Email Button */}
            <TouchableOpacity 
              style={styles.emailButton}
              onPress={() => openLink("mailto:rajnitin793@gmail.com")}
            >
              <LinearGradient
                colors={["#6366f1", "#8b5cf6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.emailGradient}
              >
                <Ionicons name="mail" size={scale(18)} color={colors.white} />
                <Typo size={13} fontWeight="600" color={colors.white}>
                  rajnitin793@gmail.com
                </Typo>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Typo
            size={12}
            fontWeight="700"
            color={colors.neutral400}
            style={styles.footerTitle}
          >
            {`Developed with 💙 in INDIA by Nitin!`}
          </Typo>
          <Typo size={11} color={colors.neutral500} style={styles.footerVersion}>
            Version 1.0.0
          </Typo>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  container: {
    paddingHorizontal: spacingX._20,
  },

  profileCard: {
    marginTop: verticalScale(15),
    marginBottom: spacingY._20,
    borderRadius: radius._20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  profileGradient: {
    paddingVertical: spacingY._20,
    alignItems: "center",
  },

  avatarContainer: {
    position: "relative",
    marginBottom: spacingY._10,
  },

  avatar: {
    height: verticalScale(100),
    width: verticalScale(100),
    borderRadius: verticalScale(50),
    backgroundColor: colors.neutral300,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },

  avatarBorder: {
    position: "absolute",
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: verticalScale(56),
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },

  nameContainer: {
    alignItems: "center",
    gap: verticalScale(3),
  },

  accountOptions: {
    marginTop: spacingY._10,
    gap: spacingY._10,
  },

  listItem: {
    overflow: "hidden",
    borderRadius: radius._15,
  },

  optionButton: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._15,
    borderWidth: 1,
    borderColor: colors.neutral700,
  },

  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
    padding: spacingX._12,
  },

  listIcon: {
    height: verticalScale(38),
    width: verticalScale(38),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._12,
  },

  devSectionToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.neutral800,
    padding: spacingX._12,
    borderRadius: radius._15,
    marginTop: spacingY._15,
    borderWidth: 1,
    borderColor: colors.neutral700,
  },

  devToggleContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },

  devSection: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._20,
    padding: spacingX._15,
    marginTop: spacingY._12,
    gap: spacingY._15,
    borderWidth: 1,
    borderColor: colors.neutral700,
  },

  devHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
  },

  devAvatarContainer: {
    width: scale(55),
    height: scale(55),
    borderRadius: scale(28),
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.primary,
  },

  devAvatar: {
    width: "100%",
    height: "100%",
  },

  devInfo: {
    flex: 1,
    gap: verticalScale(2),
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
    marginTop: verticalScale(4),
  },

  bioContainer: {
    gap: spacingY._5,
    paddingTop: spacingY._7,
    borderTopWidth: 1,
    borderTopColor: colors.neutral700,
  },

  bioText: {
    lineHeight: verticalScale(18),
  },

  bioQuote: {
    fontStyle: "italic",
    lineHeight: verticalScale(16),
  },

  techStackContainer: {
    paddingTop: spacingY._7,
    borderTopWidth: 1,
    borderTopColor: colors.neutral700,
  },

  sectionTitle: {
    marginBottom: spacingY._10,
  },

  techGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacingX._7,
  },

  techBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
    backgroundColor: colors.neutral700,
    paddingHorizontal: spacingX._10,
    paddingVertical: spacingY._7,
    borderRadius: radius._10,
  },

  projectsContainer: {
    paddingTop: spacingY._7,
    borderTopWidth: 1,
    borderTopColor: colors.neutral700,
    gap: spacingY._7,
  },

  projectCard: {
    backgroundColor: colors.neutral700,
    padding: spacingX._12,
    borderRadius: radius._12,
    gap: spacingY._5,
  },

  projectHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5
  },

  projectDesc: {
    lineHeight: verticalScale(15),
  },

  socialContainer: {
    paddingTop: spacingY._5,
    borderTopWidth: 1,
    borderTopColor: colors.neutral700,
  },

  socialGrid: {
    flexDirection: "row",
    gap: spacingX._10,
  },

  socialButton: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.neutral700,
    padding: spacingY._12,
    borderRadius: radius._12,
  },

  statItem: {
    alignItems: "center",
    gap: verticalScale(3),
  },

  statDivider: {
    width: 1,
    backgroundColor: colors.neutral600,
  },

  emailButton: {
    borderRadius: radius._12,
    overflow: "hidden",
  },

  emailGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacingX._7,
    paddingVertical: spacingY._12,
  },

  footer: {
    marginTop: spacingY._25,
    alignItems: "center",
    gap: spacingY._5,
    marginBottom: verticalScale(4),
  },

  footerTitle: {
    textAlign: "center",
  },

  footerVersion: {
    textAlign: "center",
  },
});