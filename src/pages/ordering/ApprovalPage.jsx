import React from 'react';
import { Box, Stack, VStack } from '@chakra-ui/react'
import { ListofPreparedDate } from './approval/List-of-Prepared-Date'
import { ListofOrders } from './approval/List-of-Orders';
import { ActionButtons } from './approval/ActionButtons';

const ApprovalPage = () => {
  return (
    <>
      <VStack w='full' h='auto' spacing={5}>
        <ListofPreparedDate />
        <ListofOrders />
        <ActionButtons />
      </VStack>
    </>
  )
}

export default ApprovalPage;
