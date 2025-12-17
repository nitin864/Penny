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
  const oldWalletRef = doc(firestore, "wallets", oldTx.walletId);
  const newWalletRef = doc(firestore, "wallets", newWalletId);

  const oldSnap = await getDoc(oldWalletRef);
  const newSnap = await getDoc(newWalletRef);

  if (!oldSnap.exists() || !newSnap.exists()) {
    return { success: false, msg: "Wallet not found" };
  }

  const oldWallet = oldSnap.data() as WalletType;
  const newWallet = newSnap.data() as WalletType;

  /* ----------- REVERT OLD TRANSACTION ----------- */

  const revertDelta =
    oldTx.type === "income" ? -oldTx.amount : oldTx.amount;

  const revertField =
    oldTx.type === "income" ? "totalIncome" : "totalExpenses";

  const revertedAmount = Number(oldWallet.amount) + revertDelta;

  const revertedTotal =
    Number(oldWallet[revertField]) - oldTx.amount;

  /* ----------- APPLY NEW TRANSACTION ----------- */

  if (newType === "expense" && newWallet.amount! < newAmount) {
    return { success: false, msg: "Insufficient balance" };
  }

  const applyDelta = newType === "income" ? newAmount : -newAmount;
  const applyField =
    newType === "income" ? "totalIncome" : "totalExpenses";

  /* ----------- UPDATE OLD WALLET ----------- */

  await updateDoc(oldWalletRef, {
    amount: revertedAmount,
    [revertField]: revertedTotal,
  });

  /* ----------- UPDATE NEW WALLET ----------- */

  await updateDoc(newWalletRef, {
    amount: Number(newWallet.amount) + applyDelta,
    [applyField]: Number(newWallet[applyField]) + newAmount,
  });

  return { success: true };
};


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

    const delta =
      tx.type === "income" ? -tx.amount : tx.amount;

    const field =
      tx.type === "income" ? "totalIncome" : "totalExpenses";

    const updatedAmount = Number(wallet.amount) + delta;
    const updatedFieldValue = Number(wallet[field]) - tx.amount;

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
      [field]: updatedFieldValue,
    });

    /* -------- DELETE TRANSACTION -------- */

    await deleteDoc(transactionRef);

    return { success: true };
  } catch (err: any) {
    console.log("Delete transaction error:", err);
    return { success: false, msg: err.message };
  }
};

 
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
      collection(db, 'transactions'),
      where("date", ">=", Timestamp.fromDate(sevenDaysAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid)
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

      const dayDate = weeklyData.find((day) => day.date == transactionDate);

      if (dayDate) {
        if (transaction.type == "income") {
          dayDate.income += transaction.amount;
        } else if (transaction.type == "expense") {
          dayDate.expense += transaction.amount;
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
