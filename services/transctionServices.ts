import { firestore } from "@/config/firebase";
import { colors } from "@/constants/theme";
import { TransactionType, WalletType } from "@/types";
import { getLast7Days } from "@/utils/common";
import { scale } from "@/utils/styling";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageServices";

type ResponseType<T = undefined> = {
  success: boolean;
  msg?: string;
  data?: T;
};

/* =====================================================
   CREATE OR UPDATE TRANSACTION
===================================================== */

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType<TransactionType>> => {
  try {
    const { id, type, walletId, amount, image } = transactionData;

    if (!type || !walletId || !amount || amount <= 0) {
      return { success: false, msg: "Invalid transaction data" };
    }

    /* ---------------- EDIT TRANSACTION ---------------- */
    if (id) {
      const oldSnap = await getDoc(doc(firestore, "transactions", id));
      if (!oldSnap.exists()) {
        return { success: false, msg: "Transaction not found" };
      }

      const oldTransaction = oldSnap.data() as TransactionType;

      const changed =
        oldTransaction.amount !== amount ||
        oldTransaction.type !== type ||
        oldTransaction.walletId !== walletId;

      if (changed) {
        const res = await handleTransactionEdit(
          oldTransaction,
          Number(amount),
          type,
          walletId
        );
        if (!res.success) {
          return {
            success: false,
            msg: res.msg,
          };
        }
      }
    }

    /* ---------------- NEW TRANSACTION ---------------- */
    else {
      const res = await applyTransactionToWallet(
        walletId,
        Number(amount),
        type
      );
      if (!res.success) {
        return {
          success: false,
          msg: res.msg,
        };
      }
    }

    /* ---------------- IMAGE UPLOAD ---------------- */
    if (image) {
      const upload = await uploadFileToCloudinary(image, "transactions");
      if (!upload.success) {
        return { success: false, msg: upload.msg };
      }
      transactionData.image = upload.data;
    }

    /* ---------------- SAVE TRANSACTION ---------------- */
    const ref = id
      ? doc(firestore, "transactions", id)
      : doc(collection(firestore, "transactions"));

    await setDoc(ref, transactionData, { merge: true });

    return {
      success: true,
      data: { ...transactionData, id: ref.id } as TransactionType,
    };
  } catch (err: any) {
    console.log("Transaction error:", err);
    return { success: false, msg: err.message };
  }
};

/* =====================================================
   APPLY NEW TRANSACTION TO WALLET
===================================================== */

const applyTransactionToWallet = async (
  walletId: string,
  amount: number,
  type: string
): Promise<ResponseType> => {
  const walletRef = doc(firestore, "wallets", walletId);
  const snap = await getDoc(walletRef);

  if (!snap.exists()) {
    return { success: false, msg: "Wallet not found" };
  }

  const wallet = snap.data() as WalletType;

  if (type === "expense" && wallet.amount! < amount) {
    return { success: false, msg: "Insufficient balance" };
  }

  const delta = type === "income" ? amount : -amount;
  const field = type === "income" ? "totalIncome" : "totalExpenses";

  await updateDoc(walletRef, {
    amount: Number(wallet.amount) + delta,
    [field]: Number(wallet[field]) + amount,
  });

  return { success: true };
};

/* =====================================================
   HANDLE EDIT / WALLET CHANGE
===================================================== */

const handleTransactionEdit = async (
  oldTx: TransactionType,
  newAmount: number,
  newType: string,
  newWalletId: string
): Promise<ResponseType> => {
  const sameWallet = oldTx.walletId === newWalletId;

  /* ----------- SAME WALLET EDIT ----------- */
  if (sameWallet) {
    return await handleSameWalletEdit(oldTx, newAmount, newType);
  }

  /* ----------- DIFFERENT WALLET EDIT ----------- */
  return await handleDifferentWalletEdit(oldTx, newAmount, newType, newWalletId);
};

/* =====================================================
   HANDLE EDIT IN SAME WALLET
===================================================== */

