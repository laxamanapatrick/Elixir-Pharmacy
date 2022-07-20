import React, { useState } from 'react';
import { VStack } from '@chakra-ui/react';
import { RawMaterialsInformation } from './miscissue/Raw-Materials-Information';
import { ListofIssue } from './miscissue/List-of-Issue';
import { ActionButton } from './miscissue/Action-Button';

const MiscellaneousIssuePage = () => {
  const [rawMatsInfo, setRawMatsInfo] = useState({
    itemCode: '',
    supplier: '',
    uom: '',
    expirationDate: '',
    quantity: ''
  })

  const [details, setDetails] = useState('')

  const [listDataTempo, setListDataTempo] = useState({
    itemCode: '',
    supplier: '',
    uom: '',
    expirationDate: '',
    quantity: '',
    description: ''
  })

  return (
    <VStack w='full' p={5} spacing={10}>
      <RawMaterialsInformation
        rawMatsInfo={rawMatsInfo} setRawMatsInfo={setRawMatsInfo}
        details={details} setDetails={setDetails}
        setListDataTempo={setListDataTempo}
      />
      {
        listDataTempo.itemCode && listDataTempo.supplier && listDataTempo.uom &&
          listDataTempo.uom && listDataTempo.expirationDate && listDataTempo.quantity && listDataTempo.description
          ?
          <>
            <ListofIssue listDataTempo={listDataTempo} />
            <ActionButton />
          </>
          : ''
      }
    </VStack>
  )
}

export default MiscellaneousIssuePage;
