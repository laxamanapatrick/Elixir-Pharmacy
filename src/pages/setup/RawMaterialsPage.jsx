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
import apiClient from '../../services/apiClient';
import { FcAddDatabase } from 'react-icons/fc'
import { IoMdBarcode } from 'react-icons/io'
import { RiEditBoxFill } from 'react-icons/ri'
import { GiChoice } from 'react-icons/gi'
import { useDisclosure } from '@chakra-ui/react';
import { ToastComponent } from '../../components/Toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { decodeUser } from '../../services/decode-user';
import PageScroll from '../../components/PageScroll';
import PageScrollReusable from '../../components/PageScroll-Reusable';
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

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string(),
    itemCode: yup.string().required("Item Code is required"),
    itemDescription: yup.string().required("Item Description is required"),
    itemCategoryId: yup.string().required("Item Category is required"),
    uomId: yup.string().required("UOM is required"),
    bufferLevel: yup.number().required().typeError("Must be a number")
  })
})

const fetchRawApi = async (pageNumber, pageSize, status, search) => {
  const res = await apiClient.get(`RawMaterial/GetAllRawMaterialWithPaginationOrig/${status}?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`)
  return res.data
}

const RawMaterialsPage = () => {
  const [raws, setRaws] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState(true)
  const [search, setSearch] = useState("")
  const [codeDisable, setCodeDisable] = useState(false)

  const [printData, setPrintData] = useState({
    itemCode: '',
    itemDescription: ''
  })

  const toast = useToast()
  const [pageTotal, setPageTotal] = useState(undefined);
  const { isOpen: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure()
  const { isOpen: isPrint, onOpen: openPrint, onClose: closePrint } = useDisclosure()

  const { register, handleSubmit, formState: { errors, isValid }, setValue, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        id: "",
        itemCode: "",
        itemDescription: "",
        itemCategoryId: "",
        uomId: "",
        bufferLevel: "",
        addedBy: currentUser.userName,
      }
    }
  })

  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount, pages, setPageSize, pageSize } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 5 },
  })

  const fetchRaw = () => {
    fetchRawApi(currentPage, pageSize, status, search).then(res => {
      setIsLoading(false)
      setRaws(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchRaw()
  }, [status, pageSize, currentPage, search])

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage)
  }

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value)
    setPageSize(pageSize)
  }

  const statusHandler = (data) => {
    setStatus(data)
  }

  const changeStatusHandler = (id, status) => {
    let routeLabel;
    if (status) {
      routeLabel = "InActiveRawMaterial"
    } else {
      routeLabel = "ActivateRawMaterial"
    }

    apiClient.put(`RawMaterial/${routeLabel}/${id}`, { id: id }).then((res) => {
      ToastComponent("Success", "Raw Material Updated", "success", toast)
      fetchRaw()
    }).catch(err => {
      console.log(err);
    })
  }

  const searchHandler = (inputValue) => {
    setSearch(inputValue)
  }

  const editHandler = (raw) => {
    openDrawer()
    setValue("formData", {
      id: raw.id,
      itemCode: raw.itemCode,
      itemDescription: raw.itemDescription,
      itemCategoryId: raw.itemCategoryId,
      uomId: raw.uomId,
      bufferLevel: raw.bufferLevel,
      modifiedBy: currentUser.userName,
    })
    setCodeDisable(true)
  }

  const newRawsHandler = () => {
    setCodeDisable(false)
    openDrawer()
    reset()
  }

  const printHandler = ({ itemCode, itemDescription }) => {
    if (itemCode && itemDescription) {
      setPrintData({
        itemCode: itemCode,
        itemDescription: itemDescription
      })
      openPrint()
    } else {
      setPrintData({
        itemCode: '',
        itemDescription: ''
      })
    }
  }

  const { isOpen: isPrintAll, onClose: closePrintAll, onOpen: openPrintAll } = useDisclosure()
  const printBarcodeHandler = () => {
    if (raws) {
      openPrintAll()
    }
  }

  return (
    // <RawMaterialsContext.Provider value={{raws}}>
    <Flex p={5} w='full' flexDirection='column'>

      <Flex mb={2} justifyContent='space-between'>
        <HStack>
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              children={<FaSearch color='gray.300' />}
            />
            <Input type='text' placeholder='Search: Item Code'
              onChange={(e) => searchHandler(e.target.value)}
              focusBorderColor='accent'
            />
          </InputGroup>
        </HStack>

        <HStack>
          <Text>STATUS: </Text>
          <Select
            onChange={(e) => statusHandler(e.target.value)}
          >
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </Select>
        </HStack>
      </Flex>

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
                  <Th color='white'>ID</Th>
                  <Th color='white'>Item Code</Th>
                  <Th color='white'>Item Description</Th>
                  <Th color='white'>Item Category</Th>
                  <Th color='white'>UOM</Th>
                  <Th color='white'>Buffer Level</Th>
                  <Th color='white'>Date Added</Th>
                  <Th color='white'>Added By</Th>
                  <Th color='white'>Print</Th>
                  <Th color='white'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {raws.rawmaterial?.map(raw =>
                  <Tr
                    key={raw.id}
                  >
                    <Td>{raw.id}</Td>
                    <Td>{raw.itemCode}</Td>
                    <Td>{raw.itemDescription}</Td>
                    <Td>{raw.itemCategory}</Td>
                    <Td>{raw.uom}</Td>
                    <Td>{raw.bufferLevel.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                    <Td>{raw.dateAdded}</Td>
                    <Td>{raw.addedBy}</Td>
                    <Td>
                      <Button
                        onClick={() => printHandler(raw)}
                        p={0} background='none' color='secondary'
                      >
                        <AiFillPrinter />
                      </Button>
                    </Td>
                    <Td>
                      <Flex>
                        <HStack>
                          <Button p={0} background='none' color='secondary'
                            onClick={() => editHandler(raw)}
                          >
                            <RiEditBoxFill />
                          </Button>
                          <Popover>
                            <PopoverTrigger>
                              <Button p={0} background='none'><GiChoice /></Button>
                            </PopoverTrigger>
                            <Portal>
                              <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverBody>
                                  <VStack>
                                    {raw.isActive === true ? <Text>Are you sure you want to set this raw material inactive?</Text> : <Text>Are you sure you want to set this raw material active?</Text>}
                                    <Button bgColor='secondary' color='white' _hover={{ bgColor: 'accent' }}
                                      onClick={() => changeStatusHandler(raw.id, raw.isActive)}
                                    >
                                      Yes
                                    </Button>
                                  </VStack>
                                </PopoverBody>
                              </PopoverContent>
                            </Portal>
                          </Popover>
                        </HStack>
                      </Flex>
                    </Td>
                  </Tr>
                )
                }
              </Tbody>
            </Table>
          )
        }
      </PageScroll>

      <Flex justifyContent='space-between' mt={5}>
        <HStack>
          <Button leftIcon={<FcAddDatabase color='white' />} bgColor='secondary'
            onClick={newRawsHandler}
            _hover={{ bgColor: 'accent' }}
          >
            <Text color='white'>New Raw Material</Text>
          </Button>
          <Button leftIcon={<IoMdBarcode color='white' />} bgColor='secondary'
            onClick={printBarcodeHandler}
            _hover={{ bgColor: 'accent' }}
          >
            <Text color='white'>Print all active barcode</Text>
          </Button>
        </HStack>

        {
          isDrawerOpen && (
            <DrawerComponent
              isOpen={isDrawerOpen}
              onClose={closeDrawer}
              register={register}
              errors={errors}
              isValid={isValid}
              handleSubmit={handleSubmit}
              fetchRaw={fetchRaw}
              codeDisable={codeDisable}
            />
          )
        }

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
            />
          )
        }

        <Stack>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious bg="secondary" color='white' p={1} _hover={{ bg: 'accent', color: 'white' }}>{"<<"}</PaginationPrevious>
              <PaginationPageGroup ml={1} mr={1}>
                {pages.map((page) => (
                  <PaginationPage
                    _hover={{ bg: 'accent', color: 'white' }}
                    p={3}
                    bg="secondary"
                    color='white'
                    key={`pagination_page_${page}`}
                    page={page}
                  />
                ))}
              </PaginationPageGroup>
              <HStack>
                <PaginationNext bg="secondary" color='white' p={1} _hover={{ bg: 'accent', color: 'white' }}>{">>"}</PaginationNext>
                <Select
                  onChange={handlePageSizeChange}
                  variant='filled'
                >
                  <option value={Number(5)}>5</option>
                  <option value={Number(10)}>10</option>
                  <option value={Number(25)}>25</option>
                  <option value={Number(50)}>50</option>
                </Select>
              </HStack>
            </PaginationContainer>
          </Pagination>
        </Stack>

      </Flex>
    </Flex>
    // </RawMaterialsContext.Provider>
  )
};

