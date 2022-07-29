import React, { useState, useEffect } from 'react'
import { Box, VStack } from '@chakra-ui/react'
import { ListofRequest } from './mixing/List-of-Request';
import { ListofRequirements } from './mixing/List-of-Requirements';
import { StartMixing } from './mixing/Start-Mixing';
import { WeighingScaleInformation } from './mixing/Weighing-Scale-Information';
import apiClient from '../../services/apiClient'
import { usePagination } from '@ajna/pagination';

const fetchMixingRequestApi = async (pageNumber) => {
  const res = await apiClient.get(`Preparation/GetAllTransformationForMixingPagination?pageSize=1&pageNumber=${pageNumber}`)
  return res.data
}
const fetchRequirementsApi = async (transformId) => {
  const res = await apiClient.get(`Preparation/GetAllRequirementsForMixing?id=${transformId}`)
  return res.data
}
const fetchBatchRemainingAPi = async (transformId) => {
  const res = await apiClient.get(`Preparation/GetAllBatchRemainingPerMixing/?id=${transformId}`)
  return res.data
}

const MixingPage = ({ fetchNotification }) => {

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

  const [batch, setBatch] = useState(null)

  const [requirements, setRequirements] = useState([])

  const [quantity, setQuantity] = useState(null)
  const [batchRemaining, setBatchRemaining] = useState(null)

  const [quantityBasis, setQuantityBasis] = useState('')

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
          setQuantity={setQuantity}
          setBatch={setBatch}
          setMixingCue={setMixingCue}
        />
        <ListofRequirements requirements={requirements} requests={requests} setQuantityBasis={setQuantityBasis} />
        {
          mixingCue &&
          <WeighingScaleInformation
            transformId={transformId}
            batchRemaining={batchRemaining?.remainingBatch}
            totalWeighingScale={batchRemaining?.totalWeighingScale}
            fetchMixingRequest={fetchMixingRequest}
            fetchRequirements={fetchRequirements}
            fetchBatchRemaining={fetchBatchRemaining}
            setMixingCue={setMixingCue}
            quantity={quantity}
            requests={requests}
            batch={batch}
            setCurrentPage={setCurrentPage}
            fetchNotification={fetchNotification}
            quantityBasis={quantityBasis}
          />
        }
      </Box>
      <Box w='full'>
        <StartMixing setMixingCue={setMixingCue} mixingCue={mixingCue} transformId={transformId} />
      </Box>
    </VStack>
  )

}

export default MixingPage;
