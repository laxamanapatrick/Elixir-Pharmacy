import React, { useState, useEffect } from 'react'
import { VStack } from '@chakra-ui/react'
import { ActualItemQuantity } from './moveorder/Actual-Item-Quantity'
import { ListofApprovedDate } from './moveorder/List-of-Approved-Date'
import { ListofOrders } from './moveorder/List-of-Orders'
import { PreparedItems } from './moveorder/Prepared-Items'
import { usePagination } from '@ajna/pagination'
import apiClient from '../../services/apiClient'

const fetchMoveOrderApi = async (pageNumber) => {
  const res = await apiClient.get(`Ordering/GetAllListForMoveOrderPagination?pageSize=1&pageNumber=${pageNumber}`)
  return res.data
}

const fetchApprovedMoveOrdersApi = async (farmName) => {
  const res = await apiClient.get(`Ordering/GetAllListOfApprovedPreparedForMoveOrder?farm=${farmName}`)
  return res.data
}

const fetchOrderListApi = async (orderId) => {
  const res = await apiClient.get(`Ordering/GetAllListOfOrdersForMoveOrder?id=${orderId}`)
  return res.data
}

const MoveOrderPage = () => {

  const [farmName, setFarmName] = useState('')

  const [moveData, setMoveData] = useState([])

  const [orderId, setOrderId] = useState('')
  const [orderListData, setOrderListData] = useState([])

  const [pageTotal, setPageTotal] = useState(undefined);
  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 1 },
  })

  //Pagination

  const fetchMoveOrder = () => {
    fetchMoveOrderApi(currentPage).then(res => {
      setFarmName(res?.orders[0].farm)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    if (currentPage) {
      fetchMoveOrder()
    }

    return () => {
      setFarmName('')
    }
  }, [currentPage])

  //Approved Move Orders

  const fetchApprovedMoveOrders = () => {
    fetchApprovedMoveOrdersApi(farmName).then(res => {
      setMoveData(res)
      setOrderId(res[0]?.id)
    })
  }

  useEffect(() => {
    if (farmName) {
      fetchApprovedMoveOrders()
    }

    return () => {
      setMoveData([])
    }
  }, [farmName])

  //List of Orders

  const fetchOrderList = () => {
    fetchOrderListApi(orderId).then(res => {
      setOrderListData(res)
    })
  }

  useEffect(() => {
    if (orderId) {
      fetchOrderList()
    }

    return () => {
      setOrderListData([])
    }
  }, [orderId])
  
  return (
    <>
      <VStack w='full' p={4} spacing={6}>
        <ListofApprovedDate
          farmName={farmName} moveData={moveData}
          setCurrentPage={setCurrentPage} currentPage={currentPage} pagesCount={pagesCount}
        />
        <ListofOrders orderListData={orderListData} />
        <ActualItemQuantity />
        <PreparedItems />
      </VStack>
    </>
  )
}

export default MoveOrderPage;