export default RawMaterialsPage;


const DrawerComponent = ({ isOpen, onClose, register, errors, isValid, handleSubmit, fetchRaw, codeDisable }) => {
  const [uom, setUom] = useState([])
  const [category, setCategory] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const toast = useToast()

  const submitHandler = (data) => {
    try {
      if (data.formData.id === "") {
        delete data.formData["id"]
        setisLoading(true)
        const res = apiClient.post("RawMaterial/CreateNewRawMaterials", data.formData).then((res) => {
          ToastComponent("Success", "New raw create", "success", toast)
          setisLoading(false)
          fetchRaw()
          onClose(onClose)
        }).catch(err => {
          setisLoading(false)
          ToastComponent("Error", err.response.data, "error", toast)
          data.formData.id = "" // add property id to objects for if condition
        })
      } else {
        const res = apiClient.put(`RawMaterial/UpdateRawMaterials/${data.formData.id}`, data.formData).then((res) => {
          ToastComponent("Success", "Raw Updated", "success", toast)
          setisLoading(false)
          fetchRaw()
          onClose(onClose)
        }).catch(err => {
          ToastComponent("Update Failed", err.response.data, "warning", toast)
        })
      }
    } catch (err) {
    }
  }

  const fetchUom = async () => {
    try {
      const res = await apiClient.get('Uom/GetAllActiveUOM')
      setUom(res.data)
    } catch (error) {

    }
  }

  useEffect(() => {
    try {
      fetchUom()
    } catch (error) {
    }
  }, []);

  const fetchCategory = async () => {
    try {
      const res = await apiClient.get('RawMaterial/GetAllActiveItemCategories')
      setCategory(res.data)
    } catch (error) {

    }
  }

  useEffect(() => {
    try {
      fetchCategory()
    } catch (error) {
    }
  }, []);

  return (
    <Flex>
      <Drawer
        isOpen={isOpen}
        placement='center'
        onClose={onClose}
      >
        <DrawerOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth='1px'>
              Raw Materials Form
            </DrawerHeader>
            <DrawerBody>

              <Stack spacing='7px'>

                <Box>
                  <FormLabel>Item Code:</FormLabel>
                  <Input
                    disabled={codeDisable}
                    readOnly={codeDisable}
                    _disabled={{ color: 'black' }}
                    bgColor={codeDisable && 'gray.300'}
                    placeholder='Please enter Item Code'
                    {...register("formData.itemCode")}
                  />
                  <Text color="danger" fontSize="xs">{errors.formData?.itemCode?.message}</Text>
                </Box>

                <Box>
                  <FormLabel>Item Description:</FormLabel>
                  <Input
                    placeholder='Please enter Item Description'
                    {...register("formData.itemDescription")}
                  />
                  <Text color="danger" fontSize="xs">{errors.formData?.itemDescription?.message}</Text>
                </Box>

                <Box>
                  <Stack>
                    <Text fontWeight='semibold'>Item Category:</Text>
                    {
                      category.length > 0 ? (<Select
                        {...register("formData.itemCategoryId")}
                        placeholder='Select Item Category'>
                        {category.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.itemCategoryName}</option>
                        ))}

                      </Select>) : "loading"
                    }

                    <Text color="danger" fontSize="xs">{errors.formData?.itemCategoryId?.message}</Text>
                  </Stack>
                </Box>

                <Box>
                  <Stack>
                    <Text fontWeight='semibold'>UOM:</Text>
                    {
                      uom.length > 0 ? (<Select
                        {...register("formData.uomId")}
                        placeholder='Select UOM'>
                        {uom.map(uom => (
                          <option key={uom.id} value={uom.id}>{uom.uoM_Code}</option>
                        ))}

                      </Select>) : "loading"
                    }

                    <Text color="danger" fontSize="xs">{errors.formData?.uomId?.message}</Text>
                  </Stack>
                </Box>

                <Box>
                  <FormLabel>Buffer Level:</FormLabel>
                  <Input
                    placeholder='Please enter Buffer Level'
                    {...register("formData.bufferLevel")}
                  />
                  <Text color="danger" fontSize="xs">{errors.formData?.bufferLevel?.message}</Text>
                </Box>

              </Stack>

            </DrawerBody>

            <DrawerFooter borderTopWidth='1px'>
              <Button variant='outline' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                type='submit'
                bgColor='secondary'
                color='white'
                _hover={{ bgColor: 'accent' }}
                disabled={!isValid}
                isLoading={isLoading}
              >
                Submit
              </Button>
            </DrawerFooter>

          </DrawerContent>
        </form>
      </Drawer>
    </Flex>
  )

}

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
            <Text>{printData?.itemDescription}</Text>
            <VStack spacing={0} w='90%' ml={4} justifyContent='center'>
              <Barcode width={2} height={30} value={printData?.itemCode} />
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

const PrintAllBarcodeModal = ({ isOpen, onClose }) => {

  const [raws, setRaws] = useState([])

  const componentRef = useRef()

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const fetchAllActiveRawMatsApi = async () => {
    const res = await apiClient.get(`RawMaterial/GetAllActiveRawMaterials`)
    return res.data
  }

  const fetchAllActiveRawMats = () => {
    fetchAllActiveRawMatsApi().then(res => {
      setRaws(res)
    })
  }

  useEffect(() => {
    fetchAllActiveRawMats()

    return () => {
      setRaws([])
    }
  }, [])

  console.log(raws)

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
                    <Th color='white'>Barcode</Th>
                    <Th color='white'>Item Code</Th>
                    <Th color='white'>Item Description</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {
                    raws?.map((item, i) =>
                      <Tr key={i}>
                        <Td>
                          <Barcode width={2} height={30} value={item.itemCode} />
                        </Td>
                        <Td>{item.itemCode}</Td>
                        <Td>{item.itemDescription}</Td>
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
