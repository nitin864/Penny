import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import TransctionList from "@/components/TransctionList";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import {
  fetchMonthlyStats,
  fetchWeeklyStats,
  fetchYearlyStats,
} from "@/services/transctionServices";
import { scale, verticalScale } from "@/utils/styling";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import SegmentedControlTab from "react-native-segmented-control-tab";

const Statistics = () => {
  const [activeindex, setActiveIndex] = useState(0);
  const { user } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    if (activeindex == 0) {
      getWeeklyStats();
    }
    if (activeindex == 1) {
      getMonthlyStats();
    }
    if (activeindex == 2) {
      getyearlyStats();
    }
  }, [activeindex]);

  const getWeeklyStats = async () => {
    try {
      setChartLoading(true);

      const res = await fetchWeeklyStats(user?.uid as string);

      if (res.success && res.data) {
        setChartData(res.data.stats);
        setTransactions(res?.data?.transactions);
      } else {
        Alert.alert("Error", res.msg ?? "Failed to fetch weekly stats");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while fetching stats");
    } finally {
      setChartLoading(false);
    }
  };

  const getMonthlyStats = async () => {
    try {
      setChartLoading(true);

      const res = await fetchMonthlyStats(user?.uid as string);

      if (res.success && res.data) {
        setChartData(res.data.stats);
        setTransactions(res?.data?.transactions);
      } else {
        Alert.alert("Error", res.msg ?? "Failed to fetch weekly stats");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while fetching stats");
    } finally {
      setChartLoading(false);
    }
  };
  const getyearlyStats = async () => {
    
        try {
      setChartLoading(true);

      const res = await fetchYearlyStats(user?.uid as string);

      if (res.success && res.data) {
        setChartData(res.data.stats);
        setTransactions(res?.data?.transactions);
      } else {
        Alert.alert("Error", res.msg ?? "Failed to fetch weekly stats");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while fetching stats");
    } finally {
      setChartLoading(false);
    }

  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header title="Statistics" />
        </View>

        <ScrollView
          contentContainerStyle={{
            gap: spacingY._20,
            paddingTop: spacingY._5,
            paddingBottom: verticalScale(100),
          }}
          showsVerticalScrollIndicator={false}
        >
          <SegmentedControlTab
            tabsContainerStyle={styles.tabsContainerStyle}
            tabStyle={styles.tabStyle}
            firstTabStyle={styles.firstTabStyle}
            lastTabStyle={styles.lastTabStyle}
            tabTextStyle={styles.tabTextStyle}
            activeTabStyle={styles.activeTabStyle}
            activeTabTextStyle={styles.activeTabTextStyle}
            values={["Weekly", "Monthly", "Yearly"]}
            selectedIndex={activeindex}
            onTabPress={(index: number) => {
              setActiveIndex(index);
            }}
          />

          <View style={styles.chartContainer}>
            {chartData.length > 0 ? (
              <BarChart
                data={chartData}
                barWidth={scale(12)}
                spacing={[1, 2].includes(activeindex) ? scale(25) : scale(16)}
                roundedTop
                roundedBottom
                hideRules
                yAxisLabelPrefix="₹"
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisLabelWidth={
                  [1, 2].includes(activeindex) ? scale(38) : scale(35)
                }
                yAxisTextStyle={{ color: colors.neutral350 }}
                xAxisLabelTextStyle={{
                  color: colors.neutral350,
                  fontSize: verticalScale(12),
                }}
                noOfSections={4}
                minHeight={5}
              />
            ) : (
              <View style={styles.noChart} />
            )}

            {chartLoading && (
              <View style={styles.chartLoadingContainer}>
                <Loading color={colors.white}></Loading>
              </View>
            )}
          </View>

          <View>
            <TransctionList
              title="Transactions"
              emptyListMessage="No transactions found"
              data={transactions}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  chartContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },

  chartLoadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: radius._12,
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  header: {},

  noChart: {
    backgroundColor: "rgba(0,0,0,0.6)",
    height: verticalScale(210),
  },

  searchIcon: {
    backgroundColor: colors.neutral700,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    height: verticalScale(35),
    width: verticalScale(35),
    borderCurve: "continuous",
  },
  segmentStyle: {
    height: scale(37),
  },

  segmentFontStyle: {
    fontSize: verticalScale(13),
    fontWeight: "bold",
    color: colors.black,
  },

  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._5,
    gap: spacingY._10,
  },
  tabsContainerStyle: {
    backgroundColor: "#2B2B2B", // dark container
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 12,
  },

  tabStyle: {
    backgroundColor: "transparent",
    borderWidth: 0,
    borderRadius: 8,
  },

  firstTabStyle: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },

  lastTabStyle: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },

  tabTextStyle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#B0B0B0", // inactive text
  },

  activeTabStyle: {
    backgroundColor: "#EDEDED", // active light pill
  },

  activeTabTextStyle: {
    color: "#000000",
    fontWeight: "600",
  },
});
