import React, { useState, useEffect } from 'react';
import { Box, Stack, VStack } from '@chakra-ui/react'
import { ListofPreparedDate } from './approval/List-of-Prepared-Date'
import { ListofOrders } from './approval/List-of-Orders'
import apiClient from '../../services/apiClient'

const fetchOrderListApi = async () => {
  const res = await apiClient.get(`Ordering/GetAllListForScheduleApproval`)
  return res.data
}

const fetchOrdersByFarmApi = async (farmName) => {
  const res = await apiClient.get(`Ordering/GetAllOrdersForScheduleApproval?farm=${farmName}`)
  return res.data
}

const ApprovalPage = () => {

  const [orderId, setOrderId] = useState('')
  const [farmName, setFarmName] = useState("")
  const [status, setStatus] = useState("")

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

  const fetchOrdersByFarm = () => {
    fetchOrdersByFarmApi(farmName).then(res => {
      setFarmOrders(res)
    })
  }

  useEffect(() => {
    fetchOrdersByFarm()

    return () => {
      setFarmOrders([])
    }
  }, [farmName])

  return (
    <>
      <VStack w='full' h='auto' spacing={5}>
        <ListofPreparedDate orders={orders} setFarmName={setFarmName} farmName={farmName} setOrderId={setOrderId} />
        <ListofOrders farmOrders={farmOrders} orderId={orderId} setOrderId={setOrderId} />
      </VStack>
    </>
  )
}

export default ApprovalPage;
