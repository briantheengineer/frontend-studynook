import { api} from "./api.js";

export async function checkHealth() {
    const response = await api.get("/health") 
    return response.data;
        
 }