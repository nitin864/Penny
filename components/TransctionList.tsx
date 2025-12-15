import { FlashList } from "@shopify/flash-list";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { TransactionItemProps, TransactionListType, TransactionType } from "@/types";
import { verticalScale } from "@/utils/styling";

import { router } from "expo-router";
import { Timestamp } from "firebase/firestore";
import Loading from "./Loading";
import Typo from "./Typo";
import { expenseCategories, incomeCategory } from "./data";

const TransctionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
  const handleClick = (item: TransactionType) => {
    router.push({
      pathname: "/(modals)/TransctionModal",
      params: {
        id: item?.id,
        type: item?.type,
        amount: item?.amount?.toString(),
        category: item?.category,
        date: (item.date as Timestamp)?.toDate()?.toString(),
        description: item?.image,
        image: item?.image,
        uid: item?.uid,
        walletId: item?.walletId,
      }
    })
  };

  return (
    <View style={styles.container}>
      {title && (
        <Typo size={22} fontWeight={"800"} style={styles.title}>
          {title}
        </Typo>
      )}

      <FlashList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TransctionItem 
          item={item} 
          index={index} 
          handleClick={handleClick} />
        )}
        estimatedItemSize={68}
        showsVerticalScrollIndicator={false}
      />

      {!loading && (!data || data.length === 0) && (
        <Typo size={14} color={colors.neutral400} style={styles.emptyText}>
          {emptyListMessage}
        </Typo>
      )}

      {loading && (
        <View style={styles.loader}>
          <Loading />
        </View>
      )}
    </View>
  );
};

/* -------------------- Transaction Card -------------------- */

const TransctionItem = ({ item, index, handleClick }: TransactionItemProps) => {
  const category =
    item?.type === "income"
      ? incomeCategory
      : expenseCategories[item.category!];

  const IconComponent = category.icon;

  const date = item?.date
    ? (item.date as Timestamp).toDate().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    : "";

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 45).springify().damping(18)}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleClick(item)}
        style={styles.cardOuter}
      >
        <View style={styles.cardInner}>
          {/* Icon */}
          <View style={styles.iconGlow}>
            <View
              style={[styles.iconWrap, { backgroundColor: category.bgColor }]}
            >
              {IconComponent && (
                <IconComponent
                  size={verticalScale(17)}
                  weight="fill"
                  color={colors.white}
                />
              )}
            </View>
          </View>

          {/* Center */}
          <View style={styles.center}>
            <Typo size={15.5} fontWeight={"600"}>
              {category.label}
            </Typo>
            <Typo
              size={11.5}
              color={colors.neutral400}
              textProps={{ numberOfLines: 1 }}
            >
              {item?.description || "No description added"}
            </Typo>
          </View>

          {/* Right */}
          <View style={styles.right}>
            <View
              style={[
                styles.amountBadge,
                {
                  backgroundColor:
                    item?.type === "income"
                      ? "rgba(34,197,94,0.15)"
                      : "rgba(239,68,68,0.15)",
                },
              ]}
            >
              <Typo
                size={12.8}
                fontWeight={"700"}
                color={
                  item?.type === "income"
                    ? colors.primary
                    : colors.rose
                }
              >
                {`${item?.type === "income" ? "+ ₹" : "- ₹"}${item?.amount}`}
              </Typo>
            </View>

            <Typo size={10.8} color={colors.neutral400}>
              {date}
            </Typo>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TransctionList;

/* --------------------------- Styles --------------------------- */

const styles = StyleSheet.create({
  container: {
    gap: spacingY._12,
  },

  title: {
    letterSpacing: 0.3,
  },

  emptyText: {
    textAlign: "center",
    marginTop: spacingY._20,
  },

  loader: {
    marginTop: verticalScale(100),
  },

  cardOuter: {
    marginBottom: spacingY._12,
    borderRadius: radius._20,
    backgroundColor: "rgba(255,255,255,0.03)",
  },

  cardInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,

    backgroundColor: colors.neutral900,
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._12,
    borderRadius: radius._20,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 6,
  },

  iconGlow: {
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },

  iconWrap: {
    height: verticalScale(38),
    aspectRatio: 1,
    borderRadius: radius._12,
    justifyContent: "center",
    alignItems: "center",
  },

  center: {
    flex: 1,
    gap: 3,
  },

  right: {
    alignItems: "flex-end",
    gap: 5,
  },

  amountBadge: {
    paddingHorizontal: spacingX._10,
    paddingVertical: 3,
    borderRadius: radius._12,
  },
});
