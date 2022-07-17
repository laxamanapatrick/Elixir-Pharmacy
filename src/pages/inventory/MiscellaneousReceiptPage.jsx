import { Flex, VStack } from '@chakra-ui/react';
import React from 'react';
import { ActionButtons } from './miscreceipt/Action-Buttons';
import { ListofReceipt } from './miscreceipt/List-of-Receipt';
import { RawMaterialsInformation } from './miscreceipt/Raw-Materials-Information';

const MiscellaneousReceiptPage = () => {
  return (
    <VStack w='full' p={5} spacing={10}>
      <RawMaterialsInformation />
      <ListofReceipt />
      <ActionButtons />
    </VStack>
  )
}

export default MiscellaneousReceiptPage;
