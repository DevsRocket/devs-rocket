"use server";

import { User } from "@/model/user-model";
import { validatePassword } from "@/queries/users";
import dbConnect from "@/service/mongo";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updateUserInfo(email, updatedData) {
  try {
    await dbConnect();

    const filter = { email: email };
    await User.findOneAndUpdate(filter, updatedData);
    revalidatePath("/account");
  } catch (error) {
    throw new Error(error);
  }
}

export async function changePassword(email, oldPassword, newPassword) {
  const isMatch = await validatePassword(email, oldPassword);

  if (!isMatch) {
    throw new Error("Please enter a valid current password");
  }

  const filter = { email: email };

  const hashedPassword = await bcrypt.hash(newPassword, 5);

  const dataToUpdate = {
    password: hashedPassword,
  };

  try {
    await dbConnect();

    await User.findOneAndUpdate(filter, dataToUpdate);
    revalidatePath("/account");
  } catch (error) {
    throw new Error(error);
  }
}
