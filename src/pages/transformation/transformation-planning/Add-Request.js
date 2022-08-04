import React, { useState, useEffect } from 'react'
import { VStack } from '@chakra-ui/react'
import PageScrollTransformation from '../../../components/PageScroll-Transformation'
import { RawMaterialsInformation } from './add-request/Raw-Materials-Information'
import { ListofRequest } from './add-request/List-of-Request'
import { ListofRawMaterialsRequirements } from './add-request/List-of-Raw-Materials-Requirements'
import apiClient from '../../../services/apiClient'

const AddRequest = ({ fetchNotification }) => {

  const [transformId, setTransformId] = useState("")

  // Raw Materials States
  const [formulas, setFormulas] = useState([])
  const [code, setCode] = useState("")
  const [codeData, setCodeData] = useState([])

  // List of Request States
  const [requests, setRequests] = useState([])

  // List of Requirements States
  const [requirements, setRequirements] = useState([])

  // Raw Materials Api(s)
  const fetchFormula = async () => {
    try {
      const res = await apiClient.get('Planning/GetAllAvailableFormulaCode')
      setFormulas(res.data)
    } catch (error) {
    }
  }

  const fetchVersionsApi = async (code) => {
    const res = await apiClient.get(`Planning/GetAllVersionByItemCode?itemcode=${code}`)
    return res.data
  }

  const fetchVersions = () => {
    fetchVersionsApi(code).then(res => {
      setCodeData(res)
    })
  }

  // List of Request Api(s)
  const fetchRequests = async () => {
    try {
      const res = await apiClient.get('Planning/GetAllPendingTransformationRequest')
      setRequests(res.data)
    } catch (error) {
    }
  }

  // List of Requirements Api(s)
  const fetchRequirementsApi = async (transformId) => {
    const res = await apiClient.get(`Planning/GetAllRequirementsByTransformId/${transformId}`)
    return res.data
  }

  const fetchRequirements = () => {
    fetchRequirementsApi(transformId).then(res => {
      setRequirements(res)
    })
  }

  // Raw Materials Fetching
  useEffect(() => {
    try {
      fetchFormula()
    } catch (error) {
    }

    return () => {
      setFormulas([])
    }
  }, [])

  useEffect(() => {
    fetchVersions()

    return () => {
      setCodeData([])
    }
  }, [code])

  // List of Request States Fetching
  useEffect(() => {
    try {
      fetchRequests()
    } catch (error) {
    }

    return () => {
      setRequests([])
    }
  }, [])

  // List of Requirements Fetching
  useEffect(() => {
    if (transformId) {
      fetchRequirements()
    }

    return () => {
      setRequirements([])
    }
  }, [transformId])

  return (
    <VStack spacing={3} w='full' h='auto'>
      <RawMaterialsInformation formulas={formulas} setCode={setCode} codeData={codeData} fetchRequests={fetchRequests} fetchNotification={fetchNotification} />
      <ListofRequest setTransformId={setTransformId} transformId={transformId} requests={requests} fetchRequests={fetchRequests} fetchRequirements={fetchRequirements} fetchNotification={fetchNotification} />
      <ListofRawMaterialsRequirements transformId={transformId} requirements={requirements} />
    </VStack>
  )
}

export default AddRequest
