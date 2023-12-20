import { useContext } from "react";
import { TextField } from "@shopify/polaris";
import { Button } from "@chakra-ui/react";
import OptionSetContext from "@/context/OptionSetContext";

export default function CollectionResource() {
  const { initialCollections } = useContext(OptionSetContext);

  return (
    <TextField
      placeholder="Search collections"
      connectedRight={
        <Button 
          size="md" 
          fontSize="sm" 
          variant="outline" 
          borderColor="#353535" 
          color="#353535" 
          fontWeight="500" 
          height="34px"
        >Browse</Button>
      }
    />
  )
}