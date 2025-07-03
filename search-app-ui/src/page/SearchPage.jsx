import { Input } from "antd";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

const {Search } = Input;
function SearchPage (){
    const [value, setValue] = useState('');
    const navigate = useNavigate();

    const onClick=()=>{
        navigate('/result', { state: { searchText: value } })
    }
    return (
        <div style={{justifyContent: 'center', alignItems:'center', display:'flex'}}>
            <Search placeholder="Search" style={{width: '500px', marginTop:'20px' }} onSearch={onClick}
            onChange={(e)=>setValue(e.target.value)} 
            enterButton></Search>
        
        </div>
    )
}

export default SearchPage;