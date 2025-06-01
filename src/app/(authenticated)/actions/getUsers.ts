
"use server";
import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import type {Payload} from "payload";
import { Student } from "@/payload-types";
export async function getUser(): Promise<Student | null> {
    const headers = await getHeaders();
    const payload: Payload = await getPayload({ config: await configPromise });
    const { user } = await payload.auth({ headers });

    // Only return the user if it is a customer
    if (user && user.collection === "students") {
        return user as Student;
    }

    return null;
}

