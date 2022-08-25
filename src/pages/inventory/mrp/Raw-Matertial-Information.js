import React from 'react'
import { Flex, HStack, Input, Select, Text, VStack } from '@chakra-ui/react'

export const RawMatertialInformation = ({ rawMatsInfo, mrpDataLength }) => {
  return (
    <>
      <Flex justifyContent='center' flexDirection='column' w='full'>

        <Flex w='full' justifyContent='space-between'>
          <Text textAlign='center' fontWeight='semibold'>Raw Materials Information:</Text>
          <Text textAlign='center' fontWeight='semibold'>Total Records/page: {mrpDataLength}</Text>
        </Flex>

        <VStack w='full' spacing={6} bgColor='secondary' py={10}>
          <Flex w='95%' justifyContent='space-between'>

            <VStack alignItems='start' w='40%' mx={5}>
              <HStack w='full'>
                <Text w='full' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>Item Code: </Text>\
                <Input w='95%' readOnly bgColor='white' value={rawMatsInfo.itemCode} />
              </HStack>
              <HStack w='full'>
                <Text w='full' bgColor='secondary' color='white' pl={2} pr={10} py={2.5} fontSize='xs'>Item Description: </Text>
                <Input w='98%' readOnly bgColor='white' value={rawMatsInfo.itemDescription} />
              </HStack>
            </VStack>

            <VStack alignItems='start' w='40%' mx={5}>
              <HStack w='full'>
                <Text w='full' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>Stock on Hand: </Text>
                <Input w='95%' readOnly bgColor='white' value={rawMatsInfo.soh.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} />
              </HStack>
              <HStack w='full'>
                <Text w='full' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>Buffer Level: </Text>
                <Input w='95%' readOnly bgColor='white' value={rawMatsInfo.bufferLevel.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} />
              </HStack>
            </VStack>

            <VStack alignItems='start' w='40%' mx={5}>
              <HStack w='full'>
                <Text w='full' bgColor='secondary' color='white' pl={2} py={2.5} fontSize='xs'>Suggested PO: </Text>
                <Input w='95%' readOnly bgColor='white' value={rawMatsInfo.suggestedPo.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} />
              </HStack>
              {/* <HStack w='full'>
                <Text w='full' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>Last Used: </Text>
                <Input w='full' readOnly bgColor='white' value={rawMatsInfo.lastUsed} />
              </HStack> */}
            </VStack>
          </Flex>
        </VStack>
      </Flex>
    </>
  )
}
