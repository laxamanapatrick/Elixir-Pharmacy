import React, { useState, useEffect } from 'react'
import { Text, VStack } from '@chakra-ui/react'
import { ListofReject } from './request-reject/List-of-Reject'
import { ListofRawMaterialsRequirements } from './request-reject/List-of-Raw-Materials-Requirements'
import apiClient from '../../../services/apiClient'
import SubmitButtons from './request-reject/Submit-Buttons'

const RequestReject = ({ fetchNotification }) => {

  const [transformId, setTransformId] = useState("")
  const [status, setStatus] = useState("rejected")
  const [rejects, setRejects] = useState([])
  const [requirements, setRequirements] = useState([])

  const [editData, setEditData] = useState([])

  const fetchRejectedApi = async (status) => {
    const res = await apiClient.get(`Planning/GetAllRejectRequest`)
    return res.data
  }

  const fetchRejected = () => {
    fetchRejectedApi(status).then(res => {
      setRejects(res)
    })
  }

  const fetchRequirementsApi = async (transformId) => {
    const res = await apiClient.get(`Planning/GetAllRejectRequirementsStatus/${transformId}`)
    return res.data
  }

  const fetchRequirements = () => {
    fetchRequirementsApi(transformId).then(res => {
      setRequirements(res)
    })
  }

  useEffect(() => {
    fetchRejected()

    return () => {
      setRejects([])
    }
  }, [status])


  useEffect(() => {
    if (transformId) {
      fetchRequirements()
    }

    return () => {
      setRequirements([])
    }
  }, [transformId])

  return (
    <VStack spacing={5} w='full' h='auto'>
      <ListofReject rejects={rejects} setTransformId={setTransformId} transformId={transformId} setEditData={setEditData} />
      <ListofRawMaterialsRequirements requirements={requirements} transformId={transformId} />
      <SubmitButtons transformId={transformId} setTransformId={setTransformId} fetchRejected={fetchRejected} 
      fetchRequirements={fetchRequirements} editData={editData} fetchNotification={fetchNotification} />
    </VStack>
  )
}

export default RequestReject