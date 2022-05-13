import React from 'react'
import { Text, VStack } from '@chakra-ui/react'
import { ListofReject } from './request-reject/List-of-Reject'
import { ListofRawMaterialsRequirements } from './request-reject/List-of-Raw-Materials-Requirements'

const RequestReject = () => {
  return (
    <VStack spacing={5} w='full' h='auto'>
      <ListofReject />
      <ListofRawMaterialsRequirements />
    </VStack>
  )
}

export default RequestReject