import React, { useEffect, useState } from 'react';
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
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  PopoverHeader
} from '@chakra-ui/react';
import apiClient from '../../services/apiClient';
import { FcAddDatabase } from 'react-icons/fc'
import { RiEditBoxFill } from 'react-icons/ri'
import { AiFillMedicineBox, AiFillMinusCircle, AiFillTag } from 'react-icons/ai'
import { GiChoice } from 'react-icons/gi'
import { useDisclosure } from '@chakra-ui/react';
import { ToastComponent } from '../../components/Toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { decodeUser } from '../../services/decode-user';
import PageScroll from '../../components/PageScroll';
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
import { AiOutlineFundView } from 'react-icons/ai';
import DrawerComponent from './transoformationmanagement/TransformationManagement-Drawer';
import ModalComponent from './transoformationmanagement/TransformationManagement-Modal';
import TransformationManagementModalViewing from './transoformationmanagement/TransformationManagement-Modal-Viewing';

const currentUser = decodeUser()

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string(),
    itemCode: yup.string().required("Item code is required"),
    itemDescription: yup.string().required("Item code is required"),
    uom: yup.string().required("UOM is required"),
    quantity: yup.number().required("Quantity is required").typeError("Must be a number")
  })
})

const fetchFormulaApi = async (pageNumber, pageSize, status, search) => {
  const res = await apiClient.get(`Transformation/GetAllFormulaWithPaginationOrig/${status}?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`)
  return res.data
}

