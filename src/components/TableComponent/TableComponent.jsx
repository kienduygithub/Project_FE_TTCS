import React, { useEffect, useState } from "react";
import './TableComponent.scss'
import { Dropdown, Space, Table } from "antd";
import { DownOutlined, SmileOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons'
import LoadingComponent from "../LoadingComponent/LoadingComponet";
import { Excel } from 'antd-table-saveas-excel'
const TableComponent = (props) => {
  const {selectionType = 'checkbox', data : dataSource = [], columns = [], isLoading= false, handleDeleteMany, nameSearch = '', isShowButtonExcel=true} = props
  const [rowSelectedKey, setRowSelectedKey] = useState([]);
  const [search, setSearch] = useState('Admin');
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKey(selectedRowKeys)
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };
  const handleDeleteAll = () => {
    console.log('rowSelectedKey: ', rowSelectedKey)
    handleDeleteMany(rowSelectedKey);
  }
    // EXCEL
  const newColumnExport = columns.filter((col) => col.title !== 'Action');
  const exportExcel = () => {
    const excel = new Excel();
    excel
      .addSheet("test")
      .addColumns(newColumnExport)
      .addDataSource(dataSource, {
        str2Percent: true
      })
      .saveAs("Excel.xlsx");
  };
  useEffect(() => {
    const handleSearch = setTimeout(() => {
      setSearch(nameSearch);
    }, 500);
    return () => {
      clearTimeout(handleSearch)
    }
  }, [nameSearch])
  let dataFilter = Array.isArray(dataSource) && dataSource?.filter(
    (data) => {
      if (search === '') {
        return data;
      }else if (data?.name?.toLowerCase().includes(search.toLowerCase())) {
        return data;
      }
    }
  )
  return(
    <div style={{boxSizing: 'border-box'}}>
      <LoadingComponent isLoading={isLoading}>
        {rowSelectedKey.length > 1 && 
          <div style={{
            background: '#1d1ddd', 
            color: '#fff',
            fontWeight: 'bold',
            padding: '10px',
            cursor: 'pointer'
          }} onClick={() => handleDeleteAll()}>
            Xóa tất cả
          </div>
        }
        {
          isShowButtonExcel &&
          <button className="button-excel-table" onClick={() => exportExcel()}>
            <VerticalAlignBottomOutlined />
            <span>Export</span>
          </button>
        }
        <Table
          id='table-xls'
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={
            dataFilter
          }
          {...props}
        />
      </LoadingComponent>
    </div>
  )
}

export default TableComponent