import Buttton from '@/components/Buttton'
import Typo from '@/components/Typo'
import { auth } from '@/config/firebase'
import { colors, radius } from '@/constants/theme'
import { signOut } from 'firebase/auth'
import React from 'react'
import { FlatList, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'

// Dark, refined finance home screen using neutral900 background and translucent cards
// Drop into screens folder. Adjust icons/animations as needed.

const transactions = [
  { id: '1', title: 'Grocery Store', amount: -129.45, date: 'Nov 28' },
  { id: '2', title: 'Salary', amount: 2500.0, date: 'Nov 27' },
  { id: '3', title: 'Electricity Bill', amount: -60.12, date: 'Nov 26' },
  { id: '4', title: 'Coffee', amount: -3.5, date: 'Nov 25' },
]

const QuickAction = ({ label, onPress }: { label: string; onPress?: () => void }) => (
  <Buttton onPress={onPress} style={styles.actionBtn}>
    <Typo style={styles.actionLabel}>{label}</Typo>
  </Buttton>
)

const BalanceCard = ({ balance }: { balance: number }) => (
  <View style={styles.balanceCard}>
    <View>
      <Typo style={styles.cardTitle}>Total Balance</Typo>
      <Typo style={styles.balanceAmount}>₹{balance.toFixed(2)}</Typo>
      <Typo style={styles.smallNote}>Available balance across accounts</Typo>
    </View>
    <Buttton onPress={() => {}} style={styles.cardBtn}>
      <Typo style={styles.cardBtnText}>Add</Typo>
    </Buttton>
  </View>
)

const TransactionItem = ({ item }: { item: any }) => (
  <View style={styles.txRow}>
    <View style={styles.txLeft}>
      <View style={styles.txAvatar}>
        <Text style={styles.txAvatarText}>{item.title.charAt(0)}</Text>
      </View>
      <View>
        <Typo style={styles.txTitle}>{item.title}</Typo>
        <Typo style={styles.txDate}>{item.date}</Typo>
      </View>
    </View>
    <Typo style={[styles.txAmount, item.amount < 0 ? styles.negative : styles.positive]}> 
      {item.amount < 0 ? '-' : '+'}₹{Math.abs(item.amount).toFixed(2)}
    </Typo>
  </View>
)

export default function Home() {
  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.warn('Logout error', err)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral900} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Typo style={styles.greeting}>Hello, Nitin</Typo>
            <Typo style={styles.sub}>Welcome back 👋</Typo>
          </View>
          <Pressable onPress={handleLogout} style={styles.logoutWrap}>
            <Typo style={styles.logoutText}>Logout</Typo>
          </Pressable>
        </View>

        {/* Balance card */}
        <BalanceCard balance={12845.75} />

        {/* Quick actions */}
        <View style={styles.actionsRow}>
          <QuickAction label="Send" />
          <QuickAction label="Receive" />
          <QuickAction label="Top-up" />
          <QuickAction label="Scan" />
        </View>

        {/* Mini chart placeholder */}
        <View style={styles.chartCard}>
          <Typo style={styles.sectionTitle}>Spending (7d)</Typo>
          <View style={styles.chartPlaceholder}>
            <Text style={{color: colors.textLighter}}>— chart goes here —</Text>
          </View>
        </View>

        {/* Recent transactions */}
        <View style={styles.listCard}>
          <View style={styles.listHeader}>
            <Typo style={styles.sectionTitle}>Recent Transactions</Typo>
            <Typo style={styles.viewAll}>View all</Typo>
          </View>

          <FlatList
            data={transactions}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => <TransactionItem item={item} />}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
          />
        </View>

        {/* Bottom navigation (simple) */}
        <View style={styles.bottomNav}>
          <Typo style={styles.navItem}>Home</Typo>
          <Typo style={styles.navItem}>Accounts</Typo>
          <Typo style={styles.navItem}>Cards</Typo>
          <Typo style={styles.navItem}>Profile</Typo>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral900 },
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: { fontSize: 20, fontWeight: '800', color: colors.white },
  sub: { fontSize: 13, color: colors.textLighter, marginTop: 4 },
  logoutWrap: { padding: 8 },
  logoutText: { color: colors.primary, fontWeight: '600' },

  balanceCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radius._12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  cardTitle: { color: colors.textLighter, fontSize: 13 },
  balanceAmount: { fontSize: 26, fontWeight: '900', marginTop: 6, color: colors.white },
  smallNote: { color: colors.textLighter, marginTop: 6, fontSize: 12 },
  cardBtn: { backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 14, borderRadius: radius._10 },
  cardBtnText: { color: colors.black, fontWeight: '800' },

  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  actionBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: radius._10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.02)'
  },
  actionLabel: { fontWeight: '700', color: colors.textLighter },

  chartCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: radius._12, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.02)' },
  chartPlaceholder: { height: 90, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },

  listCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: radius._12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.02)' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontWeight: '800', color: colors.white },
  viewAll: { color: colors.primaryLight, fontSize: 13 },

  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  txLeft: { flexDirection: 'row', alignItems: 'center' },
  txAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.02)', justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.02)' },
  txAvatarText: { fontWeight: '800', color: colors.textLighter },
  txTitle: { fontWeight: '700', color: colors.white },
  txDate: { color: colors.textLighter, fontSize: 12 },
  txAmount: { fontWeight: '800' },
  negative: { color: colors.rose },
  positive: { color: colors.green },
  sep: { height: 1, backgroundColor: 'rgba(255,255,255,0.02)', marginVertical: 6 },

  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, marginTop: 8, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.02)' },
  navItem: { color: colors.textLighter, fontWeight: '700' }
})
