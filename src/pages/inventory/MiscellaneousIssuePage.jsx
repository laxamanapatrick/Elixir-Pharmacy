import React, { useEffect, useState } from 'react';
import { Button, Flex, HStack, VStack } from '@chakra-ui/react';
import { RawMaterialsInformation } from './miscissue/Raw-Materials-Information';
import { ListofIssue } from './miscissue/List-of-Issue';
import { ListofIssues } from './miscissue/viewingMiscIssue/List-Issue';
import { ActionButton } from './miscissue/Action-Button';
import apiClient from '../../services/apiClient'

const fetchCustomersApi = async () => {
  const res = await apiClient.get(`Customer/GetAllActiveCustomer`)
  return res.data
}
const fetchRawMatsApi = async () => {
  const res = await apiClient.get(`RawMaterial/GetAllActiveRawMaterials`)
  return res.data
}
const fetchExpiryDatesApi = async (itemCode) => {
  const res = await apiClient.get(`Miscellaneous/GetAllAvailableStocksForMIsssue?itemcode=${itemCode}`)
  return res.data
}
const fetchUOMsApi = async () => {
  const res = await apiClient.get(`Uom/GetAllActiveUOM`)
  return res.data
}

const MiscellaneousIssuePage = () => {

  const [customers, setCustomers] = useState([])
  const [rawMats, setRawMats] = useState([])
  const [uoms, setUoms] = useState([])

  const [warehouseId, setWarehouseId] = useState('')

  const [expiryDates, setExpiryDates] = useState([])

  const [totalQuantity, setTotalQuantity] = useState('')
  const [customerData, setCustomerData] = useState({
    customerCode: '',
    customer: ''
  })

  const [navigation, setNavigation] = useState('')

  const [rawMatsInfo, setRawMatsInfo] = useState({
    itemCode: '',
    itemDescription: '',
    customer: '',
    uom: '',
    expirationDate: '',
    quantity: ''
  })
  const itemCode = rawMatsInfo.itemCode

  const [details, setDetails] = useState('')
  const [listDataTempo, setListDataTempo] = useState([])
  const [selectorId, setSelectorId] = useState('')
  const [rowIndex, setRowIndex] = useState('')

  const [editableData, setEditableData] = useState({})

  //Supplier Fetching
  const fetchCustomers = () => {
    fetchCustomersApi().then(res => {
      setCustomers(res)
    })
  }

  useEffect(() => {
    fetchCustomers()

    return () => {
      setCustomers([])
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

  //Expiry Dates
  const fetchExpiryDates = () => {
    fetchExpiryDatesApi(itemCode).then(res => {
      setExpiryDates(res)
    })
  }

  useEffect(() => {
    fetchExpiryDates()

    return () => {
      setExpiryDates([])
    }
  }, [itemCode])

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
            Add Issue
          </Button>
          <Button
            bgColor={navigation === 2 ? 'secondary' : ''}
            color={navigation === 2 ? 'white' : ''}
            _hover={{ bgColor: 'accent', color: 'white' }}
            border='1px' borderColor='gray.300' size='sm'
            onClick={() => setNavigation(2)}
          >
            View Issues
          </Button>
        </HStack>
      </Flex>

      <VStack w='full' p={5} spacing={10} border='1px' height={listDataTempo.length === 0 ? '85vh' : 'auto'}>
        {
          navigation === 1 ?

            <>
              <RawMaterialsInformation
                rawMatsInfo={rawMatsInfo} setRawMatsInfo={setRawMatsInfo}
                details={details} setDetails={setDetails}
                listDataTempo={listDataTempo} setListDataTempo={setListDataTempo}
                customers={customers} rawMats={rawMats} uoms={uoms} expiryDates={expiryDates}
                setSelectorId={setSelectorId}
                setCustomerData={setCustomerData}
                setWarehouseId={setWarehouseId}
              />
              {
                listDataTempo.length > 0 ?
                  <>
                    <ListofIssue
                      listDataTempo={listDataTempo}
                      selectorId={selectorId} setSelectorId={setSelectorId}
                      setEditableData={setEditableData}
                      setRowIndex={setRowIndex}
                      setTotalQuantity={setTotalQuantity}
                    />
                    <ActionButton
                      listDataTempo={listDataTempo}
                      setListDataTempo={setListDataTempo}
                      totalQuantity={totalQuantity}
                      customerData={customerData}
                      editableData={editableData}
                      selectorId={selectorId}
                      //cancel key
                      rowIndex={rowIndex}
                      //warehouse Id
                      warehouseId={warehouseId}
                    />
                  </>
                  : ''
              }
            </>

            : navigation === 2 ?
              <>
                <ListofIssues />
              </>
              :
              ''
        }
      </VStack>

    </Flex>

  )
}

export default MiscellaneousIssuePage;
