import React, { useEffect, useState } from 'react';
import { VStack } from '@chakra-ui/react';
import { RawMaterialsInformation } from './miscissue/Raw-Materials-Information';
import { ListofIssue } from './miscissue/List-of-Issue';
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
const fetchUOMsApi = async () => {
  const res = await apiClient.get(`Uom/GetAllActiveUOM`)
  return res.data
}

const MiscellaneousIssuePage = () => {

  const [customers, setCustomers] = useState([])
  const [rawMats, setRawMats] = useState([])
  const [uoms, setUoms] = useState([])

  const [rawMatsInfo, setRawMatsInfo] = useState({
    itemCode: '',
    itemDescription: '',
    customer: '',
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
        customers={customers} rawMats={rawMats} uoms={uoms}
        setSelectorId={setSelectorId}
      />
      {
        listDataTempo.length > 0 ?
          <>
            <ListofIssue
              listDataTempo={listDataTempo}
              selectorId={selectorId} setSelectorId={setSelectorId}
              setEditableData={setEditableData}
              setRowIndex={setRowIndex}
            />
            <ActionButton
              listDataTempo={listDataTempo}
              setListDataTempo={setListDataTempo}
              editableData={editableData}
              selectorId={selectorId}
              //cancel key
              rowIndex={rowIndex}
            />
          </>
          : ''
      }
    </VStack>
  )
}

export default MiscellaneousIssuePage;
