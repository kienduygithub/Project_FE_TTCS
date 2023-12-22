import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orderItems: [],
    orderItemsSelected: [],
    shippingAddress: {
    },
    paymentMethod: '',
    shippingMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
    userId: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
    isSuccessOrder: false
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {

        addOrderProduct: (state, action) => {
            const { orderItem } = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.productId === orderItem?.productId)
            if (itemOrder) {
                if (itemOrder?.amount <= orderItem?.countInStock) {
                    itemOrder.amount += orderItem?.amount;
                    state.isSuccessOrder = true;
                    // state.isErrorOrder = false;
                }
            } else {
                state?.orderItems?.push(orderItem)
            }
        },
        removeOrderProduct: (state, action) => {
            const { idProduct } = action.payload;
            const itemOrder = state?.orderItems?.filter((item) => item?.productId !== idProduct);
            const itemOrderSelected = state?.orderItemsSelected?.filter((item) => item?.productId !== idProduct);
            state.orderItems = itemOrder;
            state.orderItemsSelected = itemOrderSelected
        },
        removeAllOrderProduct: (state, action) => {
            const { listChecked } = action.payload;
            const itemOrders = state?.orderItems?.filter((item) => !listChecked.includes(item.productId));
            const itemOrdersSelected = state?.orderItemsSelected?.filter((item) => !listChecked.includes(item.productId));
            state.orderItems = itemOrders;
            state.orderItemsSelected = itemOrdersSelected;
        },
        decreaseAmount: (state, action) => {
            const { idProduct } = action.payload;
            const itemOrder = state?.orderItems?.find((item) => item?.productId === idProduct);
            const itemOrderSelected = state?.orderItemsSelected?.find((item) => item?.productId === idProduct);
            if (itemOrder) {
                itemOrder.amount--;
            }
            if (itemOrderSelected) {
                itemOrderSelected.amount--;
            }
        },
        increaseAmount: (state, action) => {
            const { idProduct } = action.payload;
            const itemOrder = state?.orderItems?.find((item) => item?.productId === idProduct);
            const itemOrderSelected = state?.orderItemsSelected?.find((item) => item?.productId === idProduct);
            if (itemOrder) {
                itemOrder.amount++;
            }
            if (itemOrderSelected) {
                itemOrderSelected.amount++;
            }
        },
        selectedOrder: (state, action) => {
            const { listChecked } = action.payload;
            const orderSelected = [];
            state.orderItems.forEach((order) => {
                if (listChecked.includes(order.productId)) {
                    orderSelected.push(order)
                }
            })
            state.orderItemsSelected = orderSelected;
        },
        resetOrder: (state) => {
            // state.isErrorOrder = false;
            state.isSuccessOrder = false;
        },
        resetCart: (state) => {
            state.orderItems = [];
            state.orderItemsSelected = []
        }
    },
})

// Action creators are generated for each case reducer function
export const { addOrderProduct, removeOrderProduct, removeAllOrderProduct, decreaseAmount, increaseAmount, selectedOrder, resetOrder, resetCart } = orderSlice.actions

export default orderSlice.reducer