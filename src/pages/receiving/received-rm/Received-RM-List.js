import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    Flex,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger,
    Portal,
    Select,
    Skeleton,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useToast,
    VStack,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    FormLabel,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ButtonGroup
} from '@chakra-ui/react';
import apiClient from '../../../services/apiClient';
import { FcAddDatabase } from 'react-icons/fc'
import { IoMdBarcode } from 'react-icons/io'
import { RiEditBoxFill } from 'react-icons/ri'
import { GiChoice } from 'react-icons/gi'
import { useDisclosure } from '@chakra-ui/react';
import { ToastComponent } from '../../../components/Toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { decodeUser } from '../../../services/decode-user';
import PageScroll from '../../../components/PageScroll';
import PageScrollReusable from '../../../components/PageScroll-Reusable';
import {
    Pagination,
    usePagination,
    PaginationNext,
    PaginationPage,
    PaginationPrevious,
    PaginationContainer,
    PaginationPageGroup,
} from '@ajna/pagination'
import { FaSearch } from 'react-icons/fa';
import { AiFillPrinter } from 'react-icons/ai'
import { useReactToPrint } from 'react-to-print';
import Barcode from 'react-barcode';

const currentUser = decodeUser()

const fetchWarehouseIdApi = async () => {
    const res = await apiClient.get(`Warehouse/GetAllListOfWarehouseReceivingId`)
    return res.data
}