const handleSameWalletEdit = async (
  oldTx: TransactionType,
  newAmount: number,
  newType: string
): Promise<ResponseType> => {
  const walletRef = doc(firestore, "wallets", oldTx.walletId);
  const walletSnap = await getDoc(walletRef);

  if (!walletSnap.exists()) {
    return { success: false, msg: "Wallet not found" };
  }

  const wallet = walletSnap.data() as WalletType;
  let updatedAmount = Number(wallet.amount);
  let updatedIncome = Number(wallet.totalIncome || 0);
  let updatedExpense = Number(wallet.totalExpenses || 0);

  /* ----------- CASE 1: SAME TYPE (income -> income OR expense -> expense) ----------- */
  if (oldTx.type === newType) {
    const amountDifference = newAmount - oldTx.amount;

    if (newType === "income") {
      updatedAmount += amountDifference;
      updatedIncome += amountDifference;
    } else {
      // Check if we have enough balance for additional expense
      if (amountDifference > 0 && updatedAmount < amountDifference) {
        return { success: false, msg: "Insufficient balance" };
      }
      updatedAmount -= amountDifference;
      updatedExpense += amountDifference;
    }
  }
  /* ----------- CASE 2: TYPE CHANGED (income -> expense OR expense -> income) ----------- */
  else {
    // Revert old transaction
    if (oldTx.type === "income") {
      updatedAmount -= oldTx.amount; // Remove the income
      updatedIncome -= oldTx.amount; // Reduce total income
    } else {
      updatedAmount += oldTx.amount; // Add back the expense
      updatedExpense -= oldTx.amount; // Reduce total expense
    }

    // Apply new transaction
    if (newType === "income") {
      updatedAmount += newAmount;
      updatedIncome += newAmount;
    } else {
      // Check if we have enough balance
      if (updatedAmount < newAmount) {
        return { success: false, msg: "Insufficient balance" };
      }
      updatedAmount -= newAmount;
      updatedExpense += newAmount;
    }
  }

  // Prevent negative balance
  if (updatedAmount < 0) {
    return { success: false, msg: "Insufficient balance" };
  }

  await updateDoc(walletRef, {
    amount: updatedAmount,
    totalIncome: updatedIncome,
    totalExpenses: updatedExpense,
  });

  return { success: true };
};

/* =====================================================
   HANDLE EDIT WITH DIFFERENT WALLET
===================================================== */

const handleDifferentWalletEdit = async (
  oldTx: TransactionType,
  newAmount: number,
  newType: string,
  newWalletId: string
): Promise<ResponseType> => {
  const oldWalletRef = doc(firestore, "wallets", oldTx.walletId);
  const newWalletRef = doc(firestore, "wallets", newWalletId);

  const [oldSnap, newSnap] = await Promise.all([
    getDoc(oldWalletRef),
    getDoc(newWalletRef),
  ]);

  if (!oldSnap.exists() || !newSnap.exists()) {
    return { success: false, msg: "Wallet not found" };
  }

  const oldWallet = oldSnap.data() as WalletType;
  const newWallet = newSnap.data() as WalletType;

  /* ----------- REVERT OLD TRANSACTION FROM OLD WALLET ----------- */
  let oldWalletAmount = Number(oldWallet.amount);
  let oldWalletIncome = Number(oldWallet.totalIncome || 0);
  let oldWalletExpense = Number(oldWallet.totalExpenses || 0);

  if (oldTx.type === "income") {
    oldWalletAmount -= oldTx.amount; // Remove the income
    oldWalletIncome -= oldTx.amount; // Reduce total income
  } else {
    oldWalletAmount += oldTx.amount; // Add back the expense
    oldWalletExpense -= oldTx.amount; // Reduce total expense
  }

  /* ----------- APPLY NEW TRANSACTION TO NEW WALLET ----------- */
  let newWalletAmount = Number(newWallet.amount);
  let newWalletIncome = Number(newWallet.totalIncome || 0);
  let newWalletExpense = Number(newWallet.totalExpenses || 0);

  if (newType === "income") {
    newWalletAmount += newAmount;
    newWalletIncome += newAmount;
  } else {
    // Check if new wallet has enough balance
    if (newWalletAmount < newAmount) {
      return { success: false, msg: "Insufficient balance in target wallet" };
    }
    newWalletAmount -= newAmount;
    newWalletExpense += newAmount;
  }

  // Prevent negative balances
  if (oldWalletAmount < 0 || newWalletAmount < 0) {
    return { success: false, msg: "Insufficient balance" };
  }

  /* ----------- UPDATE BOTH WALLETS ----------- */
  await Promise.all([
    updateDoc(oldWalletRef, {
      amount: oldWalletAmount,
      totalIncome: oldWalletIncome,
      totalExpenses: oldWalletExpense,
    }),
    updateDoc(newWalletRef, {
      amount: newWalletAmount,
      totalIncome: newWalletIncome,
      totalExpenses: newWalletExpense,
    }),
  ]);

  return { success: true };
};

