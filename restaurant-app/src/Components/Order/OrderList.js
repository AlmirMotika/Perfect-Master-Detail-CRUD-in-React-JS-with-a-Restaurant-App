import { TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import React,{useEffect, useState} from 'react'
import { createAPIEndpoint, ENDPOINTS } from '../../api'
import Table from '../../layout/Table';
import DeleteOutlineTwoToneIcon from '@material-ui/icons/DeleteOutlineTwoTone';
export default function OrderList(props) {
    const {setOrderId,setOrderListVisibility,resetFormControls,setNotify}=props;
    const [orderList,setOrderList]=useState([]);
    
    useEffect(()=>{
        createAPIEndpoint(ENDPOINTS.ORDER).fetchAll()
        .then(res=>{
            setOrderList(res.data)
        })
        .catch(err=>console.log(err))
    },[])
    const showForUpdate=id=>{
        setOrderId(id);
        setOrderListVisibility(false);
    }
    const deleteOrder=id=>{
        if(window.confirm('Are you sure to delete this record')){
            createAPIEndpoint(ENDPOINTS.ORDER).delete(id)
            .then(res=>{
                setOrderListVisibility(false);
                setOrderId(0)
                resetFormControls();
                setNotify({isOpen:true,message:'Deleted successfully'});

            })
            .catch(err=>console.log(err))
        }
    }
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
                    <TableCell
                     onClick={e=>showForUpdate(item.orderMasterId)}
                    >
                        {item.orderNumber}
                    </TableCell>
                    <TableCell
                    onClick={e=>showForUpdate(item.orderMasterId)}>
                        {item.customer.customerName}
                    </TableCell>
                    <TableCell
                    onClick={e=>showForUpdate(item.orderMasterId)}>
                        {item.pMethod}
                    </TableCell>
                    <TableCell
                    onClick={e=>showForUpdate(item.orderMasterId)}>
                        {item.gTotal}
                    </TableCell>
                    <TableCell>
                        <DeleteOutlineTwoToneIcon
                        onClick={e=>deleteOrder(item.orderMasterId)}
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
