import { useState, useContext } from "react";
import { Collapsible, LegacyCard, FormLayout, HorizontalStack, Text, Box } from "@shopify/polaris";
import { Button, ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";
import { IoDuplicate, IoTrashBin } from "react-icons/io5";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RxDragHandleDots2  } from "react-icons/rx";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import OptionSetContext from "@/context/OptionSetContext";
import Option from "../Options";
import { initialOption, initialOptionError, optionTypes } from "@/utils/constants";

export default function OptionForm() {
  const { options, setOptions, optionErrors, setOptionErrors, setIsDirty } = useContext(OptionSetContext);
  const [opens, setOpens] = useState(Array(options.length).fill(false));
  const [key, setKey] = useState(options.length);

  const handleToggle = (index) => {
    const newOpens = [...opens];
    newOpens[index] = !opens[index];
    setOpens(newOpens);
  }

  const handleAddOption = () => {
    const newOpens = [...opens];
    newOpens.push(false);
    const newOptions = [...options];
    newOptions.push({...initialOption, order: key});
    const newOptionErrors = [...optionErrors];
    newOptionErrors.push({...initialOptionError});
    setKey(key+1);
    setIsDirty(true);
    setOpens(newOpens);
    setOptions(newOptions);
    setOptionErrors(newOptionErrors);
  }

  const handleDuplicateOption = (index) => {
    const newOpens = [...opens];
    newOpens.splice(index + 1, 0, false);
    const newOptions = [...options];
    const option = {...newOptions[index], order: key};
    newOptions.splice(index + 1, 0, option);
    const newOptionErrors = [...optionErrors];
    const optionError = {...newOptionErrors[index]};
    newOptionErrors.splice(index +1, 0, optionError);
    setKey(key+1);
    setIsDirty(true);
    setOpens(newOpens);
    setOptions(newOptions);
    setOptionErrors(newOptionErrors);
  }

  const handleDeleteOption = (index) => {
    const newOpens = [...opens];
    newOpens.splice(index, 1)
    const newOptions = [...options];
    newOptions.splice(index, 1);
    const newOptionErrors = [...optionErrors];
    newOptionErrors.splice(index, 1);
    setIsDirty(true);
    setOpens(newOpens);
    setOptions(newOptions);
    setOptionErrors(newOptionErrors);
  }

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const newOpens = [...opens];
    const [reOrderOpen] = newOpens.splice(result.source.index, 1);
    newOpens.splice(result.destination.index, 0, reOrderOpen);
    const newOptions = [...options];
    const [reorderedOption] = newOptions.splice(result.source.index, 1);
    newOptions.splice(result.destination.index, 0, reorderedOption);
    const newOptionErrors = [...optionErrors];
    const [reOrderOptionError] = newOptionErrors.splice(result.source.index, 1);
    newOptionErrors.splice(result.destination.index, 0, reOrderOptionError);
    setIsDirty(true);
    setOpens(newOpens);
    setOptions(newOptions);
    setOptionErrors(newOptionErrors);
  }

  return (
    <LegacyCard title="Options" sectioned>
      <FormLayout>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="options" key="options">
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                <FormLayout>
                  {console.log('updated', options)}
                  {options.map((option, index) => (
                    <Draggable key={`id-${index}`} draggableId={`id-${index}`} index={index}>
                      {(provided) => (
                        <Box {...provided.draggableProps} ref={provided.innerRef}>
                          <LegacyCard subdued={true} padding="400">
                            <LegacyCard.Section>
                              <HorizontalStack align="space-between" blockAlign="center">
                                <HorizontalStack blockAlign="center">
                                  <Button
                                    size="sm"
                                    variant="plain" 
                                    fontWeight="500" 
                                    color="blue.500"
                                    padding="0"
                                    marginRight="10px"
                                    fontSize="14px"
                                    onClick={() => handleToggle(index)}
                                    rightIcon={opens[index] ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                  >{option.label ? option.label : "Untitled Option"}</Button>
                                  <Text color="subdued" as="p">Type: {optionTypes.find(type => type.value == option.type).label}</Text>
                                </HorizontalStack>
                                  
                                <ButtonGroup variant="segmented">
                                  <Tooltip ml='-5px' py='5px' label='Duplicate option' placement='top' bg='white' color='blue.500' fontSize='13px'>
                                    <IconButton 
                                      size={"sm"}
                                      variant="outline"
                                      colorScheme="blue"
                                      aria-label="in-cart edit"
                                      border="none"
                                      icon={<IoDuplicate size="18px" />}
                                      onClick={() => handleDuplicateOption(index)}
                                    />
                                  </Tooltip>
                                  <Tooltip ml='-5px' py='5px' label='Delete option' placement='top' bg='white' color='blue.500' fontSize='13px'>
                                    <IconButton 
                                      size={"sm"}
                                      variant="outline"
                                      colorScheme="blue"
                                      aria-label="in-cart edit"
                                      border="none"
                                      isDisabled={options.length === 1}
                                      icon={<IoTrashBin size="18px" />} 
                                      onClick={() => handleDeleteOption(index)}
                                    />
                                  </Tooltip>
                                  <Tooltip ml='-5px' py='5px' label='Reorder option' placement='top' bg='white' color='blue.500' fontSize='13px'>
                                    <IconButton 
                                      size={"sm"}
                                      variant="outline"
                                      colorScheme="blue"
                                      aria-label="in-cart edit"
                                      border="none"
                                      isDisabled={options.length === 1}
                                      icon={<RxDragHandleDots2 size="20px" />} 
                                      {...provided.dragHandleProps}
                                    />
                                  </Tooltip>
                                </ButtonGroup>
                              </HorizontalStack>
                            </LegacyCard.Section>
                            <Collapsible
                              open={opens[index]}
                              id={`id-${index}`}
                              transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
                            >
                              <Option key={option.order} option={option} index={index} />
                            </Collapsible>
                          </LegacyCard>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                </FormLayout>
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
        <Button size="sm" h="34px" variant="solid" colorScheme="blue" onClick={handleAddOption}>Add new option</Button>
      </FormLayout>
    </LegacyCard>
  )
}