import React from 'react'
import { VStack } from '@chakra-ui/react'
import { ListofMoveOrder } from './transactmoveorder/List-of-Move-Order';
import { MoveOrderInformation } from './transactmoveorder/Move-Order-Information';
import { ListofMoveOrdersPerFarm } from './transactmoveorder/List-of-Move-Orders-PerFarm';

const TransactMoveOrderPage = () => {
  return (
    <>
      <VStack p={5} w='full' spacing={0}>
        <ListofMoveOrder />
        <MoveOrderInformation />
        <ListofMoveOrdersPerFarm />
      </VStack>
    </>
  )
}

export default TransactMoveOrderPage;
