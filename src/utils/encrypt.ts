/******************************************************************************
 * @file encrypt.ts
 * @description Contains utility functions for encryption and authentication.
 *****************************************************************************/
import crypto from "crypto";

/******************************************************************************
* @description: a random string of bytes.
 * @returns: A random string encoded in base64.
******************************************************************************/
export const random = () => crypto.randomBytes(128).toString('base64');
/******************************************************************************
 * @description: Generates an authentication hash based on a salt and an ID. 
 * @param salt: A salt value used for hashing.
 * @param id: An ID value to be hashed.
 * @returns: An authentication hash.
******************************************************************************/
const secret = process.env.SECRET as string;
export const authentication = (salt: string, id: string) => 
{
    return (crypto.createHmac('sha256', [salt, id].join('/')).update(secret).digest('hex'));
}