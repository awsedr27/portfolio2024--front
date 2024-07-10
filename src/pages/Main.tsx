import { useEffect } from "react";
import axiosInstance from "../network/Api";

const Main = () => {

    useEffect(() => {
        async function main() {
            try{
                const response = await axiosInstance.post('/api/user/test',null,{withCredentials:true});
            }catch(error){
                alert("alert")
            }
        }
        main();
    }, []);

    return (
        <div>메인페이지</div>
    );
};

export default Main;