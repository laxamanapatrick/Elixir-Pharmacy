import React, { useEffect, useState } from 'react'
import { Box, Button, ButtonGroup, Flex, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { usePagination } from '@ajna/pagination'
import { MRPTable } from './mrp/MRP-Table'
import { RawMatertialInformation } from './mrp/Raw-Matertial-Information'
import apiClient from '../../services/apiClient'

const fetchMRPApi = async (pageNumber, pageSize, search) => {
  const res = await apiClient.get(`Inventory/GetAllItemForInventoryPaginationOrig?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`)
  return res.data
}

const fetchMRPForSheetApi = async (pageTotal) => {
  const res = await apiClient.get(`Inventory/GetAllItemForInventoryPaginationOrig?pageNumber=1&pageSize=${pageTotal}&search=`)
  return res.data
}

const MrpPage = () => {

  const [pageTotal, setPageTotal] = useState(undefined)
  const [search, setSearch] = useState("")
  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount, pages, setPageSize, pageSize } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 50 },

  })

  const [mrpData, setMrpData] = useState([])
  const [selectorId, setSelectorId] = useState('')
  const [rawMatsInfo, setRawMatsInfo] = useState({
    itemCode: '',
    itemDescription: '',
    soh: '',
    bufferLevel: '',
    suggestedPo: '',
    lastUsed: ''
  })

  const [sheetData, setSheetData] = useState([])

  const fetchMRP = () => {
    fetchMRPApi(currentPage, pageSize, search).then(res => {
      setMrpData(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchMRP()

    return () => {
      setMrpData([])
    }
  }, [currentPage, pageSize, search])

  const fetchMRPForSheet = () => {
    fetchMRPForSheetApi(pageTotal).then(res => {
      setSheetData(res.inventory)
    })
  }

  useEffect(() => {
    if (pageTotal) {
      fetchMRPForSheet()
    }

    return () => {
      setSheetData([])
    }
  }, [pageTotal])

  return (
    <Flex flexDirection='column' w='full'>
      {/* <Text textAlign='center' color='white' bgColor='accent' py={2}>MRP</Text> */}
      <VStack w='full' p={5} justifyContent='space-between' spacing={5}>
        <MRPTable
          mrpData={mrpData}
          setSelectorId={setSelectorId} selectorId={selectorId}
          setRawMatsInfo={setRawMatsInfo}
          pagesCount={pagesCount}
          pages={pages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
          setSearch={setSearch}
          pageTotal={pageTotal}
          sheetData={sheetData}
        />
        {
          selectorId ?
            <RawMatertialInformation mrpDataLength={mrpData?.inventory?.length} rawMatsInfo={rawMatsInfo} />
            :
            <Flex w='full' justifyContent='center'>
              <Text fontSize='xs' fontWeight='semibold'>Total Records/page: {mrpData?.inventory?.length}</Text>
            </Flex>
        }
      </VStack>
    </Flex>
  )
}

export default MrpPage
