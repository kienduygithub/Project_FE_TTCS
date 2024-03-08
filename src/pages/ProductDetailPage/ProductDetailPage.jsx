import React from "react";
import ProductDetailComponent from "../../components/ProductDetailComponent/ProductDetailComponent";
import './ProductDetailPage.scss'
import { useNavigate, useParams } from "react-router";
import Footer from "../../components/FooterComponent/Footer";

const ProductDetailPage = () => {
    const params = useParams();
    const { id } = params;
    const navigate = useNavigate();
    const naviHome = () => {
        navigate('/')
    }
    return (
        <div>
            <div style={{padding: '0 120px'}} className="mt-2">
                <h4><span style={{cursor: 'pointer'}} onClick={naviHome}>Trang chủ</span> &gt; <span style={{userSelect: 'none'}}>Chi tiết sản phẩm</span></h4>
                <div className="product-detail-container">
                    <div className="product-detail">
                        <ProductDetailComponent idProduct={id}/>
                    </div>
                </div>
            </div>
            <Footer isHiddenFooter={false} />
        </div>    
    )
}

export default ProductDetailPage