/* =====================================================
   DELETE TRANSACTION
===================================================== */

export const deleteTransaction = async (
  transactionId: string,
  walletId: string
): Promise<ResponseType> => {
  try {
    const transactionRef = doc(firestore, "transactions", transactionId);
    const txSnap = await getDoc(transactionRef);

    if (!txSnap.exists()) {
      return { success: false, msg: "Transaction not found" };
    }

    const tx = txSnap.data() as TransactionType;

    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnap = await getDoc(walletRef);

    if (!walletSnap.exists()) {
      return { success: false, msg: "Wallet not found" };
    }

    const wallet = walletSnap.data() as WalletType;

    /* -------- REVERT TRANSACTION EFFECT -------- */
    let updatedAmount = Number(wallet.amount);
    let updatedIncome = Number(wallet.totalIncome || 0);
    let updatedExpense = Number(wallet.totalExpenses || 0);

    if (tx.type === "income") {
      updatedAmount -= tx.amount; // Remove the income
      updatedIncome -= tx.amount; // Reduce total income
    } else {
      updatedAmount += tx.amount; // Add back the expense
      updatedExpense -= tx.amount; // Reduce total expense
    }

    // Prevent negative balance
    if (updatedAmount < 0) {
      return {
        success: false,
        msg: "Cannot delete transaction. Wallet balance would go negative.",
      };
    }

    /* -------- UPDATE WALLET -------- */
    await updateDoc(walletRef, {
      amount: updatedAmount,
      totalIncome: updatedIncome,
      totalExpenses: updatedExpense,
    });

    /* -------- DELETE TRANSACTION -------- */
    await deleteDoc(transactionRef);

    return { success: true };
  } catch (err: any) {
    console.log("Delete transaction error:", err);
    return { success: false, msg: err.message };
  }
};

/* =====================================================
   FETCH WEEKLY STATS
===================================================== */

type WeeklyStatsData = {
  stats: Array<{
    value: number;
    label?: string;
    spacing?: number;
    labelWidth?: number;
    frontColor: string;
  }>;
  transactions: TransactionType[];
};

export const fetchWeeklyStats = async (
  uid: string
): Promise<ResponseType<WeeklyStatsData>> => {
  try {
    const db = firestore;
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const transactionsQuery = query(
      collection(db, "transactions"),
      where("uid", "==", uid),
      where("date", ">=", Timestamp.fromDate(sevenDaysAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(transactionsQuery);
    const weeklyData = getLast7Days();
    const transactions: TransactionType[] = [];

    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionDate = (transaction.date as Timestamp)
        .toDate()
        .toISOString()
        .split("T")[0];

      const dayData = weeklyData.find((day) => day.date === transactionDate);

      if (dayData) {
        if (transaction.type === "income") {
          dayData.income += transaction.amount;
        } else if (transaction.type === "expense") {
          dayData.expense += transaction.amount;
        }
      }
    });

    const stats = weeklyData.flatMap((day) => [
      {
        value: day.income,
        label: day.day,
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: colors.primary,
      },
      {
        value: day.expense,
        frontColor: colors.rose,
      },
    ]);

    return {
      success: true,
      data: {
        stats,
        transactions,
      },
    };
  } catch (err: any) {
    console.log("Error fetching weekly stats", err);
    return {
      success: false,
      msg: err.message,
    };
  }
};