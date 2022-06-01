import React, { useState, useEffect } from 'react'
import { Box, VStack } from '@chakra-ui/react'
import { ListofRequest } from './mixing/List-of-Request';
import { ListofRequirements } from './mixing/List-of-Requirements';
import { StartMixing } from './mixing/Start-Mixing';
import { WeighingScaleInformation } from './mixing/Weighing-Scale-Information';
import apiClient from '../../services/apiClient'

const MixingPage = () => {

  const [mixingCue, setMixingCue] = useState(false)
  const [transformId, setTransformId] = useState(null)

  const [requirements, setRequirements] = useState([])

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


  return (
    <VStack spacing={3} w='full' h='83.5vh' p={5} justifyContent='space-between'>
      <Box w='full'>
        <ListofRequest setTransformId={setTransformId} transformId={transformId} />
        <ListofRequirements requirements={requirements} />
        {
          mixingCue &&
          <WeighingScaleInformation />
        }
      </Box>
      <Box w='full'>
        <StartMixing setMixingCue={setMixingCue} mixingCue={mixingCue} />
      </Box>
    </VStack>
  )

}

export default MixingPage;
