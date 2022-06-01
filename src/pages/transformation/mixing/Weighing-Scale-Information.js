import React from 'react'
import { Box, Button, ButtonGroup, Flex, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { FaCloudscale } from 'react-icons/fa'

export const WeighingScaleInformation = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Flex w='full' flexDirection='column'>

            <Text color='white' bgColor='secondary' textAlign='center'>Weighing Scale Information</Text>

            <HStack justifyContent='space-between' mt={2}>
                <HStack spacing={5}>
                    <Text bgColor='secondary' color='white' px={10} textAlign='start' fontSize='sm'>Batch:</Text>
                    <Text bgColor='gray.200' border='1px' px={12} fontSize='sm'>1</Text>
                </HStack>
                <HStack spacing={5}>
                    <Text bgColor='secondary' color='white' px={10} textAlign='start' fontSize='sm'>Quantity Batch:</Text>
                    <Text bgColor='gray.200' border='1px' px={12} fontSize='sm'>150</Text>
                </HStack>
                <HStack spacing={1}>
                    <Text bgColor='secondary' color='white' px={10} textAlign='start' fontSize='sm'>Weighing Scale:</Text>
                    <FaCloudscale fontSize='25px' />
                    <Text bgColor='gray.200' border='1px' px={12} fontSize='sm'>200</Text>
                </HStack>
            </HStack>

            <Flex bgColor='gray.200' justifyContent='end' mt={5}>
                <Button size='sm' colorScheme='blue' px={7} onClick={() => onOpen()}>Save</Button>
            </Flex>

            {
                isOpen && (
                    <SaveModal
                        isOpen={isOpen}
                        onClose={onClose}
                    />
                )
            }

        </Flex>
    )
}

const SaveModal = ({ isOpen, onClose }) => {
    return (
        <Modal isCentered size='xl' isOpen={isOpen} onClose={() => { }}>
            <ModalContent>
                <ModalHeader bgColor='secondary'>
                    <Flex justifyContent='center'>
                        <Text fontSize='md' color='white'>Raw Materials LOT</Text>
                    </Flex>
                </ModalHeader>

                <ModalBody>
                    <VStack justifyContent='center'>
                        <Text my={4}>Where do you want to place this Raw Material?</Text>
                        <HStack w='full' spacing={4} justifyContent='space-between'>
                            <Text w='60%'>Batch</Text>
                            <Input readOnly bgColor='gray.200' value={1 ? 1 : null} />
                        </HStack>
                        <HStack w='full' spacing={4} justifyContent='space-between'>
                            <Text w='60%'>Expiration Date</Text>
                            <Input readOnly bgColor='gray.200' value={"11/?/1999" ? "11/?/1999" : null} />
                        </HStack>
                        <HStack w='full' spacing={4} justifyContent='space-between'>
                            <Text w='57%'>Lot Name</Text>
                            <Select bgColor='#fff8dc'>
                                <option>1</option>
                                <option>1</option>
                                <option>1</option>
                            </Select>
                        </HStack>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup size='sm' mt={4}>
                        <Button colorScheme='blue'>Save</Button>
                        <Button colorScheme='red' onClick={onClose}>Cancel</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}