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
  PopoverHeader,
  Tooltip
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
import TransformationEditRecipeModal from './transoformationmanagement/Transformation-Edit-Recipe-Modal';

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

const TransformationManagementPage = () => {

  const [formulas, setFormulas] = useState([])
  const [formulaId, setFormulaId] = useState()
  const [itemCode, setItemCode] = useState()
  const [itemDescription, setItemDescription] = useState()
  const [quantity, setQuantity] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState(true)
  const [search, setSearch] = useState("")

  const [qh, setQh] = useState(null)

  const toast = useToast()

  const [pageTotal, setPageTotal] = useState(undefined);
  const { isOpen: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure()
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure()
  const { isOpen: isViewingModalOpen, onOpen: openViewingModal, onClose: closeViewingModal } = useDisclosure()
  const { isOpen: isEditRecipeOpen, onOpen: openEditRecipeModal, onClose: closeEditRecipeModal } = useDisclosure()

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
      setIsLoading(false)
      setFormulas(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchFormula()
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

  //Formula Code

  const editHandler = (formula) => {
    openDrawer()
    setValue("formData", {
      id: formula.id,
      itemCode: formula.itemCode,
      itemDescription: formula.itemDescription,
      uom: formula.uom,
      quantity: formula.quantity,
      modifiedBy: currentUser.userName
    })
  }

  const newFormulaHandler = () => {
    openDrawer()
    reset()
  }

  //Recipe

  const recipeHandler = (id, itemCode, itemDescription, quantity) => {
    setFormulaId(id)
    setItemCode(itemCode)
    setItemDescription(itemDescription)
    setQuantity(quantity)
    // setTooltipValue(true)
    openModal()
  }

  const recipeViewing = (id, itemCode, itemDescription, quantity) => {
    setFormulaId(id)
    setItemCode(itemCode)
    setItemDescription(itemDescription)
    setQuantity(quantity)
    openViewingModal()
  }

  const editRecipeHandler = (id, itemCode, itemDescription, quantity) => {
    setFormulaId(id)
    setItemCode(itemCode)
    setItemDescription(itemDescription)
    setQuantity(quantity)
    openEditRecipeModal()
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
                  <Th color='white'>Requirements</Th>
                  <Th color='white'>ID</Th>
                  <Th color='white'>Formula Code</Th>
                  <Th color='white'>Formula Description</Th>
                  <Th color='white'>Version</Th>
                  <Th color='white'>Quantity</Th>
                  {/* <Th color='white'>UOM</Th> */}
                  <Th color='white'>Date Added</Th>
                  <Th color='white'>Added by</Th>
                  <Th color='white'>Actions</Th>
                  {/* <Th color='white'>Edit</Th> */}
                </Tr>
              </Thead>
              <Tbody>
                {formulas.formula?.map(formula =>
                  <Tr key={formula.id}>

                    <Td p={1}>
                      <HStack>

                        {
                          formula.countFormula === true ?
                            (
                              <Button
                                bgColor={formula.countQuantity != formula.quantity ? 'danger' : ''}
                                disabled={formula.countFormula == false}
                                hidden={formula.countFormula == false}
                                onClick={() => editRecipeHandler(formula.id, formula.itemCode, formula.itemDescription, formula.quantity)}
                                title={formula.countQuantity != formula.quantity ? 'Requirements Incomplete' : 'Edit Requirements'}
                                p={0} bg='none'
                              >
                                <RiEditBoxFill />
                              </Button>
                            )
                            :
                            (
                              <Button
                                disabled={formula.countFormula == true}
                                hidden={formula.countFormula == true}
                                onClick={() => recipeHandler(formula.id, formula.itemCode, formula.itemDescription, formula.quantity)}
                                title='Add Recipe'
                                p={0} bg='none'
                              >
                                <AiFillMedicineBox />
                              </Button>
                            )
                        }

                        {/* Redundant */}

                        <Button
                          disabled={true}
                          hidden={true}
                          onClick={() => recipeViewing(formula.id, formula.itemCode, formula.itemDescription, formula.quantity)}
                          title='View Recipe'
                          p={0} bg='none'
                        >
                          <AiOutlineFundView />
                        </Button>

                      </HStack>
                    </Td>
                    
                    <Td>{formula.id}</Td>
                    <Td>{formula.itemCode}</Td>
                    <Td>{formula.itemDescription}</Td>
                    <Td>{formula.version}</Td>
                    <Td>{formula.quantity.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                    {/* <Td>{formula.quantity}</Td> */}
                    {/* <Td>{formula.uom}</Td> */}
                    <Td>{formula.dateAdded}</Td>
                    <Td>{formula.addedBy}</Td>

                    <Td p={0}>
                      <HStack>

                        <Flex>
                          <HStack>

                            <Button
                              // disabled={formula.countFormula == true}
                              // hidden={formula.countFormula == true}
                              onClick={() => editHandler(formula)}
                              title='Edit Formula'
                              p={0} bg='none'
                            >
                              <RiEditBoxFill />
                            </Button>

                            <Popover>
                              <PopoverTrigger>
                                <Button
                                  p={0} bg='none'
                                  title='Change Status'
                                >
                                  <GiChoice />
                                </Button>
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

                      </HStack>
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
              fetchFormula={fetchFormula}
            />
          )
        }

        {
          isEditRecipeOpen && (
            <TransformationEditRecipeModal
              isOpen={isEditRecipeOpen}
              onClose={closeEditRecipeModal}
              onOpen={openEditRecipeModal}
              formulaId={formulaId}
              formulaItemCode={itemCode}
              formulaItemDescription={itemDescription}
              formulaQuantity={quantity}
              fetchFormula={fetchFormula}
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