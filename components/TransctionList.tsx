import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { TransactionItemProps, TransactionListType } from "@/types";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Typo from "./Typo";
 
import { FlashList } from "@shopify/flash-list";
import Loading from "./Loading";
import { expenseCategories } from "./data";

const TransctionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {

const handleClick = ()=> {
  //todo: open up  transction details...
}

  return (
    <View style={styles.container}>
       {
        title && (
          <Typo size={23} fontWeight={"500"}>
            {title}
          </Typo>
        )
       }

       <View style={styles.list}>
         <FlashList
      data={data}
      renderItem={({ item , index}) => (<TransctionItem  item={item} index={index} handleClick={handleClick}/> )}
       estimatedItemSize={60}
      />
       </View>
       {

        !loading && (!data || data.length === 0) && (
          <Typo size={15} color={colors.neutral400} style={{textAlign: 'center' , marginTop: spacingY._15}}>
            {emptyListMessage}
          </Typo>
        ) 
       }

       {
         
         loading && (
          <View style={{ top: verticalScale(100)}}>
           <Loading/>  
          </View>
         )

       }
    </View>
  );
};


const TransctionItem = ({
  item ,index , handleClick
}: TransactionItemProps)=>{
  
  let category = expenseCategories['dining'];
  const IconComponent = category.icon;


  return ( 
  <View>
    <TouchableOpacity style={styles.row}>
        <View style={[styles.icon , {backgroundColor: category.bgColor}]}>
          {IconComponent && (
            <IconComponent 
              size={verticalScale(25)}
              weight="fill"
              color={colors.white}
            />  
          )}
        </View>
        <View style={styles.categoryDes}>
          <Typo size={17} >{category.label}</Typo>
          <Typo size={12} color={colors.neutral400} textProps={{numberOfLines: 1}}>
             paid for doretoes
          </Typo>
        </View>

        <View style={styles.amountDate}>
          <Typo fontWeight={"500"} color={colors.primary}>
            ₹249
          </Typo>
        </View>
    </TouchableOpacity>
  </View>
  );
};

export default TransctionList;

const styles = StyleSheet.create({
  container: {
    gap: spacingY._17,
    // flex: 1,
    // backgroundColor: "red",
  },

  list: {
    minHeight: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacingX._12,
    marginBottom: spacingY._12,

    // list with background
    backgroundColor: colors.neutral800,
    padding: spacingY._10,
    paddingHorizontal: spacingY._10,
    borderRadius: radius._17,
  },
  icon: {
    height: verticalScale(44),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._12,
    borderCurve: "continuous",
  },

  categoryDes: {
    flex: 1,
    gap: 2.5,
  },

  amountDate: {
    alignItems: "flex-end",
    gap: 3,
  },
});
