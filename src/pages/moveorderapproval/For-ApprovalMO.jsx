import React, { useState, useEffect } from 'react'
import { usePagination } from '@ajna/pagination'
import apiClient from '../../services/apiClient'
import { ForApprovalMoveOrder } from './forapproval/For-Approval-Move-Order'

const fetchForApprovalMOApi = async (pageNumber, pageSize, search) => {
  const res = await apiClient.get(`Ordering/GetAllForApprovalMoveOrderPaginationOrig?pageSize=${pageSize}&pageNumber=${pageNumber}&search=${search}`)
  return res.data
}

const fetchViewApi = async (orderId) => {
  const res = await apiClient.get(`Ordering/ViewMoveOrderForApproval?id=${orderId}`)
  return res.data
}

const ForApprovalMO = ({ notification, fetchNotification }) => {

  const [forApprovalData, setForApprovalData] = useState([])

  const [search, setSearch] = useState("")
  const [pageTotal, setPageTotal] = useState(undefined)

  const [orderId, setOrderId] = useState('')

  const [viewData, setViewData] = useState([])

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

  //List

  const fetchForApprovalMO = () => {
    fetchForApprovalMOApi(currentPage, pageSize, search).then(res => {
      setForApprovalData(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchForApprovalMO()

    return () => {
      setForApprovalData([])
    }
  }, [pageSize, currentPage, search])


  //For View and Printing Layout

  const fetchView = () => {
    fetchViewApi(orderId).then(res => {
      setViewData(res)
    })
  }

  useEffect(() => {
    if (orderId) {
      fetchView()
    }

    return () => {
      setViewData([])
    }
  }, [orderId])

  return (
    <ForApprovalMoveOrder
      setCurrentPage={setCurrentPage}
      setPageSize={setPageSize}
      setSearch={setSearch}
      pagesCount={pagesCount}
      currentPage={currentPage}
      pageSize={pageSize}
      forApprovalData={forApprovalData}
      fetchForApprovalMO={fetchForApprovalMO}
      orderId={orderId} setOrderId={setOrderId}
      viewData={viewData}
      fetchNotification={fetchNotification}
    />
  )
}

export default ForApprovalMO
