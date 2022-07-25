import React, { useState, useEffect } from 'react';
import { VStack } from '@chakra-ui/react';
import { ListofRawMaterialsRequirements } from './approval-request/List-of-Raw-Materials-Requirements';
import { ListofRequest } from './approval-request/List-of-Request';
import { Submit } from './approval-request/Submit';
import apiClient from '../../services/apiClient';

const ApprovalRequestPage = ({ fetchNotification }) => {

  const [transformId, setTransformId] = useState("")
  // const [status, setStatus] = useState("pending")
  const [requests, setRequests] = useState([])
  const [requirements, setRequirements] = useState([])

  const fetchRequestByStatusApi = async () => {
    const res = await apiClient.get(`Planning/GetAllPendingTransformationRequest`)
    return res.data
  }

  const fetchRequestByStatus = () => {
    fetchRequestByStatusApi().then(res => {
      setRequests(res)
    })
  }

  const fetchRequirementsApi = async (transformId) => {
    const res = await apiClient.get(`Planning/GetAllPendingRequestWithRequirements/${transformId}`)
    return res.data
  }

  const fetchRequirements = () => {
    fetchRequirementsApi(transformId).then(res => {
      setRequirements(res)
    })
  }

  useEffect(() => {
    fetchRequestByStatus()
  }, [setRequests])

  useEffect(() => {
    if (transformId) {
      fetchRequirements()
    }
  }, [transformId])

  return (
    <VStack spacing={3} w='full' h='83.5vh'>
      <ListofRequest setTransformId={setTransformId} transformId={transformId} requests={requests} />
      <ListofRawMaterialsRequirements transformId={transformId} requirements={requirements} />
      <Submit transformId={transformId} setTransformId={setTransformId}
        fetchRequestByStatus={fetchRequestByStatus} fetchRequirements={fetchRequirements}
        fetchNotification={fetchNotification}
      />
    </VStack>
  )
}

export default ApprovalRequestPage;
