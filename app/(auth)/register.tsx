import BackButton from "@/components/BackButton";
import Buttton from "@/components/Buttton";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import React, { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";

const Register = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const nameRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert("Sign up ", "Please Fill Sign up details");
      return;
    }
    setIsLoading(true);
    const res = await registerUser(
      emailRef.current,
      passwordRef.current,
      nameRef.current
    );
    setIsLoading(true);
    console.log("register result: ", res);
    if(!res.success){
     Alert.alert("Sign up", res.msg)
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* back button */}
        <BackButton iconSize={22} />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight="800">
            Let’s,
          </Typo>
          <Typo size={30} fontWeight="800">
            Build Stability
          </Typo>
        </View>

        {/* form */}
        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Let’s set up your account and track your spendings..
          </Typo>
          <Input
            placeholder="Enter your Name"
            icon={
              <Icons.User
                size={verticalScale(26)}
                color="white"
                weight="fill"
              />
            }
            onChangeText={(value) => (nameRef.current = value)}
          />
          <Input
            placeholder="Enter your email"
            icon={
              <Icons.At size={verticalScale(26)} color="white" weight="fill" />
            }
            onChangeText={(value) => (emailRef.current = value)}
          />
          <Input
            placeholder="Enter your password"
            secureTextEntry
            icon={
              <Icons.Lock
                size={verticalScale(26)}
                color="white"
                weight="fill"
              />
            }
            onChangeText={(value) => (passwordRef.current = value)}
          />

          <Buttton loading={isLoading} onPress={handleSubmit}>
            <Typo fontWeight="700" color={colors.black} size={21}>
              Sign up
            </Typo>
          </Buttton>
        </View>
        {/* footer */}

        <View style={styles.footer}>
          <Typo>Already have an account?</Typo>
          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Typo size={15} color={colors.primary} fontWeight="700">
              Login
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._30,
  },

  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },

  form: {
    gap: spacingY._20,
  },

  forgotPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },

  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  },
});
