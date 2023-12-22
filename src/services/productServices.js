import axios from "axios";
import { axiosJWT } from "./userServices"

export const getAllProduct = async (search, limit) => {
    let res = {};
    if (search?.length > 0 && limit) {
        res = await axiosJWT.get(
            `${process.env.REACT_APP_API_URL}/product/getAll?filter=name&filter=${search}&limit=${limit}`);
    } else if (search?.length <= 0 && limit > 0) {
        res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/product/getAll?limit=${limit}`);
    } else {
        res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/product/getAll`);
    }
    return res.data;
}

export const getAllProductType = async (type, page, limit) => {
    let res = {};
    if (type) {
        res = await axiosJWT.get(
            `${process.env.REACT_APP_API_URL}/product/getAll?filter=type&filter=${type}&limit=${limit}&page=${page}`);
        return res.data;
    }
}

export const createProduct = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/product/create-product`, data, {
        headers: {
            token: `Beare ${access_token}`
        }
    });
    return res.data;
}
export const getDetailsProduct = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/product/details-product/${id}`, {
        headers: {
            token: `Beare ${access_token}`
        }
    });
    return res.data;
}
export const updateProduct = async (id, access_token, data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/product/update-product/${id}`, data, {
        headers: {
            token: `Beare ${access_token}`
        }
    });
    console.log('res.data: ', res.data);
    return res.data;
}
export const deleteProduct = async (id, access_token) => {
    console.log('id: ', id);
    console.log('access_token: ', access_token)
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/product/delete-product/${id}`, {
        headers: {
            token: `Beare ${access_token}`
        }
    });
    return res.data;
}
export const deleteManyProducts = async (ids, access_token) => {
    console.log([ids])
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/product/delete-many`, ids, {
        headers: {
            token: `Beare ${access_token}`
        }
    })
    return res.data;
}
export const getAllTypeProducts = async () => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/product/get-all-type`);
    return res.data;
}

// GET PRODUCT LATEST
export const getProductLatest = async (limiLatest, sortLatest) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/product/get-latest?limit=${limiLatest}&sort=${sortLatest}&sort=createdAt`);
    return res.data;
}
// GET PRODUCT RANGE PRICE
export const getAllProductRangePrice = async (type, range, page, limit) => {
    let res = {};
    if (range) {
        const { min, max } = range;
        res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/product/get-by-range?filter=type&filter=${type}&min=${min}&max=${max}&limit=${limit}&page=${page}`);
        return res.data;
    }
}