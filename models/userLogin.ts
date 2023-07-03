import  pool  from "./databasePool.js";
import * as argon2 from "argon2";
import { z } from "zod";


const PROVIDER = {
    NATIVE: "native",
    FACEBOOK: "facebook",
    GOOGLE: "google",
};

export async function createFbProvider(name: string, email: string, provider: string) {

}

export async function createNativeProvider(userId: number, password: string) {
    const token = await argon2.hash(password);
    await pool.query(
        `
        INSERT INTO user_login (user_id, name , token)
        VALUES (?,?,?)
        `,
        [userId, PROVIDER.NATIVE, token]
    );
}

const ProviderSchema = z.object({
    id: z.number(),
    user_id: z.number(),
    name: z.enum(["native", "facebook", "google"]),
    token: z.string(),
  });
  
  export async function checkNativeProviderToken(
    userId: number,
    password: string
  ) {
    const results = await pool.query(
      `
      SELECT * FROM user_login
      WHERE user_id = ? AND name = "native"
    `,
      [userId]
    );
    const provider = z.array(ProviderSchema).parse(results[0]);
    const isValidPassword = await argon2.verify(provider[0].token, password);
    // console.log('isValidPassword-->',isValidPassword );
    return isValidPassword;  // 因為argon2 create token, 所以驗證時要丟進去token + password
  }