import { VStack } from '@chakra-ui/react';
import React from 'react';
import { ListofRawMaterialsRequirements } from './approval-request/List-of-Raw-Materials-Requirements';
import { ListofRequest } from './approval-request/List-of-Request';
import { Submit } from './approval-request/Submit';

const ApprovalRequestPage = () => {
  return (
    <VStack spacing={3} w='full' h='83.5vh'>
      <ListofRequest />
      <ListofRawMaterialsRequirements />
      <Submit />
    </VStack>
  )
}

export default ApprovalRequestPage;
