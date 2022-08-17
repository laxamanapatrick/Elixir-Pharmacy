import React, { useState, useEffect } from 'react'
import { VStack } from '@chakra-ui/react'
import apiClient from '../../services/apiClient'
import { ListofOrders } from './preparationschedule/List-of-Orders'
import { usePagination } from '@ajna/pagination';

const fetchFarmOrdersApi = async (pageNumber) => {
  const res = await apiClient.get(`Ordering/GetAllListOfOrdersPagination?pageSize=1&pageNumber=${pageNumber}`)
  return res.data
}

const PreparationSchedulePage = ({ fetchNotification }) => {

  const [farmName, setFarmName] = useState("")
  const [orders, setOrders] = useState([])

  const [transactId, setTransactId] = useState(null)

  const [lengthIndicator, setLengthIndicator] = useState('')

  const [pageTotal, setPageTotal] = useState(undefined);
  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 1 },
  })

  const fetchFarmOrders = () => {
    fetchFarmOrdersApi(currentPage).then(res => {
      setFarmName(res.orders[0]?.farm)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchFarmOrders()

    return () => {
      setFarmName("")
    }
  }, [currentPage])

  const fetchOrdersApi = async () => {
    const res = await apiClient.get(`Ordering/GetAllListofOrders?farms=${farmName}`)
    return res.data
  }

  const fetchOrders = () => {
    fetchOrdersApi(farmName).then(res => {
      setOrders(res)
      setLengthIndicator(res.length)
    })
  }

  useEffect(() => {
    if (farmName) {
      fetchOrders()
    }

    return () => {
      setOrders([])
    }
  }, [farmName])

  return (
    <>
      <VStack w='full' h='auto'>
        <ListofOrders
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          pagesCount={pagesCount}
          setFarmName={setFarmName}
          farmName={farmName}
          orders={orders}
          pageTotal={pageTotal}
          setTransactId={setTransactId}
          transactId={transactId}
          fetchFarmOrders={fetchFarmOrders}
          fetchOrders={fetchOrders}
          lengthIndicator={lengthIndicator}
          fetchNotification={fetchNotification}
        />
      </VStack>
    </>
  )
}

export default PreparationSchedulePage;