export const ReceivedRMList = () => {

    const [warehouseIdData, setWarehouseIdData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [printData, setPrintData] = useState({
        warehouseId: '',
        itemCode: '',
        itemDescription: '',
        expirationDays: '',
        expirationDate: ''
    })

    const fetchWarehouseId = () => {
        fetchWarehouseIdApi().then(res => {
            setIsLoading(false)
            setWarehouseIdData(res)
        })
    }

    useEffect(() => {
        fetchWarehouseId()

        return () => {
            setWarehouseIdData([])
        }
    }, [])

    const { isOpen: isPrint, onClose: closePrint, onOpen: openPrint } = useDisclosure()
    const printHandler = ({ id, itemCode, itemDescription, expirationDay, expirationDate }) => {
        if (id) {
            setPrintData({
                warehouseId: id,
                itemCode: itemCode,
                itemDescription: itemDescription,
                expirationDays: expirationDay,
                expirationDate: expirationDate
            })
            openPrint()
        } else {
            setPrintData({
                warehouseId: '',
                itemCode: '',
                itemDescription: '',
                expirationDay: '',
                expirationDate: ''
            })
        }
    }

    const { isOpen: isPrintAll, onClose: closePrintAll, onOpen: openPrintAll } = useDisclosure()
    const printBarcodeHandler = () => {
        if (warehouseIdData) {
            openPrintAll()
        }
    }

    return (
        <Flex p={5} w='full' flexDirection='column'>

            <PageScroll>
                {
                    isLoading ? (
                        <Stack width="full">
                            <Skeleton height='20px' />
                            <Skeleton height='20px' />
                            <Skeleton height='20px' />
                            <Skeleton height='20px' />
                            <Skeleton height='20px' />
                            <Skeleton height='20px' />
                        </Stack>
                    ) : (
                        <Table variant='striped' size='sm'>
                            <Thead>
                                <Tr bgColor='secondary'>
                                    <Th color='white'>Warehouse ID</Th>
                                    <Th color='white'>Item Code</Th>
                                    <Th color='white'>Item Description</Th>
                                    <Th color='white'>Actual Good</Th>
                                    <Th color='white'>Expiration Day</Th>
                                    <Th color='white'>Expiration Date</Th>
                                    <Th color='white'>Print</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {warehouseIdData?.map(items =>
                                    <Tr
                                        key={items.id}
                                    >
                                        <Td>{items.id}</Td>
                                        <Td>{items.itemCode}</Td>
                                        <Td>{items.itemDescription}</Td>
                                        <Td>{items.actualGood}</Td>
                                        <Td>{items.expirationDay}</Td>
                                        <Td>{items.expirationDate}</Td>
                                        <Td>
                                            <Button
                                                onClick={() => printHandler(items)}
                                                p={0} background='none' color='secondary'
                                            >
                                                <AiFillPrinter />
                                            </Button>
                                        </Td>
                                    </Tr>
                                )
                                }
                            </Tbody>
                        </Table>
                    )
                }
            </PageScroll>

            <Flex justifyContent='start' mt={5}>
                <Button leftIcon={<IoMdBarcode color='white' />} bgColor='secondary'
                    onClick={printBarcodeHandler}
                    _hover={{ bgColor: 'accent' }}
                >
                    <Text color='white'>Print all active barcode</Text>
                </Button>

                {
                    isPrint && (
                        <PrinterModal
                            isOpen={isPrint}
                            onClose={closePrint}
                            printData={printData}
                        />
                    )
                }

                {
                    isPrintAll && (
                        <PrintAllBarcodeModal
                            isOpen={isPrintAll}
                            onClose={closePrintAll}
                            warehouseIdData={warehouseIdData}
                        />
                    )
                }

            </Flex>
        </Flex>
    )
};


const PrinterModal = ({ isOpen, onClose, printData }) => {

    const componentRef = useRef()

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <AiFillPrinter fontSize='50px' />
                    </Flex>
                </ModalHeader>
                <ModalBody mt={5}>
                    <VStack spacing={0} justifyContent='center' ref={componentRef}>
                        <Text>{printData?.itemCode}</Text>
                        <Text>{printData?.itemDescription}</Text>
                        {/* <Text>Expiration Days: {printData?.expirationDays}</Text> */}
                        <Text>Expiration Date: {printData?.expirationDate}</Text>
                        <VStack spacing={0} w='90%' ml={4} justifyContent='center'>
                            <Barcode width={2} height={30} value={printData?.warehouseId} />
                        </VStack>
                    </VStack>
                </ModalBody>
                <ModalFooter mt={10}>
                    <ButtonGroup size='xs'>
                        <Button colorScheme='blue' onClick={handlePrint}>Print</Button>
                        <Button variant='ghost' onClick={onClose}>Close</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

const PrintAllBarcodeModal = ({ isOpen, onClose, warehouseIdData }) => {

    const componentRef = useRef()

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='5xl'>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <AiFillPrinter fontSize='50px' />
                    </Flex>
                </ModalHeader>
                <ModalBody mt={5}>
                    <VStack spacing={0} justifyContent='center'>
                        <PageScrollReusable minHeight='400px' maxHeight='500px'>
                            <Table size='sm' ref={componentRef}>
                                <Thead bgColor='secondary'>
                                    <Tr>
                                        <Th color='white'>Warehouse Id</Th>
                                        <Th color='white'>Item Code</Th>
                                        <Th color='white'>Item Description</Th>
                                        <Th color='white'>Expiration Days</Th>
                                        <Th color='white'>Expiration Date</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        warehouseIdData?.map((item, i) =>
                                            <Tr key={i}>
                                                <Td>
                                                    <Barcode width={2} height={30} value={item.id} />
                                                </Td>
                                                <Td>{item.itemCode}</Td>
                                                <Td>{item.itemDescription}</Td>
                                                <Td>{item.expirationDay}</Td>
                                                <Td>{item.expirationDate}</Td>
                                            </Tr>
                                        )
                                    }
                                </Tbody>
                            </Table>
                        </PageScrollReusable>
                    </VStack>
                </ModalBody>
                <ModalFooter mt={10}>
                    <ButtonGroup size='xs'>
                        <Button colorScheme='blue' onClick={handlePrint}>Print</Button>
                        <Button variant='ghost' onClick={onClose}>Close</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )

}
