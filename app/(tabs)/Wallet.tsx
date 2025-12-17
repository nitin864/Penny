import Loading from '@/components/Loading'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import WalletListItem from '@/components/WalletListItem'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/context/authContext'
import useFetchData from '@/hooks/useFetchData'
import { WalletType } from '@/types'
import { verticalScale } from '@/utils/styling'
import { useRouter } from 'expo-router'
import { orderBy, where } from 'firebase/firestore'
import * as Icons from 'phosphor-react-native'
import React from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'

const Wallet = () => {
  const router = useRouter()
  const { user } = useAuth()

  const {
    data: wallets = [],
    error,
    loading,
  } = useFetchData<WalletType>('wallets', [
    where('uid', '==', user?.uid),
    orderBy('created', 'desc'),
  ]);

  const getTotalBalance = () =>
    wallets.reduce((total, item) => {
      total = total + (item.amount || 0)
      return total
    }, 0)

  const totalBalance = getTotalBalance()

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        {/* Balance card */}
        <View style={styles.balanceWrapper}>
          <View style={styles.balanceCard}>
            <Typo size={14} color={colors.neutral400}>
              Total Balance
            </Typo>
            <Typo size={40} fontWeight="600" style={{ marginTop: spacingY._5 }}>
              ₹{totalBalance.toFixed(1)}
            </Typo>
            <Typo size={13} color={colors.neutral400} style={{ marginTop: spacingY._5 }}>
              Keep tracking your expenses smartly
            </Typo>
          </View>
        </View>

        {/* Wallets list */}
        <View style={styles.wallets}>
          <View style={styles.flexRow}>
            <View>
              <Typo size={18} fontWeight="600">
                My Wallets
              </Typo>
              <Typo size={13} color={colors.neutral400}>
                All your accounts in one place
              </Typo>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.addButton}
              onPress={() => router.push('/(modals)/WalletModel')}
            >
              <Icons.Plus weight="bold" color={colors.black} size={18} />
            </TouchableOpacity>
          </View>

          {loading && <Loading />}

          {!loading && wallets.length === 0 && (
            <View style={styles.emptyState}>
              <Icons.Wallet weight="duotone" size={40} color={colors.neutral500} />
              <Typo
                size={15}
                fontWeight="500"
                style={{ marginTop: spacingY._10 }}
              >
                No wallets yet
              </Typo>
              <Typo
                size={13}
                color={colors.neutral400}
                style={{ textAlign: 'center', marginTop: spacingY._5 }}
              >
                Create your first wallet to start tracking your balance.
              </Typo>
            </View>
          )}

          <FlatList
            data={wallets}
            keyExtractor={(item) => item.id || item.name}
            renderItem={({ item, index }) => (
              <WalletListItem item={item} index={index} router={router} />
            )}
            contentContainerStyle={styles.listStyle}
            ItemSeparatorComponent={() => <View style={{ height: spacingY._10 }} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Wallet

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  balanceWrapper: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._20,
    paddingBottom: spacingY._10,
    backgroundColor: colors.black,
  },

  balanceCard: {
    borderRadius: radius._30,
    paddingVertical: spacingY._20,
    paddingHorizontal: spacingX._20,
    backgroundColor: colors.neutral900,
    alignItems: 'flex-start',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },

  wallets: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._20,
  },

  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY._15,
  },

  addButton: {
    height: verticalScale(38),
    width: verticalScale(38),
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  listStyle: {
    paddingBottom: verticalScale(40),
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacingY._30,
    gap: spacingY._5,
  },
})
