import Buttton from '@/components/Buttton'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { auth } from '@/config/firebase'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/context/authContext'
import { verticalScale } from '@/utils/styling'
import { signOut } from 'firebase/auth'
import * as Icons from 'phosphor-react-native'
import React from 'react'
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

const MOCK_TRANSACTIONS = [
  { id: '1', title: 'Grocery', subtitle: 'Walmart', amount: -125.5, color: '#ef4444', icon: <Icons.ShoppingCart size={20} weight="bold" /> },
  { id: '2', title: 'Salary', subtitle: 'Company Inc', amount: 2000, color: '#10b981', icon: <Icons.ArrowCircleUp size={20} weight="bold" /> },
  { id: '3', title: 'Movie', subtitle: 'PVR Cinemas', amount: -9.99, color: '#f97316', icon: <Icons.Popcorn size={20} weight="bold" /> },
]

const Home: React.FC = () => {
  const { user } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.warn('Logout error', err)
    }
  }

  const renderTransaction = ({ item }: { item: any }) => {
    const sign = item.amount < 0 ? '-' : '+'
    const amount = Math.abs(item.amount).toFixed(2)
    return (
      <View style={styles.txRow}>
        <View style={[styles.txIconWrap, { backgroundColor: item.color + '22' }]}>
          {item.icon}
        </View>
        <View style={styles.txMeta}>
          <Typo size={15} fontWeight="600" color={colors.neutral100}>
            {item.title}
          </Typo>
          <Typo size={13} color={colors.neutral400}>
            {item.subtitle}
          </Typo>
        </View>
        <Typo size={14} fontWeight="600" color={item.amount < 0 ? '#ef4444' : '#10b981'}>
          {sign} ₹{amount}
        </Typo>
      </View>
    )
  }

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.root}>
        {/* header */}
        <View style={styles.headerRow}>
          <View>
            <Typo size={16} color={colors.neutral400}>
              Welcome back,
            </Typo>
            <Typo size={20} fontWeight="700" color={colors.neutral100}>
              {user?.name ?? 'User'}
            </Typo>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Icons.Bell size={18} color={colors.neutral100} weight="bold" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.iconBtn, styles.logoutBtn]} onPress={handleLogout}>
              <Icons.Power size={18} color={colors.white} weight="bold" />
            </TouchableOpacity>
          </View>
        </View>

        {/* balance card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceTop}>
            <Typo size={14} color={colors.neutral400}>
              Current Balance
            </Typo>
            <Typo size={28} fontWeight="800" color={colors.neutral100}>
              ₹12,450.75
            </Typo>
          </View>

          {/* quick actions */}
          <View style={styles.quickRow}>
            <TouchableOpacity style={styles.quickAction}>
              <Icons.ArrowCircleUp size={20} color={colors.primary} weight="bold" />
              <Typo size={13} color={colors.neutral100}>Send</Typo>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAction}>
              <Icons.ArrowCircleDown size={20} color={colors.primary} weight="bold" />
              <Typo size={13} color={colors.neutral100}>Receive</Typo>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAction}>
              <Icons.PiggyBank size={20} color={colors.primary} weight="bold" />
              <Typo size={13} color={colors.neutral100}>Save</Typo>
            </TouchableOpacity>
          </View>
        </View>

        {/* chart placeholder */}
        <View style={styles.chartCard}>
          <Typo size={14} color={colors.neutral400}>Monthly Overview</Typo>
          <View style={styles.chartPlaceholder}>
            {/* replace this with a chart component (recharts / victory / react-native-svg) */}
            <Typo size={12} color={colors.neutral500}>[ Chart goes here ]</Typo>
          </View>
        </View>

        {/* recent transactions */}
        <View style={styles.transCard}>
          <View style={styles.transHeader}>
            <Typo size={16} fontWeight="700" color={colors.neutral100}>Recent Transactions</Typo>
            <TouchableOpacity>
              <Typo size={13} color={colors.primary}>See all</Typo>
            </TouchableOpacity>
          </View>

          <FlatList
            data={MOCK_TRANSACTIONS}
            keyExtractor={(i) => i.id}
            renderItem={renderTransaction}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        </View>

        {/* CTA: pass label as children to avoid prop type mismatch */}
        <View style={{ marginTop: spacingY._20 }}>
          <Buttton onPress={() => console.log('Go to add money')}>
            Add Money
          </Buttton>
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._10,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY._20,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._10,
  },

  iconBtn: {
    backgroundColor: colors.neutral800,
    padding: verticalScale(10),
    borderRadius: radius._12,
    marginLeft: 8,
  },

  logoutBtn: {
    backgroundColor: colors.primary,
  },

  balanceCard: {
    backgroundColor: colors.neutral900 ?? '#0b1220',
    borderRadius: radius._15,
    padding: spacingY._17,
    marginBottom: spacingY._20,
    shadowColor: colors.black,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
  },

  balanceTop: {
    marginBottom: spacingY._15,
  },

  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  quickAction: {
    width: '30%',
    backgroundColor: colors.neutral800,
    paddingVertical: verticalScale(12),
    borderRadius: radius._12,
    alignItems: 'center',
    gap: spacingY._5,
  },

  chartCard: {
    marginBottom: spacingY._20,
  },

  chartPlaceholder: {
    height: verticalScale(90),
    borderRadius: radius._12,
    backgroundColor: colors.neutral800,
    marginTop: spacingY._10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  transCard: {
    marginBottom: spacingY._20,
  },

  transHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY._12,
  },

  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral900 ?? '#02040a',
    padding: spacingY._12,
    borderRadius: radius._12,
  },

  txIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacingX._12,
  },

  txMeta: {
    flex: 1,
  },
})
