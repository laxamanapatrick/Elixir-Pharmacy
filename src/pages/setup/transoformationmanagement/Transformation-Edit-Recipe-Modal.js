import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import PageScrollModal from '../../../components/PageScrollModal'
import apiClient from '../../../services/apiClient'
import { AiFillMinusCircle } from 'react-icons/ai'
import { IoIosAddCircle } from 'react-icons/io'
import DeleteRecipeConfirmation from './edit-recipe/Delete-Recipe-Confirmation'
import AddRecipeConfirmation from './edit-recipe/Add-Recipe-Confirmation'
import { RiFileList3Fill } from 'react-icons/ri'
import RemovedItems from './edit-recipe/Removed-Items'
import EditQuantityModal from './edit-recipe/Edit-Quantity-Modal'
import Ask from './edit-recipe/Ask'

const TransformationEditRecipeModal = ({
  formulaId,
  formulaItemCode,
  formulaItemDescription,
  formulaQuantity,
  isOpen,
  onClose,
  fetchFormula
}) => {

  const [recipes, setRecipes] = useState([])
  const [requirementId, setRequirementId] = useState(null)

  const [quantityRemaining, setQuantityRemaining] = useState()
  const [currentQuantity, setCurrentQuantity] = useState()
  const [totalQuantityData, setTotalQuantityData] = useState(null)

  const [addRecipeDisabler, setAddRecipeDisabler] = useState(false)
  const [saveDisabler, setSaveDisabler] = useState(true)

  const [quantity, setQuantity] = useState(null)

  const { isOpen: isDeleteConfirmationOpen, onOpen: openDeleteConfirmation, onClose: closeDeleteConfirmation } = useDisclosure()
  const { isOpen: isAddModalOpen, onOpen: openAddModal, onClose: closeAddModal } = useDisclosure()
  const { isOpen: isRemovedItemsOpen, onOpen: openRemovedItems, onClose: closeRemovedItems } = useDisclosure()
  const { isOpen: isEditQuantityOpen, onOpen: openEditQuantity, onClose: closeEditQuantity } = useDisclosure()

  const fetchFormulationRequirementsApi = async () => {
    const res = await apiClient.get(`Transformation/GetAllFormulaWithRequirementByFormulaId/${formulaId}`)
    return res.data
  }

  const fetchRecipe = () => {
    fetchFormulationRequirementsApi(formulaId).then(res => {
      setRecipes(res)
    })
  }

  useEffect(() => {
    fetchRecipe()
  }, [formulaId]);

  useEffect(() => {
    if (recipes.length) {

      let totalQuantity = recipes.map((q) => parseFloat(q.requirementQuantity))
      let sum = totalQuantity.reduce((a, b) => a + b)

      setTotalQuantityData(sum)
      setQuantityRemaining(formulaQuantity - sum)
      setCurrentQuantity(sum)

      if (formulaQuantity <= sum) {
        setAddRecipeDisabler(true)
      } else {
        setAddRecipeDisabler(false)
      }
      if (formulaQuantity === sum) {
        setSaveDisabler(false)
      } else {
        setSaveDisabler(true)
      }

    }
    else {
      setAddRecipeDisabler(false)
      setQuantityRemaining(null)
      setCurrentQuantity(null)
    }
  }, [recipes, formulaQuantity])

  const deleteItemHandler = (data) => {
    setRequirementId(data)
    openDeleteConfirmation()
  }

  const addItemHandler = () => {
    fetchRecipe()
    openAddModal()
  }

  const removedItemHandler = () => {
    openRemovedItems()
  }

  const editQuantityHandler = (id, quantity) => {
    setRequirementId(id)
    setQuantity(quantity)
    openEditQuantity()
  }

  const { isOpen: isAskOpen, onOpen: openAsk, onClose: closeAsk } = useDisclosure()
  const closeHandler = () => {
    if (formulaQuantity != currentQuantity) {
      fetchFormula()
      openAsk()
    } else {
      onClose()
    }
  }

  return (
    <Modal
      size='5xl'
      isOpen={isOpen} onClose={() => { }}
      isCentered
    >

      <ModalOverlay />

      <ModalContent>
        <ModalHeader>
          <VStack><Text>Transformation Formula Requirements</Text></VStack>
        </ModalHeader>

        <ModalCloseButton
          onClick={closeHandler}
        />

        <ModalBody>

          {/* Table of submitted */}
          <Flex justifyContent='space-between'>
            <HStack>
              <Flex mb={2} flexDirection='column' justifyContent='left'>
                <Text>
                  Code: {formulaItemCode}
                </Text>
                <Text>
                  Description: {formulaItemDescription}
                </Text>
              </Flex>
            </HStack>

            <Button
              onClick={() => addItemHandler()}
              disabled={addRecipeDisabler}
              bgColor='secondary'
              color='white'
              _hover={{ bgColor: 'accent' }}
              size='sm' mt={2}
            >
              <Text mr={2}>Add Requirement</Text> <IoIosAddCircle fontSize='25px' />
            </Button>

          </Flex>

          <PageScrollModal>
            <Table variant='striped' size="sm">
              <Thead>
                <Tr bgColor="secondary" >
                  <Th color="white"></Th>
                  <Th color="white">ID</Th>
                  <Th color="white">Item Code</Th>
                  <Th color="white">Item Description</Th>
                  <Th color="white">Quantity (editable)</Th>
                  <Th color="white">Remove</Th>
                </Tr>
              </Thead>
              <Tbody>
                {recipes?.map((recipe, i) =>
                  <Tr key={i}>
                    <Td> </Td>
                    <Td>{recipe.requirementId}</Td>
                    <Td>{recipe.requirementCode}</Td>
                    <Td>{recipe.requirementDescription}</Td>
                    <Td>
                      <Button
                        onClick={() => editQuantityHandler(recipe.requirementId, recipe.requirementQuantity)}
                        p={0} background='none'
                      >
                        {recipe.requirementQuantity}
                      </Button>
                    </Td>
                    <Td>
                      <Button
                        onClick={() => deleteItemHandler(recipe.requirementId)}
                        p={0}
                        background='none'
                        color='secondary'
                      >
                        <AiFillMinusCircle fontSize='25px' />
                      </Button>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
            <Box mt={5} mb={5}>
              <Button
                onClick={() => removedItemHandler()}
                bgColor='secondary' color='white' size='sm' _hover={{ bgColor: 'accent' }}
              >
                <Text mr={2}>List of removed requirements</Text> <RiFileList3Fill fontSize='22px' />
              </Button>
            </Box>
          </PageScrollModal>

          <Text>Quantity Needed: {formulaQuantity}</Text>
          <Text>Current Quantity Added: {currentQuantity}</Text>
          <Text fontWeight='semibold'>Remaining Quantity Needed: {quantityRemaining}</Text>

        </ModalBody>

        <ModalFooter>
          <Button
            disabled={saveDisabler}
            variant='ghost' onClick={closeHandler}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent >

      {
        isDeleteConfirmationOpen && (
          <DeleteRecipeConfirmation
            isOpen={isDeleteConfirmationOpen}
            onClose={closeDeleteConfirmation}
            onOpen={openDeleteConfirmation}
            requirementId={requirementId}
            fetchRecipeTable={fetchRecipe}
            fetchFormula={fetchFormula}
          />
        )
      }

      {
        isAddModalOpen && (
          <AddRecipeConfirmation
            isOpen={isAddModalOpen}
            onClose={closeAddModal}
            onOpen={openAddModal}
            formulaId={formulaId}
            formulaQuantity={formulaQuantity}
            fetchRecipeTable={fetchRecipe}
            recipes={recipes}
            totalQuantityData={totalQuantityData}
            fetchFormula={fetchFormula}
          />
        )
      }

      {
        isRemovedItemsOpen && (
          <RemovedItems
            formulaId={formulaId}
            fetchRecipe={fetchRecipe}
            isOpen={isRemovedItemsOpen}
            onClose={closeRemovedItems}
            onOpen={openRemovedItems}
            currentQuantity={currentQuantity}
            formulaQuantity={formulaQuantity}
            fetchFormula={fetchFormula}
          />
        )
      }

      {
        isEditQuantityOpen && (
          <EditQuantityModal
            isOpen={isEditQuantityOpen}
            onClose={closeEditQuantity}
            id={requirementId}
            quantity={quantity}
            fetchRecipe={fetchRecipe}
            currentQuantity={currentQuantity}
            formulaQuantity={formulaQuantity}
            fetchFormula={fetchFormula}
          />
        )
      }

      {
        isAskOpen && (
          <Ask
            isOpen={isAskOpen}
            onClose={closeAsk}
            onCloseEditModal={onClose}
            fetchFormula={fetchFormula}
          />
        )
      }

    </Modal >
  )
}

export default TransformationEditRecipeModal