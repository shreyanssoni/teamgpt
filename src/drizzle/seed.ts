import { NewUser, insertUser } from "./db";

async function main(){
    const newUser: NewUser = {
        email: 'abc@example.com',
        name: 'abc',
        password: '123',
        verified: false
    };
    const res = await insertUser(newUser);
    console.log("insert user success", res);
    process.exit();
}

main(); 