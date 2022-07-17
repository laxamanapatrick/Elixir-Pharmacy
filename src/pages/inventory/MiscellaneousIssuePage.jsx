import { VStack } from '@chakra-ui/react';
import React from 'react';
import { RawMaterialsInformation } from './miscissue/Raw-Materials-Information';
import { ListofIssue } from './miscissue/List-of-Issue';
import { ActionButton } from './miscissue/Action-Button';

const MiscellaneousIssuePage = () => {
  return (
    <VStack w='full' p={5} spacing={10}>
      <RawMaterialsInformation />
      <ListofIssue />
      <ActionButton />
    </VStack>
  )
}

export default MiscellaneousIssuePage;
