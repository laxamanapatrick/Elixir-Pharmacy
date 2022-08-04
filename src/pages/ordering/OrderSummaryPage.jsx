import React, { useState, useEffect } from 'react'
import { ListofOrders } from './ordersummary/List-of-Orders'
import apiClient from '../../services/apiClient'
import moment from 'moment'
import { ListofOutOfStocks } from './ordersummary/List-of-OutOfStocks'
import { others, VStack } from '@chakra-ui/react'

const fetchOrderSummaryApi = async (dateFrom, dateTo) => {
  const res = await apiClient.get(`Ordering/OrderSummary?DateFrom=${dateFrom}&DateTo=${dateTo}`)
  return res.data
}

const fetchOutofStocksApi = async (itemCode, orderDate) => {
  const convertedDate = moment(orderDate).format("yyyy-MM-DD")
  const res = await apiClient.get(`Ordering/GetAllOutOfStockByItemCodeAndOrderDate?itemcode=${itemCode}&orderdate=${convertedDate}`)
  return res.data
}


const OrderSummaryPage = () => {

  const [dateFrom, setDateFrom] = useState(moment(new Date()).format('yyyy-MM-DD'))

  const [dateTo, setDateTo] = useState(moment(new Date()).format('yyyy-MM-DD'))

  const [orderSummary, setOrderSummary] = useState([])
  const [orderId, setOrderId] = useState('')

  const [itemCode, setItemCode] = useState('')
  const [orderDate, setOrderDate] = useState('')
  const [noStockData, setNoStockData] = useState([])

  const fetchOrderSUmmary = () => {
    fetchOrderSummaryApi(dateFrom, dateTo).then(res => {
      setOrderSummary(res)
    })
  }

  useEffect(() => {
    if (dateFrom && dateTo) {
      fetchOrderSUmmary()
    }

    return () => {
      setOrderSummary([])
    }
  }, [dateFrom, dateTo])

  const fetchOutofStocks = () => {
    fetchOutofStocksApi(itemCode, orderDate).then(res => {
      setNoStockData(res)
    })
  }

  useEffect(() => {
    if (itemCode && orderDate) {
      fetchOutofStocks()
    }

    return () => {
      setNoStockData([])
    }
  }, [itemCode, orderDate])

  return (
    <VStack w='full'>
      <ListofOrders
        setDateFrom={setDateFrom} setDateTo={setDateTo}
        dateFrom={dateFrom} dateTo={dateTo}
        orderSummary={orderSummary} orderId={orderId} setOrderId={setOrderId}
        setItemCode={setItemCode} setOrderDate={setOrderDate}
      />
      {
        noStockData?.map((stock, i) => {
          if (stock.quantityOrder > stock.stockOnHand) {
            return <ListofOutOfStocks key={i} noStockData={noStockData} />
          }
        })
      }
    </VStack>
  )
}

export default OrderSummaryPage;
