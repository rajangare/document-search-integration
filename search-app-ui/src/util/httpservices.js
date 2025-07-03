import axios from "axios";




export const getAccessGroup = async () => {
  try {
    const response = await axios.get("http://localhost:8000/access_groups/");
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
 }
};