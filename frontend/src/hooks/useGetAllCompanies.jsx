import { setCompanies } from '@/redux/companySlice'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllCompanies = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                console.log("📡 Fetching companies from:", `${COMPANY_API_END_POINT}/get`);
                
                const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
                    withCredentials: true,
                });

                console.log("✅ API response received:", res.data);

                if (res.data.success) {
                    console.log("🏢 Companies received:", res.data.companies);
                    
                    // Check the structure of the first company
                    if (res.data.companies.length > 0) {
                        console.log("🔍 First company sample:", res.data.companies[0]);
                    }

                    dispatch(setCompanies(res.data.companies));
                } else {
                    console.warn("❌ API responded with success: false", res.data.message);
                }

            } catch (error) {
                console.error("🚨 Error fetching companies:", error.response?.data || error.message);
            }
        };

        fetchCompanies();
    }, []);
};

export default useGetAllCompanies;
