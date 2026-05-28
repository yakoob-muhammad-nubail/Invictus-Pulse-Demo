import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seedContacts() {
    const clients = [
        {
            organization_id: "879820e0-11ed-4347-ab31-7d58d0c192b6",
            assigned_user_id: "5afc214d-527a-44ff-aab6-d3a979af42e7",
            first_name: "John",
            last_name: "Smith",
            email: "john.smith@example.com",
            phone: "555-111-0001",
            source: "email",
            status: "lead"
        },
        {
            organization_id: "879820e0-11ed-4347-ab31-7d58d0c192b6",
            assigned_user_id: "5afc214d-527a-44ff-aab6-d3a979af42e7",
            first_name: "Sarah",
            last_name: "Johnson",
            email: "sarah.johnson@example.com",
            phone: "555-111-0002",
            source: "sms",
            status: "active_client"
        },
        {
            organization_id: "879820e0-11ed-4347-ab31-7d58d0c192b6",
            assigned_user_id: "5afc214d-527a-44ff-aab6-d3a979af42e7",
            first_name: "David",
            last_name: "Brown",
            email: "david.brown@example.com",
            phone: "555-111-0003",
            source: "whatsapp",
            status: "inactive"
        },
        {
            organization_id: "879820e0-11ed-4347-ab31-7d58d0c192b6",
            assigned_user_id: "5afc214d-527a-44ff-aab6-d3a979af42e7",
            first_name: "Emily",
            last_name: "Davis",
            email: "emily.davis@example.com",
            phone: "555-111-0004",
            source: "call",
            status: "lead"
        },
        {
            organization_id: "879820e0-11ed-4347-ab31-7d58d0c192b6",
            assigned_user_id: "5afc214d-527a-44ff-aab6-d3a979af42e7",
            first_name: "Michael",
            last_name: "Wilson",
            email: "michael.wilson@example.com",
            phone: "555-111-0005",
            source: "email",
            status: "active_client"
        }
    ];

    const { data, error } = await supabase
        .from("contacts")
        .insert(clients)
        .select();

    if (error) {
        console.error("Error inserting contacts:", error);
        return;
    }

    console.log("Seeded contacts:", data);
}

seedContacts();