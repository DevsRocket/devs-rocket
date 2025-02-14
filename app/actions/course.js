"use server";

import { getLoggedInUser } from "@/lib/loggedin-user";
import { Course } from "@/model/course-model";
import { create } from "@/queries/courses";
import dbConnect from "@/service/mongo";
import { del } from "@vercel/blob";
import mongoose from "mongoose";
import { revalidateTag } from "next/cache";

export async function createCourse(data) {
  try {
    const loggedinUser = await getLoggedInUser();
    data["instructor"] = loggedinUser?.id;
    const course = await create(data);

    revalidateTag("courses");

    return course;
  } catch (err) {
    throw new Error(err);
  }
}

export async function updateCourse(courseId, dataToUpdate) {
  try {
    await dbConnect();

    await Course.findByIdAndUpdate(courseId, dataToUpdate);
  } catch (e) {
    throw new Error(e);
  }
}

export async function changeCoursePublishState(courseId) {
  try {
    await dbConnect();

    const course = await Course.findById(courseId);
    const res = await Course.findByIdAndUpdate(
      courseId,
      { active: !course.active },
      { lean: true }
    );

    revalidateTag("courses");

    return res.active;
  } catch (err) {
    throw new Error(err);
  }
}

export async function deleteCourse(courseId) {
  try {
    await dbConnect();

    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    if (course?.thumbnail) {
      try {
        await del(course.thumbnail);
        console.log("Deleted old thumbnail:", course.thumbnail);

        revalidateTag("courses");
      } catch (error) {
        console.error("Error deleting old thumbnail:", error);
      }
    }

    await Course.findByIdAndDelete(courseId);
  } catch (err) {
    throw new Error(err);
  }
}

export async function updateQuizSetForCourse(courseId, dataToUpdate) {
  console.log(courseId, dataToUpdate);
  const data = {};
  data["quizSet"] = new mongoose.Types.ObjectId(dataToUpdate.quizSetId);
  console.log(data);
  try {
    await dbConnect();

    await Course.findByIdAndUpdate(courseId, data);
  } catch (error) {
    throw new Error(error);
  }
}
