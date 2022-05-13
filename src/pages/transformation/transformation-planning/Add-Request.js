import React from 'react'
import { VStack } from '@chakra-ui/react'
import PageScrollTransformation from '../../../components/PageScroll-Transformation'
import { RawMaterialsInformation } from './add-request/Raw-Materials-Information'
import { ListofRequest } from './add-request/List-of-Request'
import { ListofRawMaterialsRequirements } from './add-request/List-of-Raw-Materials-Requirements'

const AddRequest = () => {
  return (
    <VStack spacing={3} w='full' h='auto'>
      <RawMaterialsInformation />
      <ListofRequest />
      <ListofRawMaterialsRequirements />
    </VStack>
  )
}

export default AddRequest