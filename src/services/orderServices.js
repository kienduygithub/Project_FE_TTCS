import { axiosJWT } from "./userServices";
// CREATE ORDER
export const createOrder = async (data, access_token) => {
    const userId = data?.userId;
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create-order/${userId}`, data, {
        headers: {
            token: `Beare ${access_token}`
        }
    });
    return res.data;
}
// READ DETAIL
export const getOrderDetailsById = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-order-details/${id}`, {
        headers: {
            token: `Beare ${access_token}`
        }
    });
    return res.data;
}
// CANCEL ORDER
export const cancelOrder = async (id, access_token, orderItems, userId) => {
    const data = { orderItems, orderId: id };
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/cancel-order/${userId}`, { data }, {
        headers: {
            token: `Beare ${access_token}`
        }
    })
    return res.data;
}
// GET ALL ORDER
export const getAllOrder = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order`, {
        headers: {
            token: `Beare ${access_token}`
        }
    })
    return res.data
}
// GET ALL ORDER BY USER ID
export const getOrderByUserId = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order/${id}`, {
        headers: {
            token: `Beare ${access_token}`
        }
    })
    return res.data;
}

// UPDATE ORDER
export const updateOrder = async (data) => {
    const { id, access_token, ...rests } = data;
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/update-order/${id}`, { ...rests }, {
        headers: {
            token: `Beare ${access_token}`
        }
    })
    return res.data;
}
// DELETE ORDER ADMIN
export const deleteOrderAdmin = async (data) => {
    const { id, access_token } = data;
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/delete-order/${id}`, {
        headers: {
            token: `Beare ${access_token}`
        }
    })
    return res.data;
}
// GET LATEST ORDERS
export const getLatestOrders = async () => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-order-latest`);
    return res.data;
}

// GET QUATER
export const getQuarter = async (year) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order-item/get-quarter?year=${year}`);
    return res.data;
}
export const getBySelectedQuarter = async ({ quarter, year }) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order-item/get-by-selected-quarter?quarter=${quarter}&year=${year}`);
    return res.data;
}