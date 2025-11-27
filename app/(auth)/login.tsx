import BackButton from '@/components/BackButton'
import Buttton from '@/components/Buttton'
import Input from '@/components/Input'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import * as Icons from 'phosphor-react-native'
import React, { useRef, useState } from 'react'
import { Alert, Pressable, StyleSheet, View } from 'react-native'


const Login = () => {

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading , setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit =  async () => {
    if(!emailRef.current || !passwordRef.current){
        Alert.alert('Login ', "Please Fill Login details")
        return;
    }
    console.log('email: ' , emailRef.current);
    console.log('password: ', passwordRef.current);
    console.log("everthing works fine!!")
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
         {/* back button */}
        <BackButton iconSize={22}/>

        <View style={{gap: 5, marginTop:spacingY._20}}>
            <Typo size={30} fontWeight='800'>
                Hey,
            </Typo>
            <Typo size={30} fontWeight='800'>
                Welcome Back
            </Typo>
        </View>

        {/* form */}
        <View style={styles.form}>
            <Typo size={16} color={colors.textLighter}>Login Now to track your Expenses..</Typo>
            <Input 
             placeholder='Enter your email' 
             icon={<Icons.At size={verticalScale(26)}  
             color='white' 
             weight='fill'/> }
             onChangeText={(value) => (emailRef.current =value)}
            />
            <Input 
             placeholder='Enter your password'
             secureTextEntry 
             icon={<Icons.Lock size={verticalScale(26)}  
             color='white' 
             weight='fill'/> }
             onChangeText={(value) => (passwordRef.current =value)}
            />

            <Typo size={14} color={colors.text} style={{alignSelf: "flex-end"}}>Forgot Password?</Typo>
            <Buttton loading={isLoading} onPress={handleSubmit}>
                <Typo fontWeight='700' color={colors.black} size={21}>
                  Login
                </Typo>
            </Buttton>
           
        </View>
      {/* footer */}

    <View style={styles.footer}>
        <Typo>Don't have an account?</Typo>
        <Pressable onPress={()=> router.push("/(auth)/register")}>
            <Typo size={15} color={colors.primary} fontWeight='700'>
                Sign up
            </Typo>
        </Pressable>
    </View>
      </View>
    </ScreenWrapper>
  )
}

export default Login

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
