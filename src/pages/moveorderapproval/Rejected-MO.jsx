import React, { useEffect, useState } from 'react'
import { usePagination } from '@ajna/pagination'
import { RejectedMoveOrder } from './rejectedmo/Rejected-Move-Order'
import apiClient from '../../services/apiClient'

const fetchRejectedMOApi = async (pageNumber, pageSize, search) => {
  const res = await apiClient.get(`Ordering/RejectedMoveOrderPaginationOrig?pageSize=${pageSize}&pageNumber=${pageNumber}&search=${search}`)
  return res.data
}

const RejectedMO = ({ notification, fetchNotification }) => {

  const [rejectedData, setRejectedData] = useState([])

  const [search, setSearch] = useState("")
  const [pageTotal, setPageTotal] = useState(undefined)

  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount, pages, setPageSize, pageSize } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 5 },
  })

  const fetchRejectedMO = () => {
    fetchRejectedMOApi(currentPage, pageSize, search).then(res => {
      setRejectedData(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchRejectedMO()

    return () => {
      setRejectedData([])
    }
  }, [pageSize, currentPage, search])

  return (
    <RejectedMoveOrder
      setCurrentPage={setCurrentPage}
      setPageSize={setPageSize}
      setSearch={setSearch}
      pagesCount={pagesCount}
      currentPage={currentPage}
      pageSize={pageSize}
      rejectedData={rejectedData}
      fetchRejectedMO={fetchRejectedMO}
      fetchNotification={fetchNotification}
    />
  )
}

export default RejectedMO
