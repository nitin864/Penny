import Buttton from '@/components/Buttton'
import Typo from '@/components/Typo'
import { auth } from '@/config/firebase'
import { colors } from '@/constants/theme'
import { signOut } from 'firebase/auth'
import React from 'react'
import { FlatList, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'

// Example homepage for a finance app. Drop this file into your screens folder and adjust imports
// Uses your existing Buttton and Typo components and your colors theme. Small, self-contained UI.

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
      <StatusBar barStyle="dark-content" backgroundColor={colors.neutral100} />
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
            <Text>— chart goes here —</Text>
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
          <Typo>Home</Typo>
          <Typo>Accounts</Typo>
          <Typo>Cards</Typo>
          <Typo>Profile</Typo>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral100 },
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: { fontSize: 18, fontWeight: '700' },
  sub: { fontSize: 13, color: colors.neutral500, marginTop: 2 },
  logoutWrap: { padding: 8 },
  logoutText: { color: colors.primary, fontWeight: '600' },

  balanceCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: { color: colors.neutral500, fontSize: 13 },
  balanceAmount: { fontSize: 22, fontWeight: '800', marginTop: 6 },
  cardBtn: { backgroundColor: colors.primary, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  cardBtnText: { color: colors.white, fontWeight: '700' },

  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  actionBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  actionLabel: { fontWeight: '600' },

  chartCard: { backgroundColor: colors.white, borderRadius: 12, padding: 12, marginBottom: 16 },
  chartPlaceholder: { height: 80, justifyContent: 'center', alignItems: 'center' },

  listCard: { flex: 1, backgroundColor: colors.white, borderRadius: 12, padding: 12 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontWeight: '700' },
  viewAll: { color: colors.primary, fontSize: 13 },

  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  txLeft: { flexDirection: 'row', alignItems: 'center' },
  txAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.neutral100, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txAvatarText: { fontWeight: '700' },
  txTitle: { fontWeight: '600' },
  txDate: { color: colors.neutral500, fontSize: 12 },
  txAmount: { fontWeight: '700' },
  negative: { color: colors.rose },
  positive: { color: colors.green },
  sep: { height: 1, backgroundColor: colors.neutral300, marginVertical: 4 },

  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, marginTop: 12 },
})
