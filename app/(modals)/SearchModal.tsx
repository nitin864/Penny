import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import TransctionList from "@/components/TransctionList";
import { firestore } from "@/config/firebase";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { TransactionType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Animated, ScrollView, StyleSheet, Text, View } from "react-native";

const SearchModal = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionType[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const router = useRouter();

  // Fetch all user transactions on mount
  useEffect(() => {
    fetchAllTransactions();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // Filter transactions when search changes
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredTransactions([]);
      return;
    }

    const searchLower = search.toLowerCase().trim();
    const filtered = transactions.filter((transaction) => {
      // Search in category
      const categoryMatch = transaction.category?.toLowerCase().includes(searchLower);
      
      // Search in amount (convert to string)
      const amountMatch = transaction.amount?.toString().includes(searchLower);
      
      // Search in type
      const typeMatch = transaction.type?.toLowerCase().includes(searchLower);
      
      // Search in description (if it exists)
      const descriptionMatch = transaction.description?.toLowerCase().includes(searchLower);

      return categoryMatch || amountMatch || typeMatch || descriptionMatch;
    });

    setFilteredTransactions(filtered);
  }, [search, transactions]);

  const fetchAllTransactions = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const transactionsQuery = query(
        collection(firestore, "transactions"),
        where("uid", "==", user.uid),
        orderBy("date", "desc")
      );

      const querySnapshot = await getDocs(transactionsQuery);
      const fetchedTransactions: TransactionType[] = [];

      querySnapshot.forEach((doc) => {
        const transaction = doc.data() as TransactionType;
        transaction.id = doc.id;
        fetchedTransactions.push(transaction);
      });

      setTransactions(fetchedTransactions);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  const getTotalAmount = () => {
    return filteredTransactions.reduce((sum, t) => {
      return t.type === "income" ? sum + t.amount : sum - t.amount;
    }, 0);
  };

  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Header
          title={"Search Transactions"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._15 }}
        />

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Search Bar Card */}
          <View style={styles.searchCard}>
            <View style={styles.searchIconContainer}>
              <Ionicons name="search" size={scale(20)} color={colors.neutral400} />
            </View>
            <View style={styles.inputWrapper}>
              <Input
                placeholder="Search by category, amount, type..."
                value={search}
                onChangeText={(value) => setSearch(value)}
                autoFocus={true}
                style={styles.searchInput}
              />
            </View>
            {search.trim() !== "" && (
              <View style={styles.clearButton}>
                <Ionicons 
                  name="close-circle" 
                  size={scale(22)} 
                  color={colors.neutral400}
                  onPress={() => setSearch("")}
                />
              </View>
            )}
          </View>

          {/* Search Stats Card */}
          {search.trim() !== "" && filteredTransactions.length > 0 && (
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="receipt-outline" size={scale(18)} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.statLabel}>Results</Text>
                  <Text style={styles.statValue}>{filteredTransactions.length}</Text>
                </View>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Ionicons 
                    name="cash-outline" 
                    size={scale(18)} 
                    color={getTotalAmount() >= 0 ? colors.primary : colors.rose} 
                  />
                </View>
                <View>
                  <Text style={styles.statLabel}>Net Amount</Text>
                  <Text style={[
                    styles.statValue,
                    { color: getTotalAmount() >= 0 ? colors.primary : colors.rose }
                  ]}>
                    ₹{Math.abs(getTotalAmount()).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Loading State */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading transactions...</Text>
            </View>
          )}

          {/* Search Results */}
          {!loading && search.trim() !== "" && (
            <View style={styles.resultsContainer}>
              {filteredTransactions.length > 0 ? (
                <TransctionList
                  title=""
                  emptyListMessage=""
                  data={filteredTransactions}
                />
              ) : (
                <View style={styles.noResultsCard}>
                  <View style={styles.noResultsIconContainer}>
                    <Ionicons name="search-outline" size={scale(48)} color={colors.neutral500} />
                  </View>
                  <Text style={styles.noResultsTitle}>No Results Found</Text>
                  <Text style={styles.noResultsText}>
                    We couldn't find any transactions matching "{search}"
                  </Text>
                  <Text style={styles.noResultsSuggestion}>
                    Try adjusting your search terms
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Empty State - Before Search */}
          {!loading && search.trim() === "" && (
            <View style={styles.emptyStateCard}>
              <View style={styles.emptyStateIconContainer}>
                <Ionicons name="search-circle-outline" size={scale(64)} color={colors.neutral600} />
              </View>
              <Text style={styles.emptyStateTitle}>
                Search Your Transactions
              </Text>
              <Text style={styles.emptyStateText}>
                Find transactions quickly by typing keywords
              </Text>
              
              <View style={styles.searchTips}>
                <Text style={styles.searchTipsTitle}>Search by:</Text>
                <View style={styles.tipsList}>
                  <View style={styles.tipItem}>
                    <Ionicons name="pricetag-outline" size={scale(14)} color={colors.primary} />
                    <Text style={styles.tipText}>Category</Text>
                  </View>
                  <View style={styles.tipItem}>
                    <Ionicons name="cash-outline" size={scale(14)} color={colors.primary} />
                    <Text style={styles.tipText}>Amount</Text>
                  </View>
                  <View style={styles.tipItem}>
                    <Ionicons name="swap-horizontal-outline" size={scale(14)} color={colors.primary} />
                    <Text style={styles.tipText}>Type</Text>
                  </View>
                  <View style={styles.tipItem}>
                    <Ionicons name="document-text-outline" size={scale(14)} color={colors.primary} />
                    <Text style={styles.tipText}>Description</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </ModalWrapper>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(25),
  },

  scrollContent: {
    paddingTop: spacingY._5,
    paddingBottom: spacingY._30,
    gap: spacingY._15,
  },

  searchCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    borderRadius: radius._15,
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._12,
    backgroundColor: colors.neutral800,
    borderWidth: 1,
    borderColor: colors.neutral700,
  },

  searchIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  inputWrapper: {
    flex: 1,
  },

  searchInput: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
  },

  clearButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: spacingX._5,
  },

  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: radius._15,
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._15,
    backgroundColor: colors.neutral800,
    borderWidth: 1,
    borderColor: colors.neutral700,
  },

  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    flex: 1,
  },

  statIconContainer: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: colors.neutral700,
    justifyContent: "center",
    alignItems: "center",
  },

  statLabel: {
    fontSize: verticalScale(11),
    color: colors.neutral400,
    fontWeight: "500",
  },

  statValue: {
    fontSize: verticalScale(16),
    color: colors.white,
    fontWeight: "700",
    marginTop: verticalScale(2),
  },

  statDivider: {
    width: 1,
    height: scale(40),
    backgroundColor: colors.neutral700,
  },

  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacingY._40,
    gap: spacingY._15,
    borderRadius: radius._15,
    backgroundColor: colors.neutral800,
    borderWidth: 1,
    borderColor: colors.neutral700,
  },

  loadingText: {
    fontSize: verticalScale(14),
    color: colors.neutral350,
    fontWeight: "500",
  },

  resultsContainer: {
    flex: 1,
  },

  noResultsCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacingY._40,
    paddingHorizontal: spacingX._20,
    gap: spacingY._10,
    borderRadius: radius._15,
    backgroundColor: colors.neutral800,
    borderWidth: 1,
    borderColor: colors.neutral700,
  },

  noResultsIconContainer: {
    marginBottom: spacingY._10,
  },

  noResultsTitle: {
    fontSize: verticalScale(18),
    color: colors.white,
    fontWeight: "700",
    textAlign: "center",
  },

  noResultsText: {
    fontSize: verticalScale(14),
    color: colors.neutral350,
    textAlign: "center",
    lineHeight: verticalScale(20),
  },

  noResultsSuggestion: {
    fontSize: verticalScale(12),
    color: colors.neutral400,
    textAlign: "center",
    marginTop: spacingY._5,
  },

  emptyStateCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacingY._40,
    paddingHorizontal: spacingX._20,
    gap: spacingY._15,
    borderRadius: radius._20,
    backgroundColor: colors.neutral800,
    borderWidth: 1,
    borderColor: colors.neutral700,
  },

  emptyStateIconContainer: {
    marginBottom: spacingY._5,
  },

  emptyStateTitle: {
    fontSize: verticalScale(20),
    color: colors.white,
    fontWeight: "700",
    textAlign: "center",
  },

  emptyStateText: {
    fontSize: verticalScale(14),
    color: colors.neutral350,
    textAlign: "center",
    lineHeight: verticalScale(20),
  },

  searchTips: {
    width: "100%",
    marginTop: spacingY._20,
    paddingTop: spacingY._20,
    borderTopWidth: 1,
    borderTopColor: colors.neutral700,
  },

  searchTipsTitle: {
    fontSize: verticalScale(13),
    color: colors.neutral300,
    fontWeight: "600",
    marginBottom: spacingY._10,
  },

  tipsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacingX._10,
  },

  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._7,
    backgroundColor: colors.neutral700,
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._7,
    borderRadius: radius._12,
  },

  tipText: {
    fontSize: verticalScale(12),
    color: colors.neutral300,
    fontWeight: "500",
  },
});