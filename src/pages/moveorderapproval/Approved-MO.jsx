import { usePagination } from '@ajna/pagination'
import React, { useEffect, useState } from 'react'
import apiClient from '../../services/apiClient'
import { ApprovedMoveOrder } from './approvedmo/Approved-Move-Order'

const fetchApprovedMOApi = async (pageNumber, pageSize , search) => {
  const res = await apiClient.get(`Ordering/ApprovedMoveOrderPaginationOrig?pageSize=${pageSize}&pageNumber=${pageNumber}&search=${search}`)
  return res.data
}

const ApprovedMO = () => {

  const [approvedData, setApprovedData] = useState([])

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

  const fetchApprovedMO = () => {
    fetchApprovedMOApi(currentPage, pageSize, search).then(res => {
      setApprovedData(res)
    })
  }

  useEffect(() => {
    fetchApprovedMO()

    return () => {
      setApprovedData([])
    }
  }, [currentPage, pageSize, search])

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
    />
  )
}

export default ApprovedMO

