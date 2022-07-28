import React, { useEffect, useState } from 'react';
import { Button, Flex, HStack, VStack } from '@chakra-ui/react';
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

const MiscellaneousReceiptPage = () => {

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

      <VStack w='full' p={5} spacing={10} border='1px' height={listDataTempo.length === 0 ? '85vh' : 'auto'}>
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
                    />
                    <ActionButtons
                      listDataTempo={listDataTempo}
                      setListDataTempo={setListDataTempo}
                      totalQuantity={totalQuantity}
                      supplierData={supplierData}
                      editableData={editableData}
                      selectorId={selectorId}
                      //cancel key
                      rowIndex={rowIndex}
                    />
                  </>
                  : ''
              }
            </>
            : navigation === 2 ?
              <>
                <ListofReceipts />
              </>
              :
              ''
        }
      </VStack>

    </Flex>
  )
}

export default MiscellaneousReceiptPage;
