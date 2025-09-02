import { supabase } from "@supabase/supabase-js";

export const fetchProducts = async ()=>{
    const {data, error} = await supabase.from("products").select("*");
    if (error) throw error;
    console.log("products", datasdfsdf)
    return data;

    
}