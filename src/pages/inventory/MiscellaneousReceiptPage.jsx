import { Flex, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { ActionButtons } from './miscreceipt/Action-Buttons';
import { ListofReceipt } from './miscreceipt/List-of-Receipt';
import { RawMaterialsInformation } from './miscreceipt/Raw-Materials-Information';

const MiscellaneousReceiptPage = () => {

  const [rawMatsInfo, setRawMatsInfo] = useState({
    itemCode: '',
    supplier: '',
    uom: '',
    expirationDate: '',
    quantity: ''
  })

  return (
    <VStack w='full' p={5} spacing={10}>
      <RawMaterialsInformation
        rawMatsInfo={rawMatsInfo} setRawMatsInfo={setRawMatsInfo}
      />
      {
        rawMatsInfo.itemCode && rawMatsInfo.supplier && rawMatsInfo.uom &&
          rawMatsInfo.uom && rawMatsInfo.expirationDate && rawMatsInfo.quantity
          ?
          <>
            <ListofReceipt />
            <ActionButtons />
          </>
          : ''
      }
    </VStack>
  )
}

export default MiscellaneousReceiptPage;
