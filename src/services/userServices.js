import axios from "axios"
// export const axiosJWT = axios.create({
//     baseURL: 'http://localhost:3001/api'
// })
export const axiosJWT = axios.create();

export const loginUser = async (data) => {
    const res = await axiosJWT.post(`${ process.env.REACT_APP_API_URL }/sign-in`, data, {
        withCredentials: true
    });
    return res.data;
}
export const signupUser = async (data) => {
    const res = await axios.post(`${ process.env.REACT_APP_API_URL }/sign-up`, data);
    return res.data;
}
export const getDetailsUser = async (id, access_token) => {
    const res = await axiosJWT.get(`${ process.env.REACT_APP_API_URL }/user/get-details/${ id }`, {
        headers: {
            token: `Beare ${ access_token }`,
        }
    });
    return res.data;
}
export const refreshToken = async (refresh_token) => {
    const res = await axios.get(`http://localhost:3001/api/refresh-token`, {
        withCredentials: true,
        headers: {
            token: `Beare ${ refresh_token }`
        }
    });
    return res.data;
}
export const logoutUser = async () => {
    const res = await axiosJWT.get(`${ process.env.REACT_APP_API_URL }/log-out`, {
        withCredentials: true
    });
    localStorage.removeItem('access_token');
    return res.data;
}
export const updateUser = async (data) => {
    const { id, access_token, ...newData } = data;
    console.log('id: ', id);
    const res = await axiosJWT.post(`${ process.env.REACT_APP_API_URL }/user/update-user/${ id }`, newData, {
        headers: {
            token: `Beare ${ access_token }`
        }
    })
    return res.data;
}
export const getAllUsers = async (access_token) => {
    const res = await axiosJWT.get(`${ process.env.REACT_APP_API_URL }/user/getAll`, {
        headers: {
            token: `Beare ${ access_token }`
        }
    });
    return res.data;
}
export const deleteUser = async (id, access_token) => {
    const res = await axiosJWT.delete(`${ process.env.REACT_APP_API_URL }/user/delete-user/${ id }`, {
        headers: {
            token: `Beare ${ access_token }`
        }
    })
    return res.data;
}
export const deleteManyUser = async (data, access_token) => {
    const res = await axiosJWT.post(`${ process.env.REACT_APP_API_URL }/user/delete-many`, data, {
        headers: {
            token: `Beare ${ access_token }`
        }
    })
    return res.data;
}
// CHANGE PASSWORD
export const changePassword = async (id, password, newPassword, access_token) => {
    const res = await axiosJWT.post(`${ process.env.REACT_APP_API_URL }/user/change-password/${ id }`, { password, newPassword }, {
        headers: {
            token: `Beare ${ access_token }`
        }
    })
    return res.data;
}
// FORGOT PASSWORD
export const forgotPassword = async ({ email }) => {
    console.log('email', email)
    const res = await axios.post(`${ process.env.REACT_APP_API_URL }/forgot-password`, { email });
    return res.data;
}
// RESET PASSWORD
export const resetPassword = async (data) => {
    const { otp, password } = data;
    console.log('OTP', otp);
    console.log('password', password)
    const res = await axios.get(`http://localhost:3001/api/reset-password?password=${ password }&otp=${ otp }`);
    return res.data;
}
// VERIFY OTP
export const verifyOTP = async (otp) => {
    const res = await axios.post(`${ process.env.REACT_APP_API_URL }/verify-otp`, { otp });
    return res.data;
}