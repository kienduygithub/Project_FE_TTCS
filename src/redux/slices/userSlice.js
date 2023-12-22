import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    access_token: '',
    refresh_token: '',
    isAdmin: false,
    city: '',
    id: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            // console.log('>>> Action.payload: ', action)
            const { name = '', email = '', access_token, refresh_token, address = '', phone = '', avatar = '', id = '', isAdmin, city = '' } = action.payload;
            state.name = name ? name : state.name;
            state.email = email ? email : state.email;
            state.address = address ? address : state.address;
            state.phone = phone ? phone : state.phone;
            state.avatar = avatar ? avatar : state.avatar;
            state.id = id ? id : state.id;
            state.access_token = access_token ? access_token : state.access_token;
            state.refresh_token = refresh_token ? refresh_token : state.refresh_token;
            state.isAdmin = isAdmin ? isAdmin : state.isAdmin;
            state.city = city ? city : state.city;
        },
        resetUser: (state) => {
            state.name = '';
            state.email = '';
            state.address = '';
            state.phone = '';
            state.avatar = '';
            state.id = '';
            state.access_token = '';
            state.refresh_token = '';
            state.isAdmin = false;
            state.city = ''
        }
    },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlice.actions

export default userSlice.reducer