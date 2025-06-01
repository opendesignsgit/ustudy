// "user server"
// import { Payload } from "payload"
// import { Config } from "payload"
// import { cookies } from "next/headers"
// import { Student } from "@/payload-types"


// interface LoginParams { 
//   email: string;
//   password: string;
// }

// export interface LoginResponse { 
//   success: boolean;
//   error?: string; 
// }

// export type LoginResult = {
//   exp?: number;
//   token?: string;
//   user?: Student;
// }



// export async function login({ email, password }: LoginParams): Promise<LoginResponse> {
//   const payload = await getPayload({ config });
//   try {
//     const result: Result = await payload.login({
//       collection: "students",
//       data: {
//         email, password
//       }
//     });
//     if (result.token) {
//       const cookieStore = await cookies();
//       cookieStore.set("paylod-token", result.token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         path: "/",
//       })
//       return { success: true }
//     } else {
//       return { success: false, error: "Invalid email or password" }
//     }
//   }
//   catch (error) {
//     console.error("Login error", error);
//     return { success: false, error: "An error occured" }
//   }
// }