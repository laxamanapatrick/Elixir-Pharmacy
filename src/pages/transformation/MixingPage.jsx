import React, { useState, useEffect } from 'react'
import { Box, VStack } from '@chakra-ui/react'
import { ListofRequest } from './mixing/List-of-Request';
import { ListofRequirements } from './mixing/List-of-Requirements';
import { StartMixing } from './mixing/Start-Mixing';
import { WeighingScaleInformation } from './mixing/Weighing-Scale-Information';
import apiClient from '../../services/apiClient'
import { usePagination } from '@ajna/pagination';

const MixingPage = () => {

  const [mixingCue, setMixingCue] = useState(false)
  const [transformId, setTransformId] = useState(null)

  const [requests, setRequests] = useState([])
  const [pageTotal, setPageTotal] = useState(undefined);
  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 1 },
  })

  const [requirements, setRequirements] = useState([])

  const [batchRemaining, setBatchRemaining] = useState(null)

  const fetchMixingRequestApi = async (pageNumber) => {
    const res = await apiClient.get(`Preparation/GetAllTransformationForMixingPagination?pageSize=1&pageNumber=${pageNumber}`)
    return res.data
  }

  const fetchMixingRequest = () => {
    fetchMixingRequestApi(currentPage).then(res => {
      setRequests(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchMixingRequest()

    return () => {
      setRequests([])
    }
  }, [currentPage])

  const fetchRequirementsApi = async () => {
    const res = await apiClient.get(`Preparation/GetAllRequirementsForMixing?id=${transformId}`)
    return res.data
  }

  const fetchRequirements = () => {
    fetchRequirementsApi(transformId).then(res => {
      setRequirements(res)
    })
  }

  useEffect(() => {
    if (transformId) {
      fetchRequirements()
    }

    return () => {
      setRequirements([])
    }
  }, [transformId])

  const fetchBatchRemainingAPi = async () => {
    const res = await apiClient.get(`Preparation/GetAllBatchRemainingPerMixing/?id=${transformId}`)
    return res.data
  }

  const fetchBatchRemaining = () => {
    fetchBatchRemainingAPi(transformId).then(res => {
      setBatchRemaining(res)
    })
  }

  useEffect(() => {
    if (transformId) {
      fetchBatchRemaining()
    }

    return () => {
      setBatchRemaining(null)
    }
  }, [transformId])

  return (
    <VStack spacing={3} w='full' h='83.5vh' p={5} justifyContent='space-between'>
      <Box w='full'>
        <ListofRequest
          setTransformId={setTransformId}
          transformId={transformId}
          setBatchRemaining={setBatchRemaining}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          pagesCount={pagesCount}
          requests={requests}
        />
        <ListofRequirements requirements={requirements} requests={requests} />
        {
          mixingCue &&
          <WeighingScaleInformation
            transformId={transformId}
            batchRemaining={batchRemaining}
            fetchMixingRequest={fetchMixingRequest}
            fetchRequirements={fetchRequirements}
            fetchBatchRemaining={fetchBatchRemaining}
            setMixingCue={setMixingCue}
          />
        }
      </Box>
      <Box w='full'>
        <StartMixing setMixingCue={setMixingCue} mixingCue={mixingCue} />
      </Box>
    </VStack>
  )

}

export default MixingPage;