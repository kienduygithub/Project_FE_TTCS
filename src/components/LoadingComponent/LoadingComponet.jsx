import { Spin } from "antd";

const LoadingComponent = ({children, isLoading, delay = 200}) => {
    return(
        <Spin tip="Loading" size="small" spinning={isLoading} delay={delay}>
            {children}
        </Spin>
    )
}
export default LoadingComponent