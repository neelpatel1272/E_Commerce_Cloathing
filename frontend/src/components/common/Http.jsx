export const apiurl = 'http://127.0.0.1:8000/api/'

export const admintoken =()=>{
    const data= JSON.parse(localStorage.getItem('adminInfo'));
    return data.token;
}

export const usertoken =()=>{
    const data= JSON.parse(localStorage.getItem('userInfo'));
    return data.token;
}

