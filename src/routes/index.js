import OrderPage from "../pages/OrderPage/OrderPage";
import ProductPage from "../pages/ProductPage/ProductPage";
import HomePage from "../pages/homePage/HomePage";
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage'
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import AdminPage from "../pages/Admin/AdminPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import MyOrderPage from "../pages/MyOrderPage/MyOrderPage";
import DetailsOrderPage from "../pages/DetailsOrderPage/DetailsOrderPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage/ResetPasswordPage";
export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true,
    },
    {
        path: '/product',
        page: ProductPage,
        isShowHeader: true
    },
    {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader: true,
    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false,
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false,
    },
    {
        path: '/forgot-password',
        page: ForgotPasswordPage,
        isShowHeader: false,
    },
    {
        path: '/reset-password',
        page: ResetPasswordPage,
        isShowHeader: false,
    },
    {
        path: '/product-details/:id',
        page: ProductDetailPage,
        isShowHeader: true,
    },
    {
        path: '/profile-user',
        page: ProfilePage,
        isShowHeader: false,
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true,
    },
    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true,
    },
    {
        path: '/orderSuccess',
        page: OrderSuccess,
        isShowHeader: true,
    },
    {
        path: '/my-order',
        page: MyOrderPage,
        isShowHeader: true,
    },
    {
        path: '/details-order/:id',
        page: DetailsOrderPage,
        isShowHeader: true,
    },
    {
        path: '*',
        page: NotFoundPage,
        isShowHeader: false,
    }
]

