import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  InputAdornment
} from '@mui/material';
import { MdClear } from 'react-icons/md';
import { BsFillTrashFill } from 'react-icons/bs';

import QuotationTable from './QuotationTable';
import './App.css';

const products = [
  { code: "p001", name: "Product A", price: 100 },
  { code: "p002", name: "Product B", price: 200 },
  { code: "p003", name: "Product C", price: 150 },
  { code: "p004", name: "Product D", price: 250 },
];

function App() {
  const qtyRef = useRef(null);
  const discountRef = useRef(null);
  const ppuRef = useRef(null);

  const [selectedProductCode, setSelectedProductCode] = useState(products[0].code);
  const [currentPrice, setCurrentPrice] = useState(products[0].price);
  const [dataItems, setDataItems] = useState([]);

  useEffect(() => {
    const selectedProduct = products.find((p) => p.code === selectedProductCode);
    if (selectedProduct) {
      setCurrentPrice(selectedProduct.price);
    }
  }, [selectedProductCode]);

  const addItem = () => {
    if (!qtyRef.current || !discountRef.current || !ppuRef.current) {
      console.error("One or more input refs are not available.");
      return;
    }

    const selectedProduct = products.find((p) => p.code === selectedProductCode);
    if (!selectedProduct) {
      console.error("Selected product not found.");
      return;
    }

    const newItem = {
      id: Date.now(),
      item: selectedProduct.name,
      ppu: parseFloat(ppuRef.current.value),
      qty: parseInt(qtyRef.current.value, 10),
      discount: parseFloat(discountRef.current.value) || 0,
    };

    const existingItemIndex = dataItems.findIndex(
      (item) => item.item === newItem.item && item.ppu === newItem.ppu
    );

    let updatedDataItems;
    if (existingItemIndex > -1) {
      updatedDataItems = [...dataItems];
      updatedDataItems[existingItemIndex].qty += newItem.qty;

      // *** NEW LOGIC FOR DISCOUNT MERGING ***
      // If a new discount is entered for the item that is being merged,
      // update the discount for that merged row.
      // This assumes the discount entered in the form should be the one that applies to the combined row.
      if (newItem.discount !== 0) { // Only update if a non-zero discount was entered
         updatedDataItems[existingItemIndex].discount = newItem.discount;
      }
      // If newItem.discount is 0 and the existing discount was something else,
      // we keep the existing discount. If both are 0, it remains 0.
      // This interpretation aligns with "discount applies to the whole lot (each row)".
      // If a new discount is provided, it becomes the discount for that lot.
      // If no new discount is provided, the existing one persists.
    } else {
      updatedDataItems = [...dataItems, newItem];
    }

    setDataItems(updatedDataItems);

    if (qtyRef.current) qtyRef.current.value = 1;
    if (discountRef.current) discountRef.current.value = '';
  };

  const deleteByIndex = (index) => {
    const newDataItems = dataItems.filter((_, i) => i !== index);
    setDataItems(newDataItems);
  };

  const handleClearAll = () => {
    setDataItems([]);
    if (qtyRef.current) qtyRef.current.value = 1;
    if (discountRef.current) discountRef.current.value = '';
    setSelectedProductCode(products[0].code);
    setCurrentPrice(products[0].price);
  };

  const handlePriceChange = (event) => {
    setCurrentPrice(parseFloat(event.target.value));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
        {dataItems.length > 0 && (
          <Button variant="outlined" onClick={handleClearAll} color="secondary" startIcon={<MdClear />}>
            Clear All
          </Button>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Input Panel */}
        <Grid item xs={12} md={4} sx={{ backgroundColor: "#f0f0f0", p: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>Add Item</Typography>

          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="item-select-label">Item</InputLabel>
              <Select
                labelId="item-select-label"
                id="item-select"
                value={selectedProductCode}
                label="Item"
                onChange={(e) => setSelectedProductCode(e.target.value)}
              >
                {products.map((p) => (
                  <MenuItem key={p.code} value={p.code}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              label="Price Per Unit"
              type="number"
              inputRef={ppuRef}
              value={currentPrice}
              onChange={handlePriceChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              label="Quantity"
              type="number"
              inputRef={qtyRef}
              defaultValue={1}
              fullWidth
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              label="Discount"
              type="number"
              inputRef={discountRef}
              defaultValue={0}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
            <Button variant="contained" onClick={addItem} fullWidth>
              Add
            </Button>
          </Box>
        </Grid>

        {/* Quotation Table Panel */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4">
              Quotation
            </Typography>
            {dataItems.length === 0 && <Typography variant="body1">No items</Typography>}
          </Box>
          <QuotationTable
            data={dataItems}
            deleteByIndex={deleteByIndex} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;

