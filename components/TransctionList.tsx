import { FlashList } from "@shopify/flash-list";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { TransactionItemProps, TransactionListType } from "@/types";
import { verticalScale } from "@/utils/styling";

import Loading from "./Loading";
import Typo from "./Typo";
import { expenseCategories } from "./data";

const TransctionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
   
  
  
  const handleClick = (item: any) => {
    console.log("Transaction:", item);
  };

  return (
    <View style={styles.container}>
      {title && (
        <Typo size={25} fontWeight={"800"} style={styles.title}>
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
            handleClick={handleClick}
          />
        )}
        estimatedItemSize={82}
        showsVerticalScrollIndicator={false}
      />

      {!loading && (!data || data.length === 0) && (
        <Typo size={15} color={colors.neutral400} style={styles.emptyText}>
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

  console.log("item.des: ", item?.description);
  const category = expenseCategories["dining"];
  const IconComponent = category.icon;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 55).springify().damping(18)}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleClick(item)}
        style={styles.cardOuter}
      >
        <View style={styles.cardInner}>
          {/* Icon with glow */}
          <View style={styles.iconGlow}>
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: category.bgColor },
              ]}
            >
              {IconComponent && (
                <IconComponent
                  size={verticalScale(20)}
                  weight="fill"
                  color={colors.white}
                />
              )}
            </View>
          </View>

          {/* Middle */}
          <View style={styles.center}>
            <Typo size={16.8} fontWeight={"600"}>
              {category.label}
            </Typo>
            <Typo
              size={12}
              color={colors.neutral400}
              textProps={{ numberOfLines: 1 }}
            >
              Paid for Doritos
            </Typo>
          </View>

          {/* Right */}
          <View style={styles.right}>
            <View style={styles.amountBadge}>
              <Typo size={13.5} fontWeight={"700"} color={colors.rose}>
                − ₹249
              </Typo>
            </View>
            <Typo size={11.5} color={colors.neutral400}>
              12 Jan
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
    gap: spacingY._15,
  },

  title: {
    letterSpacing: 0.3,
  },

  emptyText: {
    textAlign: "center",
    marginTop: spacingY._20,
  },

  loader: {
    marginTop: verticalScale(120),
  },

  /* Outer card (depth layer) */
  cardOuter: {
    marginBottom: spacingY._15,
    borderRadius: radius._20,
    backgroundColor: "rgba(255,255,255,0.03)",
  },

  /* Inner card (actual surface) */
  cardInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._15,

    backgroundColor: colors.neutral900,
    paddingVertical: spacingY._15,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._20,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 7,
  },

  /* Icon glow wrapper */
  iconGlow: {
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },

  iconWrap: {
    height: verticalScale(46),
    aspectRatio: 1,
    borderRadius: radius._15,
    justifyContent: "center",
    alignItems: "center",
  },

  center: {
    flex: 1,
    gap: 4,
  },

  right: {
    alignItems: "flex-end",
    gap: 6,
  },

  amountBadge: {
    backgroundColor: "rgba(239,68,68,0.14)",
    paddingHorizontal: spacingX._12,
    paddingVertical: 4,
    borderRadius: radius._15,
  },
});
