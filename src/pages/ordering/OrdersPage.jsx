import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListofOrders } from './orders/List-of-Orders';

const fetchGenusOrdersApi = async () => {
  const res = await axios.get(`https://genusfeed.rdfmis.ph/StoreAPI/api/orders.php?token=8AFASbzK5OH0E9OuZF5LlI9qZo8fqr1Z`)
  return res.data
}

const OrdersPage = () => {

  const [genusOrders, setGenusOrders] = useState([])

  const [search, setSearch] = useState('')

  const [isLoading, setIsLoading] = useState(true)

  const fetchGenusOrders = () => {
    fetchGenusOrdersApi().then(res => {
      setGenusOrders(res)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    fetchGenusOrders()

    return () => {
      setGenusOrders([])
    }
  }, [])

  return (
    <>
      <ListofOrders genusOrders={genusOrders} setGenusOrders={setGenusOrders} search={search} setSearch={setSearch} fetchingData={isLoading} />
    </>
  )
}

export default OrdersPage;
