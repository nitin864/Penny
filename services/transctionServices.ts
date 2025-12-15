import { firestore } from "@/config/firebase";
import { TransactionType, WalletType } from "@/types";
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
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
