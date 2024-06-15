import { NewUser, insertUser } from "./db";

async function main(){
    const newUser: NewUser = {
        email: 'abc@example.com',
        name: 'abc',
        verfied: false
    };
    const res = await insertUser(newUser);
    console.log("insert user success", res);
    process.exit();
}

main(); 