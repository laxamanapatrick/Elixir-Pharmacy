import { Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { ListofRawMaterialsRequirements } from './status-of-request/List-of-Raw-Materials-Requirements'
import { ListofRequest } from './status-of-request/List-of-Request'

const StatusOfRequest = () => {
  return (
    <VStack spacing={5} w='full' h='auto'>
      <ListofRequest />
      <ListofRawMaterialsRequirements />
    </VStack>
  )
}

export default StatusOfRequest