const TransformationManagementPage = ({ disableAddRecipehandler }) => {
  const [formulas, setFormulas] = useState([])
  const [formulaId, setFormulaId] = useState()
  const [itemCode, setItemCode] = useState()
  const [itemDescription, setItemDescription] = useState()
  const [disableAddRecipeButton, setDisableAddRecipeButton] = useState(false)
  const [quantity, setQuantity] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState(true)
  const [search, setSearch] = useState("")
  const toast = useToast()
  const [pageTotal, setPageTotal] = useState(undefined);
  const { isOpen: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure()
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure()
  const { isOpen: isViewingModalOpen, onOpen: openViewingModal, onClose: closeViewingModal } = useDisclosure()

  const { register, handleSubmit, formState: { errors, isValid }, setValue, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        id: "",
        itemCode: "",
        itemDescription: "",
        uom: "",
        quantity: null,
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

  const fetchFormula = () => {
    fetchFormulaApi(currentPage, pageSize, status, search).then(res => {
      setFormulas(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchFormula()
    setIsLoading(false)
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
      routeLabel = "InActiveFormula"
    } else {
      routeLabel = "ActivateFormula"
    }

    apiClient.put(`Transformation/${routeLabel}/${id}`, { id: id }).then((res) => {
      ToastComponent("Success", "Formula Updated", "success", toast)
      fetchFormula()
    }).catch(err => {
      console.log(err);
    })
  }

  const searchHandler = (inputValue) => {
    setSearch(inputValue)
  }

  // const editHandler = (formula) => {
  //   openDrawer()
  //   setValue("formData", {
  //     id: formula.id,
  //     itemCode: formula.itemCode,
  //     itemDescription: formula.itemDescription,
  //     uom: formula.uom,
  //     quantity: formula.quantity,
  //     modifiedBy: currentUser.userName
  //   })
  // }

  const newFormulaHandler = () => {
    openDrawer()
    reset()
  }

  const recipeHandler = (id, itemCode, itemDescription, quantity) => {
    setFormulaId(id)
    setItemCode(itemCode)
    setItemDescription(itemDescription)
    setQuantity(quantity)
    openModal()
  }

  const recipeViewing = (id, itemCode, itemDescription, quantity) => {
    setFormulaId(id)
    setItemCode(itemCode)
    setItemDescription(itemDescription)
    setQuantity(quantity)
    openViewingModal()
  }

  return (
    <Flex p={5} w='full' flexDirection='column'>
      <Flex mb={2} justifyContent='space-between'>

        <HStack>
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              children={<FaSearch color='gray.300' />}
            />
            <Input type='text' placeholder='Search: Item Code' onChange={(e) => searchHandler(e.target.value)} focusBorderColor='accent' />
          </InputGroup>
        </HStack>

        <HStack>
          <Text>STATUS: </Text>
          <Select onChange={(e) => statusHandler(e.target.value)}>
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
                  <Th color='white'>Formula Code</Th>
                  <Th color='white'>Formula Description</Th>
                  <Th color='white'>Version</Th>
                  <Th color='white'>Quantity</Th>
                  {/* <Th color='white'>UOM</Th> */}
                  <Th color='white'>Date Added</Th>
                  <Th color='white'>Added by</Th>
                  <Th color='white'>Requirements</Th>
                  <Th color='white'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {formulas.formula?.map(formula =>
                  <Tr key={formula.id}>
                    <Td>{formula.id}</Td>
                    <Td>{formula.itemCode}</Td>
                    <Td>{formula.itemDescription}</Td>
                    <Td>{formula.version}</Td>
                    <Td>{formula.quantity}</Td>
                    {/* <Td>{formula.uom}</Td> */}
                    <Td>{formula.dateAdded}</Td>
                    <Td>{formula.addedBy}</Td>
                    <Td>
                      <Button
                        disabled={formula.countFormula > 1 && true}
                        onClick={() => recipeHandler(formula.id, formula.itemCode, formula.itemDescription, formula.quantity)}
                        p={0} background='none' color='secondary'
                      >
                        <AiFillMedicineBox />
                      </Button>

                      <Button
                        disabled={formula.countFormula <= 1 && true}
                        onClick={() => recipeViewing(formula.id, formula.itemCode, formula.itemDescription, formula.quantity)}
                        p={0} background='none' color='secondary'
                      >
                        <AiOutlineFundView />
                      </Button>
                    </Td>
                    <Td>
                      <Flex>
                        <HStack>

                          {/* <Button p={0} background='none' color='secondary' onClick={() => editHandler(formula)}>
                            <RiEditBoxFill />
                          </Button> */}

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
                                    {formula.isActive === true ? <Text>Are you sure you want to set <br /> this formula inactive?</Text> : <Text>Are you sure you want to set <br /> this formula active?</Text>}
                                    {/* <Select w='50%' placeholder='reason'>
                                      <option>test</option>
                                    </Select> */}
                                    <Button
                                      bgColor='secondary'
                                      color='white'
                                      _hover={{ bgColor: 'accent' }}
                                      onClick={() => changeStatusHandler(formula.id, formula.isActive)}
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
        <Button leftIcon={<FcAddDatabase color='white' />} bgColor='secondary'
          onClick={newFormulaHandler}
          _hover={{ bgColor: 'accent' }}
        >
          <Text color='white'>New Formula</Text>
        </Button>

        {
          isDrawerOpen && (
            <DrawerComponent
              isOpen={isDrawerOpen}
              onClose={closeDrawer}
              register={register}
              errors={errors}
              isValid={isValid}
              handleSubmit={handleSubmit}
              setValue={setValue}
              fetchFormula={fetchFormula}
            />
          )
        }

        {
          isModalOpen && (
            <ModalComponent
              isOpen={isModalOpen}
              onClose={closeModal}
              onOpen={openModal}
              formulaId={formulaId}
              formulaItemCode={itemCode}
              formulaItemDescription={itemDescription}
              formulaQuantity={quantity}
              fetchFormula={fetchFormula}
            />
          )
        }

        {
          isViewingModalOpen && (
            <TransformationManagementModalViewing
              isOpen={isViewingModalOpen}
              onClose={closeViewingModal}
              onOpen={openViewingModal}
              formulaId={formulaId}
              formulaItemCode={itemCode}
              formulaItemDescription={itemDescription}
              formulaQuantity={quantity}
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
                <Select onChange={handlePageSizeChange} variant='filled'>
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
    </Flex >

  )
};

export default TransformationManagementPage;