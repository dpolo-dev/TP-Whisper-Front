import { useContext } from "react";
import { Box, FormControl, MenuItem, Select } from "@mui/material";
import { ModelContext } from "../../context/ModelContext";

const ModelSelect = () => {
  const { selectedModel, setSelectedModel } = useContext(ModelContext);

  const handleChange = (event) => {
    setSelectedModel(event.target.value);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 10,
        left: 10,
      }}
    >
      <FormControl variant="outlined" sx={{ minWidth: 150 }}>
        <Select
          labelId="model-select-label"
          value={selectedModel}
          onChange={handleChange}
          label="Model"
        >
          <MenuItem value="Whisper">Whisper</MenuItem>
          {/* <MenuItem value="Google">Google</MenuItem> */}
          <MenuItem value="Azure">Azure</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default ModelSelect;
