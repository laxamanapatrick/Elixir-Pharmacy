import React, { useEffect, useState } from 'react'
import { Box, Button, ButtonGroup, Flex, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { MRPTable } from './mrp/MRP-Table'
import { RawMatertialInformation } from './mrp/Raw-Matertial-Information'
import apiClient from '../../services/apiClient'

const fetchMRPApi = async () => {
  const res = await apiClient.get(`Inventory/MRPInventory`)
  return res.data
}

const MrpPage = () => {

  const [mrpData, setMrpData] = useState([])
  const [selectorId, setSelectorId] = useState('')
  const [rawMatsInfo, setRawMatsInfo] = useState({
    itemCode: '',
    itemDescription: '',
    soh: '',
    bufferLevel: '',
    suggestedPo: '',
    lastUsed: ''
  })

  const fetchMRP = () => {
    fetchMRPApi().then(res => {
      setMrpData(res)
    })
  }

  useEffect(() => {
    fetchMRP()

    return () => {
      setMrpData([])
    }
  }, [])

  return (
    <Flex flexDirection='column' w='full'>
      <Text textAlign='center' color='white' bgColor='accent' py={2}>MRP</Text>
      <VStack w='full' p={5} justifyContent='space-between' spacing={5}>
        <MRPTable mrpData={mrpData} setSelectorId={setSelectorId} selectorId={selectorId} setRawMatsInfo={setRawMatsInfo} />
        {
          selectorId ?
            <RawMatertialInformation mrpDataLength={mrpData?.length} rawMatsInfo={rawMatsInfo} />
            :
            <Flex w='full' justifyContent='center'>
              <Text fontSize='xs' fontWeight='semibold'>Total Records: {mrpData?.length}</Text>
            </Flex>
        }
      </VStack>
    </Flex>
  )
}

export default MrpPage
