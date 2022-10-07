import { TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import React,{useEffect, useState} from 'react'
import { createAPIEndpoint, ENDPOINTS } from '../../api'
import Table from '../../layout/Table';
import DeleteOutlineTwoToneIcon from '@material-ui/icons/DeleteOutlineTwoTone';
export default function OrderList() {
    const [orderList,setOrderList]=useState([]);
    useEffect(()=>{
        createAPIEndpoint(ENDPOINTS.ORDER).fetchAll()
        .then(res=>{
            setOrderList(res.data)
        })
        .catch(err=>console.log(err))
    },[])
  return (
    <Table>
       <TableHead>
          <TableRow>
            <TableCell>Order No.</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Payed with</TableCell>
            <TableCell>Grand total</TableCell>
            <TableCell></TableCell>
          </TableRow>
       </TableHead>
       <TableBody>
        {
            orderList.map(item=>(
                <TableRow key={item.orderMasterId}>
                    <TableCell>
                        {item.orderNumber}
                    </TableCell>
                    <TableCell>
                        {item.customer.customerName}
                    </TableCell>
                    <TableCell>
                        {item.pMethod}
                    </TableCell>
                    <TableCell>
                        {item.gTotal}
                    </TableCell>
                    <TableCell>
                        <DeleteOutlineTwoToneIcon
                        color="secondary"
                        />
                    </TableCell>
                </TableRow>
            ))
        }
       </TableBody>
    </Table>
  )
}
