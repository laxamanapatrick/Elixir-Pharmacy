import { usePagination } from '@ajna/pagination'
import React, { useEffect, useState } from 'react'
import apiClient from '../../services/apiClient'
import { ApprovedMoveOrder } from './approvedmo/Approved-Move-Order'

const fetchApprovedMOApi = async (pageNumber, pageSize, search) => {
  const res = await apiClient.get(`Ordering/ApprovedMoveOrderPaginationOrig?pageSize=${pageSize}&pageNumber=${pageNumber}&search=${search}`)
  return res.data
}

const fetchViewApi = async (orderId) => {
  const res = await apiClient.get(`Ordering/ViewMoveOrderForApproval?id=${orderId}`)
  return res.data
}

const ApprovedMO = ({ fetchNotification }) => {

  const [approvedData, setApprovedData] = useState([])

  const [search, setSearch] = useState("")
  const [pageTotal, setPageTotal] = useState(undefined)

  const [orderId, setOrderId] = useState('')
  const [printData, setPrintData] = useState([])

  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount, pages, setPageSize, pageSize } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 10 },
  })

  const fetchApprovedMO = () => {
    fetchApprovedMOApi(currentPage, pageSize, search).then(res => {
      setApprovedData(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchApprovedMO()

    return () => {
      setApprovedData([])
    }
  }, [pageSize, currentPage, search])

  const fetchView = () => {
    fetchViewApi(orderId).then(res => {
      setPrintData(res)
    })
  }

  useEffect(() => {
    if (orderId) {
      fetchView()
    }

    return () => {
      setPrintData([])
    }
  }, [orderId])

  return (
    <ApprovedMoveOrder
      setCurrentPage={setCurrentPage}
      setPageSize={setPageSize}
      setSearch={setSearch}
      pagesCount={pagesCount}
      currentPage={currentPage}
      pageSize={pageSize}
      approvedData={approvedData}
      fetchApprovedMO={fetchApprovedMO}
      orderId={orderId}
      setOrderId={setOrderId}
      printData={printData}
      fetchNotification={fetchNotification}
    />
  )
}

export default ApprovedMO

