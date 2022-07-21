import React, { useEffect, useState } from 'react';
import { Flex, list, VStack } from '@chakra-ui/react';
import { ActionButtons } from './miscreceipt/Action-Buttons';
import { ListofReceipt } from './miscreceipt/List-of-Receipt';
import { RawMaterialsInformation } from './miscreceipt/Raw-Materials-Information';
import apiClient from '../../services/apiClient'

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

  const [rawMatsInfo, setRawMatsInfo] = useState({
    itemCode: '',
    supplier: '',
    uom: '',
    expirationDate: '',
    quantity: ''
  })
  const [details, setDetails] = useState('')
  const [listDataTempo, setListDataTempo] = useState([])
  const [selectorId, setSelectorId] = useState('')

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
    <VStack w='full' p={5} spacing={10}>
      <RawMaterialsInformation
        rawMatsInfo={rawMatsInfo} setRawMatsInfo={setRawMatsInfo}
        details={details} setDetails={setDetails}
        listDataTempo={listDataTempo} setListDataTempo={setListDataTempo}
        suppliers={suppliers} rawMats={rawMats} uoms={uoms}
        setSelectorId={setSelectorId}
      />
      {
        listDataTempo.length > 0 ?
          <>
            <ListofReceipt
              listDataTempo={listDataTempo}
              selectorId={selectorId} setSelectorId={setSelectorId}
              setEditableData={setEditableData}
            />
            <ActionButtons
              listDataTempo={listDataTempo}
              setListDataTempo={setListDataTempo}
              editableData={editableData}
              //cancel key
              selectorId={selectorId}
            />
          </>
          : ''
      }
    </VStack>
  )
}

export default MiscellaneousReceiptPage;
