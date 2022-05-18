import React, { useState } from 'react'
import { Text, VStack } from '@chakra-ui/react'
import { ListofRawMaterialsRequirements } from './status-of-request/List-of-Raw-Materials-Requirements'
import { ListofRequest } from './status-of-request/List-of-Request'

const StatusOfRequest = () => {

  const [transformId, setTransformId] = useState("")

  return (
    <VStack spacing={5} w='full' h='auto'>
      <ListofRequest setTransformId={setTransformId} transformId={transformId} />
      <ListofRawMaterialsRequirements transformId={transformId} />
    </VStack>
  )
}

export default StatusOfRequest