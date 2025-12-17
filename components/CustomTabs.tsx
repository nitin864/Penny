import { colors, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
 
import * as Icons from 'phosphor-react-native';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function   CustomTabs ({ state, descriptors, navigation }: BottomTabBarProps) {

  const tabbarIcons : any = {
    index: (isFocused: Boolean)=>(
      <Icons.House
      size={verticalScale(30)}
      weight={isFocused? "fill": "regular"}
      color={isFocused? colors.primary: colors.neutral400}
      />    
    ),
      statistics: (isFocused: Boolean)=>(
      <Icons.ChartBar
      size={verticalScale(30)}
      weight={isFocused? "fill": "regular"}
      color={isFocused? colors.primary: colors.neutral400}
      />    
    ),
      Wallet: (isFocused: Boolean)=>(
      <Icons.Wallet
      size={verticalScale(30)}
      weight={isFocused? "fill": "regular"}
      color={isFocused? colors.primary: colors.neutral400}
      />    
    ),
      Profile: (isFocused: Boolean)=>(
      <Icons.User
      size={verticalScale(30)}
      weight={isFocused? "fill": "regular"}
      color={isFocused? colors.primary: colors.neutral400}
      />    
    ), 
  }
 

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label: any =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            ///href={buildHref(route.name, route.params)}
            key={route.name}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItems}
          >
          {
            tabbarIcons[route.name] && tabbarIcons[route.name](isFocused)
          }
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.neutral800,
    width: "100%",
    justifyContent: "space-between",
    height: Platform.OS === "ios" ? verticalScale(73) : verticalScale(55),
    alignItems: "center",
    borderTopColor: colors.neutral700,
    borderTopWidth: 1,
    paddingHorizontal: spacingX._20,
  },

  tabBarItems: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacingY._10,  
  },
});
