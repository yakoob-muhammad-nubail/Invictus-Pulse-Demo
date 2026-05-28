import { createClient } from "@supabase/supabase-js";
import { create } from "domain";
import * as dotenv from "dotenv";
dotenv.config();

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
    const { data, error } = await supabase.from("contacts").insert([
        {
            //id: "TEST_ID_1",
            //assigned_user_id: "TEST_USER_ID_1",
            //organization_id: "TEST_ORG_ID_1",
            first_name: "Seed User 1",
            last_name: "Test Name 1",
            email: "seed1@test.com",
            phone: "5551112222",
            //source: "manual",
            //status: "lead", //default to lead
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ]);

    if (error) {
        console.error("Error inserting data:", error.message);
    } else {
        console.log("Data inserted successfully:", data);
    }

    console.log("Seed complete");
}

seed();