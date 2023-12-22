import { Upload } from "antd";
import styled from "styled-components";

export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card{
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
    & .ant-upload-list-list-item-info{
        display: none
    }
    & .ant-upload.ant-upload-select{
        
    }
    & .ant-upload-list-item.ant-upload-list-item-error{
        display:: none !important;
    }
    & .ant-upload-icon{
        display: none
    }
    & .ant-upload-list-item-name{
        display: none
    }
    & .ant-upload-list-item-actions{
        display: none
    }
    & img{
        margin-top: 10px
    }
`