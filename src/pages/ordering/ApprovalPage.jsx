import React, { useState, useEffect } from 'react';
import { Box, Stack, VStack } from '@chakra-ui/react'
import { ListofPreparedDate } from './approval/List-of-Prepared-Date'
import { ListofOrders } from './approval/List-of-Orders'
import apiClient from '../../services/apiClient'

const fetchOrderListApi = async () => {
  const res = await apiClient.get(`Ordering/GetAllListForScheduleApproval`)
  return res.data
}

const fetchOrdersByOrderNoApi = async (orderNo) => {
  const res = await apiClient.get(`Ordering/GetAllOrdersForScheduleApproval?id=${orderNo}`)
  return res.data
}

const ApprovalPage = ({ fetchNotification }) => {

  const [orderNo, setOrderNo] = useState('')
  const [orders, setOrders] = useState([])
  const [farmOrders, setFarmOrders] = useState([])

  const fetchOrderList = () => {
    fetchOrderListApi().then(res => {
      setOrders(res)
    })
  }

  useEffect(() => {
    fetchOrderList()

    return () => {
      setOrders([])
    }
  }, [])

  const fetchOrdersByOrderNo = () => {
    fetchOrdersByOrderNoApi(orderNo).then(res => {
      setFarmOrders(res)
    })
  }

  useEffect(() => {
    if (orderNo) {
      fetchOrdersByOrderNo()
    }

    return () => {
      setFarmOrders([])
    }
  }, [orderNo])

  return (
    <>
      <VStack w='full' h='auto' spacing={5}>
        <ListofPreparedDate orders={orders} orderNo={orderNo} setOrderNo={setOrderNo}
        />
        <ListofOrders farmOrders={farmOrders} orderNo={orderNo} setOrderNo={setOrderNo} fetchOrderList={fetchOrderList}
          fetchOrdersByOrderNo={fetchOrdersByOrderNo} fetchNotification={fetchNotification} />
      </VStack>
    </>
  )
}

export default ApprovalPage;
