import React from 'react'
import { Box, Button, ButtonGroup, Flex, HStack, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select, Text, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { FaCloudscale } from 'react-icons/fa'
import DatePicker from "react-datepicker";

export const ActualItemQuantity = () => {
    return (
        <Flex w='full' flexDirection='column'>

            <Text color='white' bgColor='secondary' textAlign='center'>Actual Item Quantity</Text>

            <HStack justifyContent='space-between' mt={2}>
                <HStack spacing={1}>
                    <Text bgColor='secondary' color='white' px={10} textAlign='start' fontSize='sm'>Scan Barcode:</Text>
                    {/* <Text bgColor='gray.200' border='1px' px={12} fontSize='sm'>200</Text> */}
                    <Input
                        // onChange={(e) => weightHandler(e.target.value)}
                        // onWheel={(e) => e.target.blur()}
                        // value={totalWeight}
                        // ref={valueRef}
                        // type='number'
                        placeholder='Barcode number'
                        h='15%' w='50%' bgColor='#fff8dc'
                    />
                </HStack>
                <HStack spacing={5}>
                    <Text bgColor='secondary' color='white' px={10} textAlign='start' fontSize='sm'>Remaining Quantity:</Text>
                    <Text bgColor='gray.200' border='1px' px={12} fontSize='sm'>1</Text>
                </HStack>
                <HStack spacing={5}>
                    <Text bgColor='secondary' color='white' px={10} textAlign='start' fontSize='sm'>Actual Quantity:</Text>
                    <Text bgColor='gray.200' border='1px' px={12} fontSize='sm'>{"E"}</Text>
                </HStack>
            </HStack>

            {/* <Text
                bgColor={'e' ? '#fff8dc' : 'success'}
                mt={4} fontSize='sm' fontWeight='semibold'
                w='12.5%'
            >
                Batch Remaining: {"E"}
            </Text> */}

            <Flex bgColor='gray.200' justifyContent='end' mt={5}>
                <Button
                    // onClick={() => onOpen()}
                    // disabled={!totalWeight || !batchRemaining}
                    // disabled={disableSave || !batchRemaining}
                    size='sm' colorScheme='blue' px={7}
                >
                    Add
                </Button>
            </Flex>
        </Flex>
    )
}
