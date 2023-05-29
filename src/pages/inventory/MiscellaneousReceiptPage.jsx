import React, { useEffect, useRef, useState } from 'react';
import { Button, Flex, HStack, VStack } from '@chakra-ui/react';
import { usePagination } from '@ajna/pagination'
import { ActionButtons } from './miscreceipt/Action-Buttons';
import { ListofReceipt } from './miscreceipt/List-of-Receipt';
import { RawMaterialsInformation } from './miscreceipt/Raw-Materials-Information';
import apiClient from '../../services/apiClient'
import { ListofReceipts } from './miscreceipt/viewingMiscReceipt/List';

const fetchSuppliersApi = async () => {
  const res = await apiClient.get(`Supplier/GetAllActiveSupplier`)
  return res.data
}
const fetchRawMatsApi = async () => {
  const res = await apiClient.get(`RawMaterial/GetAllActiveRawMaterials`)
  return res.data
}
const fetchUOMsApi = async () => {
  const res = await apiClient.get(`Uom/GetAllActiveUOM`)
  return res.data
}

//Receipts Viewing
const fetchReceiptsApi = async (pageNumber, pageSize, search, status) => {
  const res = await apiClient.get(`Miscellaneous/GetAllMiscellaneousReceiptPaginationOrig?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}&status=${status}`);
  return res.data
}

const MiscellaneousReceiptPage = () => {

  const supplierRef = useRef()
  const remarksRef = useRef()

  const [suppliers, setSuppliers] = useState([])
  const [rawMats, setRawMats] = useState([])
  const [uoms, setUoms] = useState([])

  const [totalQuantity, setTotalQuantity] = useState('')
  const [supplierData, setSupplierData] = useState({
    supplierCode: '',
    supplierName: ''
  })

  const [navigation, setNavigation] = useState('')

  const [rawMatsInfo, setRawMatsInfo] = useState({
    itemCode: '',
    itemDescription: '',
    supplier: '',
    uom: '',
    expirationDate: '',
    quantity: ''
  })
  const [details, setDetails] = useState('')
  const [remarks, setRemarks] = useState('')
  const [transactionDate, setTransactionDate] = useState('')

  const [listDataTempo, setListDataTempo] = useState([])
  const [selectorId, setSelectorId] = useState('')
  const [rowIndex, setRowIndex] = useState('')

  const [editableData, setEditableData] = useState({})

  //Supplier Fetching
  const fetchSuppliers = () => {
    fetchSuppliersApi().then(res => {
      setSuppliers(res)
    })
  }

  useEffect(() => {
    fetchSuppliers()

    return () => {
      setSuppliers([])
    }
  }, [])

  //Raw Mats Fetching
  const fetchRawMats = () => {
    fetchRawMatsApi().then(res => {
      setRawMats(res)
    })
  }

  useEffect(() => {
    fetchRawMats()

    return () => {
      setRawMats([])
    }
  }, [])

  //UOM Fetching
  const fetchUOMs = () => {
    fetchUOMsApi().then(res => {
      setUoms(res)
    })
  }

  useEffect(() => {
    fetchUOMs()

    return () => {
      setUoms([])
    }
  }, [])



  //Receipts Viewing
  const [receiptData, setReceiptData] = useState([])
  const [pageTotal, setPageTotal] = useState(undefined)
  const [status, setStatus] = useState(true)
  const [search, setSearch] = useState("")
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
  const fetchReceipts = () => {
    fetchReceiptsApi(currentPage, pageSize, search, status).then(res => {
      setReceiptData(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchReceipts()
  }, [status, pageSize, currentPage, search]);


  //Refetch on change navigation
  useEffect(() => {
    if (navigation) {
      fetchReceipts()
      fetchSuppliers()
      fetchRawMats()
      fetchUOMs()
    }
  }, [navigation])

  return (
    <Flex px={5} pt={5} pb={0} w='full' flexDirection='column'>

      <Flex w='full' justifyContent='space-between'>
        <HStack spacing={0}>
          <Button
            bgColor={navigation === 1 ? 'secondary' : ''}
            color={navigation === 1 ? 'white' : ''}
            _hover={{ bgColor: 'accent', color: 'white' }}
            border='1px' borderColor='gray.300' size='sm'
            onClick={() => setNavigation(1)}
          >
            Add Receipt
          </Button>
          <Button
            bgColor={navigation === 2 ? 'secondary' : ''}
            color={navigation === 2 ? 'white' : ''}
            _hover={{ bgColor: 'accent', color: 'white' }}
            border='1px' borderColor='gray.300' size='sm'
            onClick={() => setNavigation(2)}
          >
            View Receipts
          </Button>
        </HStack>
      </Flex>

      <VStack w='full' p={5} spacing={10} border='1px' height={listDataTempo.length === 0 ? '87vh' : 'auto'}>
        {
          navigation === 1 ?
            <>
              <RawMaterialsInformation
                rawMatsInfo={rawMatsInfo} setRawMatsInfo={setRawMatsInfo}
                details={details} setDetails={setDetails}
                listDataTempo={listDataTempo} setListDataTempo={setListDataTempo}
                suppliers={suppliers} rawMats={rawMats} uoms={uoms}
                setSelectorId={setSelectorId}
                setSupplierData={setSupplierData}
                supplierRef={supplierRef}
                remarks={remarks} setRemarks={setRemarks} remarksRef={remarksRef}
                transactionDate={transactionDate} setTransactionDate={setTransactionDate}
              />
              {
                listDataTempo.length > 0 ?
                  <>
                    <ListofReceipt
                      listDataTempo={listDataTempo}
                      selectorId={selectorId} setSelectorId={setSelectorId}
                      setEditableData={setEditableData}
                      setRowIndex={setRowIndex}
                      setTotalQuantity={setTotalQuantity}
                      remarks={remarks}
                    />
                    <ActionButtons
                      listDataTempo={listDataTempo}
                      setListDataTempo={setListDataTempo}
                      totalQuantity={totalQuantity}
                      supplierData={supplierData}
                      editableData={editableData}
                      selectorId={selectorId}
                      supplierRef={supplierRef}
                      setDetails={setDetails}
                      setRawMatsInfo={setRawMatsInfo}
                      //cancel key
                      rowIndex={rowIndex}
                      remarks={remarks} setRemarks={setRemarks} remarksRef={remarksRef}
                      transactionDate={transactionDate}
                    />
                  </>
                  : ''
              }
            </>
            : navigation === 2 ?
              <>
                <ListofReceipts
                  receiptData={receiptData}
                  setCurrentPage={setCurrentPage}
                  setPageSize={setPageSize}
                  setStatus={setStatus}
                  setSearch={setSearch}
                  pagesCount={pagesCount}
                  currentPage={currentPage}
                  pages={pages}
                  fetchReceipts={fetchReceipts}
                />
              </>
              :
              ''
        }
      </VStack>

    </Flex>
  )
}

export default MiscellaneousReceiptPage;
