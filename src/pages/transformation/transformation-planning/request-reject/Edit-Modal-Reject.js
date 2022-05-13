import React from 'react'
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Button,
    ButtonGroup,
    Flex,
    Heading,
    HStack,
    Input,
    Select,
    Text,
    VStack
} from '@chakra-ui/react'
import DatePicker from 'react-datepicker'

const EditModalReject = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='4xl'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <HStack justifyContent='center'>
                        <Text fontSize='l' fontWeight='semibold'>Raw Materials Information</Text>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />
                <ModalBody>
                    <Flex justifyContent='space-between' mt={10}>
                        <VStack>
                            <HStack w='full'>
                                <Text fontSize='sm' fontWeight='semibold' w='40%'>
                                    Item Code:
                                </Text>
                                <Select bgColor='#ffffe0'>
                                    <option></option>
                                </Select>
                            </HStack>
                            <HStack w='full'>
                                <Text fontSize='sm' fontWeight='semibold' w='40%'>
                                    Item Description:
                                </Text>
                                <Input bgColor='gray.200' />
                            </HStack>
                            <HStack w='full'>
                                <Text fontSize='sm' fontWeight='semibold' w='40%'>
                                    UOM:
                                </Text>
                                <Input bgColor='gray.200' />
                            </HStack>
                        </VStack>
                        <VStack>
                            <HStack w='full'>
                                <Text fontSize='sm' fontWeight='semibold' w='40%'>
                                    Prod Plan:
                                </Text>
                                <DatePicker />
                            </HStack>
                            <HStack w='full'>
                                <Text fontSize='sm' fontWeight='semibold' w='40%'>
                                    Version:
                                </Text>
                                <Input bgColor='#ffffe0' />
                            </HStack>
                            <HStack w='full'>
                                <Text fontSize='sm' fontWeight='semibold' w='40%'>
                                    Batch:
                                </Text>
                                <Input bgColor='#ffffe0' />
                            </HStack>
                            <HStack w='full'>
                                <Text fontSize='sm' fontWeight='semibold' w='40%'>
                                    Quantity:
                                </Text>
                                <Input bgColor='gray.200' />
                            </HStack>
                        </VStack>
                    </Flex>

                </ModalBody>
                <ModalFooter>
                    <Flex justifyContent='end' w='full' mt={8}>
                        <ButtonGroup size='sm'>
                            <Button colorScheme='blue' px={6}>SAVE</Button>
                            <Button colorScheme='red' onClick={onClose}>CANCEL</Button>
                        </ButtonGroup>
                    </Flex>
                </ModalFooter>
            </ModalContent>

        </Modal>
    )
}

export default EditModalReject