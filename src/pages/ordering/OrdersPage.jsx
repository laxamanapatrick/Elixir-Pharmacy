import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListofOrders } from './orders/List-of-Orders';
import moment from 'moment';

const fetchGenusOrdersApi = async (fromDate, toDate) => {
  const fromDateFormatted = moment(fromDate).format("yyyy-MM-DD")
  const toDateFormatted = moment(toDate).format("yyyy-MM-DD")
  const res = await axios.get(`https://genusfeed.rdfmis.ph/StoreAPI/api/orders.php?token=8AFASbzK5OH0E9OuZF5LlI9qZo8fqr1Z&from=${fromDateFormatted}&to=${toDateFormatted}`)
  return res.data
}

const OrdersPage = () => {

  const [genusOrders, setGenusOrders] = useState([])

  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const [search, setSearch] = useState('')

  const [isLoading, setIsLoading] = useState(true)

  const fetchGenusOrders = () => {
    fetchGenusOrdersApi(fromDate, toDate).then(res => {
      setGenusOrders(res)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    if (fromDate && toDate) {
      fetchGenusOrders()
    }

    return () => {
      setGenusOrders([])
    }
  }, [fromDate, toDate])

  return (
    <>
      <ListofOrders
        genusOrders={genusOrders} setGenusOrders={setGenusOrders} search={search} setSearch={setSearch} fetchingData={isLoading}
        setFromDate={setFromDate} setToDate={setToDate}
        fromDate={fromDate} toDate={toDate}
      />
    </>
  )
}

export default OrdersPage;
