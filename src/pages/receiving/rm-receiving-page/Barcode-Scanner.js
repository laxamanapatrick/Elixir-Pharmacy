import React, { useContext } from 'react'
import {
    Flex,
    HStack,
    Input,
    Text,
    Button,
    Stack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Box,
    FormLabel,
    useToast,
    VStack,
    useDisclosure,
} from '@chakra-ui/react'
import { WarehouseContext } from '../../../context/WarehouseContext'
import { BiScan } from 'react-icons/bi'

const BarcodeScanner = ({ isOpen, onClose, code }) => {

    const { setCode } = useContext(WarehouseContext)

    const barcodeHandler = (data) => {
        setCode(data)
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <BiScan fontSize='50px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />
                <ModalBody>
                    <Text mb={3} textAlign='center'>Scan the barcode or provide the item code manually below.</Text>
                    <HStack>
                        <Input
                            onChange={(e) => barcodeHandler(e.target.value)}
                            value={code}
                        />
                        <Button onClick={() => setCode("")}>Clear</Button>
                    </HStack>
                </ModalBody>

                <ModalFooter>
                    {/* <Button onClick={onClose} colorScheme='blue' mr={3}>
                        Close
                    </Button> */}
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default BarcodeScanner