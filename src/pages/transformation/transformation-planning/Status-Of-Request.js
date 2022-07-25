import React, { useState } from 'react'
import { Text, VStack } from '@chakra-ui/react'
import { ListofRawMaterialsRequirements } from './status-of-request/List-of-Raw-Materials-Requirements'
import { ListofRequest } from './status-of-request/List-of-Request'

const StatusOfRequest = ({ fetchNotification }) => {

  const [transformId, setTransformId] = useState("")
  const [status, setStatus] = useState("pending")

  return (
    <VStack spacing={5} w='full' h='auto'>
      <ListofRequest setTransformId={setTransformId} transformId={transformId} status={status} setStatus={setStatus} fetchNotification={fetchNotification} />
      <ListofRawMaterialsRequirements transformId={transformId} status={status} />
    </VStack>
  )
}

export default StatusOfRequest